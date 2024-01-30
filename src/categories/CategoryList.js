import { useGetAllCategoriesQuery, useDeleteCategoryMutation } from '../store';
import {
	TableContainer,
	Table,
	TableHead,
	TableBody,
	Container,
	Typography,
} from '@mui/material';
import TableRow from '../components/TableRow';
import { useNavigate } from 'react-router-dom';
import SkeletonList from '../ultis/SkeletonList';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';

const tableHeads = ['NAME', 'CREATED AT', 'NUMBER OF COURSES', '', ''];

export default function UserList({ searchTerm }) {
	const navigate = useNavigate();
	const { data, error, isLoading, isFetching } = useGetAllCategoriesQuery();
	const [deleteCategory, results] = useDeleteCategoryMutation();

	const handleCateEdit = (id) => {
		navigate(`${id}`);
	};

	const handleCateDelete = (id) => {
		deleteCategory(id);
	};

	if (error) return <Error message={error.data.message} />;

	if (isLoading || isFetching || results.isLoading) {
		return (
			<Container maxWidth="lg">
				<LoadingBar />
				<SkeletonList times={6} spacing={2} />
			</Container>
		);
	}

	if (data.results === 0)
		return (
			<Container maxWidth="xl">
				<Typography variant="h4" sx={{ textAlign: 'center', p: 4 }}>
					No categories yet! Start by adding some categories.
				</Typography>
			</Container>
		);

	const categories = data.data.data.map((cate) => {
		return {
			id: cate._id,
			info: [
				cate.name,
				new Date(cate.createdAt).toLocaleDateString('en-UK'),
				cate.numberOfCourses || 0,
			],
		};
	});

	const renderedTableHeads = <TableRow data={tableHeads} />;

	const renderedTableRows = categories
		.filter((cate) =>
			cate.info[0].toLowerCase().includes(searchTerm.toLowerCase())
		)
		.map((cate) => (
			<TableRow
				key={cate.id}
				id={cate.id}
				data={cate.info}
				onEdit={handleCateEdit}
				onDelete={handleCateDelete}
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
