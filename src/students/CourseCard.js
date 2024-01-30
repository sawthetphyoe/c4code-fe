import { Avatar, Box, Button, Paper, Rating, Typography } from '@mui/material';
import LinearProgress, {
	linearProgressClasses,
} from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllReviewQuery } from '../store';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';
import AddReviewOverlay from './AddReviewOverlay';
import EditReviewOverlay from './EditReviewOverlay';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 7,
	borderRadius: 3,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.grey[200],
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 3,
		backgroundColor: '#6F6698',
	},
}));

export default function CourseCard({ course, enrollment }) {
	const navigate = useNavigate();
	const { data, error, isLoading, isFetching } = useGetAllReviewQuery([
		{
			key: 'course',
			value: course._id,
		},
		{
			key: 'student',
			value: enrollment.student._id,
		},
	]);

	const [modalOpen, setModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);

	useEffect(() => {
		setEditModalOpen(false);
		setModalOpen(false);
	}, [data]);

	const onModalClose = useCallback(() => {
		setModalOpen(false);
		setEditModalOpen(false);
	}, []);

	const handleRatingClick = (defReview) => {
		if (defReview) {
			setEditModalOpen(true);
		} else {
			setModalOpen(true);
		}
	};

	const completedDuration = enrollment.completedLectures?.reduce(
		(duration, lecture) => duration + lecture.duration,
		0
	);

	const progress =
		completedDuration && course.duration
			? Math.round((completedDuration / course.duration) * 100)
			: 0;

	if (isLoading || isFetching) return <LoadingBar />;

	if (error) return <Error message={error.data.message} />;

	const review = data.results === 0 ? null : data.data.data[0];

	return (
		<Box>
			<Paper
				sx={{
					width: 330,
					mb: 1.5,
				}}
			>
				<Avatar
					variant="square"
					src={course.image && `http://localhost:3005/images/${course.image}`}
					alt={course.name}
					sx={{ height: 190, width: '100%', cursor: 'pointer' }}
					onClick={() => navigate(`/course/${course._id}/${enrollment._id}`)}
				/>
				<Box sx={{ p: 2 }}>
					<Box
						sx={{
							height: 110,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-around',
						}}
					>
						<Typography variant="h6" sx={{ fontSize: 22, fontWeight: 'bold' }}>
							{course.name}
						</Typography>
						<Typography variant="body1">
							{enrollment.endDate
								? `Expired At: ${new Date(
										enrollment.endDate
								  ).toLocaleDateString('en-UK')}`
								: 'No Expired Date'}
						</Typography>
					</Box>
				</Box>
				<BorderLinearProgress variant="determinate" value={progress} />
			</Paper>
			<Box
				sx={{
					pl: 1,
					pr: 1,
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				{`${progress}% Completed`}
				<Button
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 1,
						cursor: 'pointer',
						p: 0,
					}}
					onClick={() => handleRatingClick(review)}
				>
					<Rating
						defaultValue={review ? review.rating : 0}
						readOnly
						precision={0.5}
					/>
					<Typography
						variant="caption"
						sx={{ textTransform: 'capitalize', color: '#1e1e1e' }}
					>
						Your Rating
					</Typography>
				</Button>
			</Box>
			<AddReviewOverlay
				course={course}
				student={enrollment.student._id}
				open={modalOpen}
				onClose={onModalClose}
			/>
			{review && (
				<EditReviewOverlay
					review={review}
					open={editModalOpen}
					onClose={onModalClose}
				/>
			)}
		</Box>
	);
}
