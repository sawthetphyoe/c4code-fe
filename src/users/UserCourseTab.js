import {
	Button,
	Container,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	Typography,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import TableRow from '../components/TableRow';
import {
	useDeleteEnrollmentMutation,
	useGetAllEnrollmentsQuery,
} from '../store';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';
import SkeletonList from '../ultis/SkeletonList';
import AddEnrollmentOverlay from './AddEnrollmentOverlay';
import EditEnrollmentOverlay from './EditEnrollmentOverlay';

const tableHeads = ['COURSE NAME', 'START DATE', 'END DATE', 'STATUS', '', ''];

export default function UserCourseTab() {
	const { id } = useParams();
	const { data, error, isLoading, isFetching } = useGetAllEnrollmentsQuery([
		{
			key: 'student',
			value: id,
		},
	]);
	const [deleteEnrollment, deleteResults] = useDeleteEnrollmentMutation();

	const [modalOpen, setModalOpen] = useState(false);

	const [editEnrollment, setEditEnrollment] = useState(null);

	const onModalClose = useCallback(() => {
		setModalOpen(false);
		setEditEnrollment(null);
	}, []);

	const handleEnrollmentEdit = (enrollment) => {
		setEditEnrollment(enrollment);
	};

	const handleEnrollmentDelete = (id) => {
		deleteEnrollment(id);
	};

	if (isLoading)
		return (
			<Container maxWidth="sm">
				<LoadingBar />
				<SkeletonList spacing={4} times={4} />
			</Container>
		);

	if (error) return <Error message={error.data.message} />;

	if (data.results === 0)
		return (
			<Container
				maxWidth="lg"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					gap: 4,
					pb: 4,
				}}
			>
				<Button
					component="label"
					variant="contained"
					onClick={() => setModalOpen(true)}
				>
					+ assign new course
				</Button>
				<Typography variant="h4" sx={{ alignSelf: 'center', p: 4 }}>
					No Courses!
				</Typography>
				<AddEnrollmentOverlay open={modalOpen} onClose={onModalClose} />
			</Container>
		);

	const enrollments = data.data.data.map((enrol) => {

		const info = [
			enrol.course.name,
			new Date(enrol.startDate).toLocaleDateString('en-UK'),
			enrol.endDate
				? new Date(enrol.endDate).toLocaleDateString('en-UK')
				: '-',
		]

		if (enrol.student.role !== 'student') info.push('-')
		return {
			id: enrol._id,
			raw: enrol,
			info,
		};
	});

	const assignCourses = data.data.data.map((enrol) => enrol.course._id);

	const renderedTableHeads = <TableRow data={tableHeads} />;

	const renderedTableRows = enrollments.map((enrol) => {
		const completedDuration = enrol.raw.completedLectures?.reduce(
			(duration, lecture) => duration + lecture.duration,
			0
		);

		const progress =
			completedDuration && enrol.raw.course.duration
				? Math.round((completedDuration / enrol.raw.course.duration) * 100)
				: 0;

		// console.log(enrol.raw.student.role);
		return (
			<TableRow
			key={enrol.id}
			rawData={enrol.raw}
			id={enrol.id}
			progress={enrol.raw.student.role === 'student' ? progress : undefined}
			data={enrol.info}
			onEdit={handleEnrollmentEdit}
			onDelete={handleEnrollmentDelete}
			/>
			)
		})

	return (
		<Container
			maxWidth="lg"
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				gap: 4,
				pb: 4,
			}}
		>
			{(isFetching || deleteResults.isLoading) && <LoadingBar />}

			{deleteResults.isError && (
				<Error message={deleteResults.error.data.message} />
			)}

			<Button
				component="label"
				variant="contained"
				onClick={() => setModalOpen(true)}
			>
				+ assign new course
			</Button>

			<TableContainer sx={{ maxHeight: 800, minHeight: 400 }}>
				<Table stickyHeader>
					<TableHead>{renderedTableHeads}</TableHead>
					<TableBody>{renderedTableRows}</TableBody>
				</Table>
			</TableContainer>
			<AddEnrollmentOverlay
				assignCourses={assignCourses}
				open={modalOpen}
				onClose={onModalClose}
			/>

			{editEnrollment && (
				<EditEnrollmentOverlay
					open
					unchangedEnrollment={editEnrollment}
					onClose={onModalClose}
				/>
			)}
		</Container>
	);
}
