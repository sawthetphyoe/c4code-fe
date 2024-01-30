import { useGetAllUsersQuery } from '../store';
import { useDeleteUserByIdMutation } from '../store';
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
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';

const tableHeads = [
	'USER',
	'EMAIL',
	'USER TYPE',
	'REGISTERED DATE',
	'LAST LOGIN',
	'',
	'',
];

export default function UserList({ searchTerm }) {
	const navigate = useNavigate();
	const { data, error, isFetching } = useGetAllUsersQuery();
	const [deleteUserById, results] = useDeleteUserByIdMutation();

	const handleUserEdit = (id) => {
		navigate(`${id}`);
	};

	const handleUserDelete = (id) => {
		deleteUserById(id);
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
					No users yet! Start by adding some users.
				</Typography>
			</Container>
		);

	const users = data.data.data.map((user) => {
		return {
			id: user._id,
			info: [
				user.firstName + ' ' + user.lastName,
				user.email,
				user.role.charAt(0).toUpperCase() + user.role.slice(1),
				new Date(user.registeredAt).toLocaleDateString('en-UK'),
				user.lastLogin
					? new Date(user.lastLogin).toLocaleDateString('en-UK')
					: 'Never',
			],
		};
	});

	const renderedTableHeads = <TableRow data={tableHeads} />;

	const renderedTableRows = users
		.filter((user) =>
			user.info[0].toLowerCase().includes(searchTerm.toLowerCase())
		)
		.map((user) => (
			<TableRow
				key={user.id}
				id={user.id}
				data={user.info}
				onEdit={handleUserEdit}
				onDelete={handleUserDelete}
			/>
		));

	return (
		<>
			{results.isError && <Error message={results.error.data.message} />}
			{renderedTableRows.length === 0 ? (
				<Container maxWidth="xl">
					<Typography
						variant="h4"
						component="div"
						sx={{ textAlign: 'center', p: 8 }}
					>
						No Users
					</Typography>
				</Container>
			) : (
				<TableContainer sx={{ maxHeight: 800, minHeight: 400 }}>
					<Table stickyHeader>
						<TableHead>{renderedTableHeads}</TableHead>
						<TableBody>{renderedTableRows}</TableBody>
					</Table>
				</TableContainer>
			)}
		</>
	);
}
