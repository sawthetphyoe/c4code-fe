import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDeleteLectureMutation } from '../store';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';
import EditLectureOverlay from './EditLectureOverlay';

const formatDuration = (hour) => {
	if (!hour) return '(0 hr)';
	if (hour === 1) return `(${hour.toFixed(1)} hr)`;
	if (hour > 1) return `(${hour.toFixed(1)} hrs)`;
	if (hour < 1) return `(${Math.round(hour * 60)} mins)`;
};

export default function LectureRow({ lecture, courseId }) {
	const [deleteLecture, deleteResults] = useDeleteLectureMutation();
	const [modalOpen, setModalOpen] = useState(false);

	const onModalClose = useCallback(() => {
		setModalOpen(false);
	}, []);

	return (
		<Paper
			elevation={1}
			sx={{ backgroundColor: '#E7F0F6', pt: 1.5, pb: 1.5, pl: 4, pr: 4 }}
		>
			{deleteResults.isLoading && <LoadingBar />}

			{deleteResults.isError && (
				<Error message={deleteResults.error.data.message} />
			)}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						gap: 2,
						alignItems: 'center',
					}}
				>
					<Typography variant="body2" sx={{ fontSize: 16 }}>
						{' '}
						{lecture.name}
					</Typography>
					<Typography variant="caption" sx={{ lineHeight: '100%' }}>
						{formatDuration(lecture.duration)}
					</Typography>
				</Box>
				<Stack direction="row" spacing={2}>
					<IconButton sx={{ p: 0 }} onClick={() => setModalOpen(true)}>
						<EditRoundedIcon fontSize="small" />
					</IconButton>
					<IconButton
						sx={{ p: 0 }}
						onClick={() => deleteLecture({ courseId, lecture })}
					>
						<DeleteRoundedIcon fontSize="small" />
					</IconButton>
				</Stack>
			</Box>
			<EditLectureOverlay
				courseId={courseId}
				unchangedLecture={lecture}
				open={modalOpen}
				onClose={onModalClose}
			/>
		</Paper>
	);
}
