import {
	Avatar,
	Box,
	Container,
	Rating,
	Stack,
	Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetAllReviewQuery } from '../store';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';

export default function CourseReviewTab() {
	const { id } = useParams();
	const { data, error, isLoading } = useGetAllReviewQuery([
		{
			key: 'course',
			value: id,
		},
		{
			key: 'sort',
			value: '-createdAt',
		},
	]);

	if (isLoading) return <LoadingBar />;

	if (error) return <Error message={error.data.message} />;

	if (data.results === 0)
		return (
			<Container maxWidth="lg">
				<Typography variant="h4" sx={{ textAlign: 'center' }}>
					No reviews yet!
				</Typography>
			</Container>
		);

	const reviews = data.data.data;

	const renderedReviews = reviews.map((r) => (
		<Box key={r._id}>
			<Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
				<Avatar
					src={
						r.student.image && `http://localhost:3005/images/${r.student.image}`
					}
					alt={r.student.firstName}
					sx={{ width: 50, height: 50 }}
				/>
				<Box>
					<Typography
						variant="h6"
						sx={{ mb: 0.5 }}
					>{`${r.student.firstName} ${r.student.lastName}`}</Typography>
					<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
						<Rating value={r.rating} readOnly precision={0.5} size="small" />
						<Typography variant="caption">
							{new Date(r.createdAt).toLocaleDateString('en-UK')}
						</Typography>
					</Box>
				</Box>
			</Box>
			<Typography
				variant="body1"
				sx={{
					p: 3,
					backgroundColor: 'rgba(170, 170, 170, .2)',
					borderRadius: '3px',
					lineHeight: '1.8rem',
				}}
			>
				{r.review}
			</Typography>
		</Box>
	));

	return (
		<Container maxWidth="md">
			<Stack spacing={6}>{renderedReviews}</Stack>
		</Container>
	);
}
