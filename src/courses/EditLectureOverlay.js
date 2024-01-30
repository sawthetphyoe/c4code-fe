import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
	AppBar,
	Box,
	Container,
	Grid,
	IconButton,
	TextField,
	Typography,
} from '@mui/material';
import { useUpdateLectureMutation } from '../store';
import YouTube from 'react-youtube';
// const pattern =
// 	/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/;

// const pattern = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/)/;

const pattern =
	/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/)((\w|-){11})?$/;

const videoOptions = {
	height: 423,
	width: 752,
	playerVars: {
		enablejsapi: 1,
		color: '#574F7D',
		rel: 0,
		origin: 'http://localhost:3000',
	},
};

export default function EditLectureOverlay({
	courseId,
	unchangedLecture,
	open,
	onClose,
}) {
	const [updateLecture, results] = useUpdateLectureMutation();
	const [videoId, setVideoId] = useState(unchangedLecture.url.split('/')[3]);
	const [lecture, setLecture] = useState(unchangedLecture);

	const onReady = (e) => {
		setLecture({
			...lecture,
			duration: (e.target.getDuration() / 60 / 60).toFixed(1),
		});
	};

	useEffect(() => {
		if (lecture.url.match(pattern)) {
			setVideoId(lecture.url.split('/')[3]);
		}
	}, [videoId, lecture]);

	const handleNameChange = (e) => {
		setLecture({ ...lecture, name: e.target.value });
	};

	const handleIndexChange = (e) => {
		setLecture({ ...lecture, index: e.target.value });
	};

	const handleUrlChange = (e) => {
		setLecture({ ...lecture, url: e.target.value });
	};

	const handleCancel = useCallback(() => {
		setLecture(unchangedLecture);
		setVideoId('');
	}, [unchangedLecture]);

	const handleUpdateLectureSubmit = (e) => {
		e.preventDefault();
		updateLecture({ courseId, lecture });
	};

	useEffect(() => {
		if (results.isSuccess) {
			onClose();
			handleCancel();
		}
	}, [results.isSuccess, onClose, handleCancel]);

	const handleClose = () => {
		onClose();
		handleCancel();
	};

	return (
		<div>
			<Dialog open={open} onClose={() => handleClose()} maxWidth="xl">
				<Container sx={{ minHeight: 900, width: 1008 }}>
					<AppBar
						position="relative"
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							pl: 4,
							pr: 4,
							pt: 2,
							pb: 2,
						}}
					>
						<Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
							Insert Video Lecture from Youtube
						</Typography>
						<IconButton onClick={() => handleClose()}>
							<CloseRoundedIcon sx={{ color: 'white' }} />
						</IconButton>
					</AppBar>
					<Container maxWidth="sm" sx={{ mt: 4 }}>
						<Grid
							container
							spacing={2}
							component="form"
							onSubmit={handleUpdateLectureSubmit}
						>
							<Grid item sm={2}>
								<TextField
									fullWidth
									required
									label="Order"
									type="number"
									value={lecture.index}
									onChange={handleIndexChange}
								/>
							</Grid>
							<Grid item sm={10}>
								<TextField
									fullWidth
									required
									label="Lecture Title"
									value={lecture.name}
									onChange={handleNameChange}
								/>
							</Grid>
							<Grid item sm={12}>
								<TextField
									error={!lecture.url.match(pattern)}
									fullWidth
									required
									label="Youtube URL"
									value={lecture.url}
									onChange={handleUrlChange}
								/>
							</Grid>
							<Grid item sm={12}>
								<Container sx={{ width: 752 }}>
									<Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
										Video Preview:
									</Typography>
								</Container>
								{videoId && (
									<YouTube
										videoId={videoId}
										opts={videoOptions}
										onReady={onReady}
									/>
								)}
							</Grid>
							<Grid item sm={12}>
								<Box
									sx={{
										display: 'flex',
										width: '100%',
										justifyContent: 'center',
										mt: 2,
									}}
								>
									<Button
										variant="contained"
										type="submit"
										sx={{ width: 200 }}
										disabled={!videoId}
									>
										Save
									</Button>
								</Box>
							</Grid>
						</Grid>
					</Container>
				</Container>
			</Dialog>
		</div>
	);
}
