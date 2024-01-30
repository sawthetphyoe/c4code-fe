import { Box, Container, Grid, Typography } from '@mui/material';
import { useGetAllCoursesQuery, useGetAllEnrollmentsQuery } from '../store';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';
import CourseCard from './CourseCard';

export default function StudentCourseTab({ user }) {
	const {
		data: enrolData,
		error: enrolError,
		isLoading: enrolLoading,
	} = useGetAllEnrollmentsQuery([
		{
			key: 'student',
			value: user._id,
		},
	]);

	const {
		data: courseData,
		error: courseError,
		isLoading: courseLoading,
	} = useGetAllCoursesQuery([
		{
			key: 'active',
			value: true,
		},
	]);

	if (enrolLoading || courseLoading) return <LoadingBar />;

	if (enrolError) return <Error message={enrolError.data.message} />;

	if (courseError) return <Error message={courseError.data.message} />;

	if (enrolData.results === 0)
		return (
			<Container
				maxWidth="lg"
				sx={{
					display: 'flex',
					justifyContent: 'center',
					mt: 4,
				}}
			>
				<Typography variant="h4">No Courses!</Typography>
			</Container>
		);

	const studentEnrollments = enrolData.data.data;

	const studentCourses = courseData.data.data.filter((course) =>
		studentEnrollments.map((enrol) => enrol.course._id).includes(course._id)
	);

	const renderedCourses = studentCourses.map((course) => {
		const enrollment = studentEnrollments.filter(
			(enrol) => enrol.course._id === course._id
		)[0];
		return (
			<Grid key={course._id} item sm={4}>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<CourseCard course={course} enrollment={enrollment} />
				</Box>
			</Grid>
		);
	});

	return (
		<Container maxWidth="lg" sx={{ mt: 4, minHeight: 550 }}>
			<Grid container spacing={2}>
				{renderedCourses}
			</Grid>
		</Container>
	);
}
