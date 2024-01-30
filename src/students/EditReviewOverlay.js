import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
	AppBar,
	Box,
	Grid,
	IconButton,
	Rating,
	Typography,
} from '@mui/material';
import LoadingBar from '../ultis/LoadingBar';
import Error from '../ultis/Error';
import { useUpdateReviewMutation } from '../store';

const labels = {
	0.5: 'Useless',
	1: 'Useless+',
	1.5: 'Poor',
	2: 'Poor+',
	2.5: 'Ok',
	3: 'Ok+',
	3.5: 'Good',
	4: 'Good+',
	4.5: 'Excellent',
	5: 'Excellent+',
};

const getLabelText = (value) => {
	return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
};

export default function EditReviewOverlay({ review, open, onClose }) {
	const [updateReview, results] = useUpdateReviewMutation();
	const [edit, setEdit] = useState(false);
	const [hover, setHover] = useState(-1);
	const [courseReview, setCourseReview] = useState(review);

	const handleCancel = useCallback(() => {
		setCourseReview(review);
		setEdit(false);
	}, [review]);

	const handleReviewChange = (e) => {
		setCourseReview({ ...courseReview, review: e.target.value });
		setEdit(true);
	};

	const handleRatingChange = (e) => {
		setCourseReview({ ...courseReview, rating: +e.target.value });
		setEdit(true);
	};

	const handleCreateReviewSubmit = (e) => {
		e.preventDefault();
		updateReview(courseReview);
	};

	const handleClose = () => {
		onClose();
		handleCancel();
	};

	return (
		<div>
			{results.isLoading && <LoadingBar />}

			{results.isError && <Error message={results.error.data.message} />}

			<Dialog open={open} onClose={() => handleClose()} maxWidth="md">
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
						Why did you leave this rating?
					</Typography>
					<IconButton onClick={() => handleClose()}>
						<CloseRoundedIcon sx={{ color: 'white' }} />
					</IconButton>
				</AppBar>

				<Grid
					container
					spacing={4}
					component="form"
					onSubmit={handleCreateReviewSubmit}
					sx={{ pt: 4, pb: 4, pl: 8, pr: 8, width: 900 }}
				>
					<Grid
						item
						sm={12}
						sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
					>
						<Rating
							precision={0.5}
							value={courseReview.rating}
							onChange={handleRatingChange}
							size="large"
							getLabelText={getLabelText}
							onChangeActive={(event, newHover) => {
								setHover(newHover);
							}}
						/>
						{courseReview.rating !== null && (
							<Box sx={{ ml: 2 }}>
								{labels[hover !== -1 ? hover : courseReview.rating]}
							</Box>
						)}
					</Grid>
					<Grid item sm={12}>
						<TextField
							fullWidth
							// label="Description*"
							multiline
							rows={6}
							value={courseReview.review}
							onChange={handleReviewChange}
							placeholder="Tell use about your own personal experience taking this course. Was it a good match for you?"
						/>
					</Grid>
					<Grid item sm={6}>
						<Button
							fullWidth
							variant="contained"
							disabled={!edit}
							type="submit"
						>
							save
						</Button>
					</Grid>
					<Grid item sm={6}>
						{edit && (
							<Button fullWidth variant="outlined" onClick={handleCancel}>
								CANCEL
							</Button>
						)}
					</Grid>
				</Grid>
			</Dialog>
		</div>
	);
}
