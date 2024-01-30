import { Avatar, Box, Rating, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetCourseQuery } from '../store';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';

export default function CourseSummary() {
	const { id } = useParams();
	const { data, error, isLoading, isFetching } = useGetCourseQuery(id);

	if (isLoading) return <LoadingBar />;

	if (error) return <Error message={error.data.message} />;

	const course = data.data.data;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
			{isFetching && <LoadingBar />}
			<Avatar
				variant="square"
				sx={{ width: 175, height: 100 }}
				alt={course.name}
				src={course.image && `http://localhost:3005/images/${course.image}`}
			/>
			<Typography variant="h6" sx={{ fontSize: 24, fontWeight: 'bold' }}>
				{course.name}
			</Typography>
			<Typography variant="body2">{course.category.name}</Typography>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
				<Rating defaultValue={course.ratingsAverage} readOnly precision={0.5} />
				<Typography variant="caption">
					({course.numOfRating || 0} Reviews)
				</Typography>
			</Box>
			<Typography variant="body2">
				({course.duration?.toFixed(1) || 0} total hours)
			</Typography>
			<Typography variant="body1" align="justify">
				{course.description}
			</Typography>
		</Box>
	);
}
