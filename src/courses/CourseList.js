import { useGetAllCoursesQuery, useDeleteCourseMutation } from '../store';
import {
	Container,
	TableContainer,
	Table,
	TableHead,
	TableBody,
	Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TableRow from '../components/TableRow';
import SkeletonList from '../ultis/SkeletonList';
import LoadingBar from '../ultis/LoadingBar';
import Error from '../ultis/Error';

const tableHeads = [
	'NAME',
	'COURSE CODE',
	'CATEGORY',
	'CREATED AT',
	'UPDATED AT',
	'STATUS',
	'',
	'',
];

export default function CourseList({ searchTerm }) {
	const navigate = useNavigate();
	const { data, error, isFetching } = useGetAllCoursesQuery();
	const [deleteCourse, results] = useDeleteCourseMutation();

	const handleCourseEdit = (id) => {
		navigate(`${id}`);
	};

	const handleCourseDelete = (id) => {
		deleteCourse(id);
	};

	if (error) return <Error message={error.data.message} />;

	if (isFetching || results.isLoading)
		return (
			<Container maxWidth="xl">
				<LoadingBar />
				<SkeletonList times={6} spacing={2} />
			</Container>
		);

	if (data.results === 0)
		return (
			<Container maxWidth="xl">
				<Typography variant="h4" sx={{ textAlign: 'center', p: 4 }}>
					No courses yet! Start by adding some courses.
				</Typography>
			</Container>
		);

	const courses = data.data.data.map((course) => {
		return {
			id: course._id,
			info: [
				course.name,
				course.code,
				course.category ? course.category.name : '-',
				new Date(course.createdAt).toLocaleDateString('en-UK'),
				course.updatedAt
					? new Date(course.updatedAt).toLocaleDateString('en-UK')
					: 'Never',
				course.active ? 'Active' : 'Inactive',
			],
		};
	});

	const renderedTableHeads = <TableRow data={tableHeads} />;

	const renderedTableRows = courses
		.filter((course) =>
			course.info[0].toLowerCase().includes(searchTerm.toLowerCase())
		)
		.map((course) => (
			<TableRow
				key={course.id}
				id={course.id}
				data={course.info}
				onEdit={handleCourseEdit}
				onDelete={handleCourseDelete}
			/>
		));

	return (
		<>
			{results.isError && <Error message={results.error.data.message} />}

			<TableContainer sx={{ maxHeight: 800, minHeight: 400 }}>
				<Table stickyHeader>
					<TableHead>{renderedTableHeads}</TableHead>
					<TableBody>{renderedTableRows}</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
