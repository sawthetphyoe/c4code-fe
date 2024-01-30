import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogTitle,
	IconButton,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	Typography,
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

import {
	useGetAllSectionsQuery,
	useGetCourseQuery,
	useGetEnrollmentQuery,
	useUpdateCompletedLectureMutation,
	useUpdateEnrollmentMutation,
} from '../store';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingBar from '../ultis/LoadingBar';
import Error from '../ultis/Error';
import StudentSectionAccordion from '../students/StudentSectionAccordion';
import { useCallback, useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import TableRow from '../components/TableRow';

const videoOptions = {
	height: 585,
	width: 1040,
	playerVars: {
		enablejsapi: 1,
		color: '#574F7D',
		rel: 0,
		origin: 'http://localhost:3000',
	},
};

const tableHeads = ['NAME', 'UPLOADED BY', 'UPLOADED AT', ''];

export default function CoursePlayPage() {
	const { courseId, enrollmentId } = useParams();
	const navigate = useNavigate();
	const [updateEnrollment] = useUpdateEnrollmentMutation();
	const [updateCompletedLecture] = useUpdateCompletedLectureMutation();
	const [currentLecture, setCurrentLecture] = useState('');
	const [expanded, setExpanded] = useState('');
	const [videoId, setVideoId] = useState(undefined);

	const {
		data: courseData,
		error: courseError,
		isLoading: courseLoading,
	} = useGetCourseQuery(courseId);

	const {
		data: enrolData,
		error: enrolError,
		isLoading: enrolLoading,
	} = useGetEnrollmentQuery({ id: enrollmentId });

	const {
		data: sectionData,
		error: sectionError,
		isLoading: sectionLoading,
	} = useGetAllSectionsQuery([
		{
			key: 'course',
			value: courseId,
		},
	]);

	const [downloadFile, setDownloadFile] = useState('');

	useEffect(() => {
		if (enrolData && !enrolError) {
			if (enrolData.data.data.currentLecture) {
				setCurrentLecture(enrolData.data.data.currentLecture);
				// console.log(enrolData.data.data.currentLecture);
				setVideoId(enrolData.data.data.currentLecture.url.split('/')[3]);
			}
		}
	}, [enrolData, enrolError]);

	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : undefined);
	};

	const handleLectureChange = useCallback(
		(lecture) => {
			const id = lecture.url.split('/')[3];
			setCurrentLecture(lecture);
			setVideoId(id);
			if (id !== videoId) {
				updateEnrollment({
					_id: enrolData.data.data._id,
					currentLecture: lecture._id,
				});
			}
		},
		[enrolData, videoId, updateEnrollment]
	);

	const onEnd = (e) => {
		updateCompletedLecture({
			enrollmentId,
			body: { lectureId: currentLecture._id, action: 'add' },
		});
	};

	const handleFileDownload = (filename) => {
		setDownloadFile(filename);
		const link = document.createElement('a');
		link.id = 'helper-link';
		link.target = '_blank';
		link.download = `${filename.split('---')[1]}`;
		link.href = `http://localhost:3005/files/${filename}`;
		link.click();
	};

	useEffect(() => {
		if (!downloadFile) return;
		const helperLink = document.getElementById('helper-link');
		if (helperLink) return () => helperLink.remove();
	}, [downloadFile]);

	if (courseLoading || enrolLoading || sectionLoading) return <LoadingBar />;

	if (courseError) return <Error message={courseError.data.message} />;

	if (enrolError) return <Error message={enrolError.data.message} />;

	if (sectionError) return <Error message={sectionError.data.message} />;

	if (sectionData.results === 0 || courseData.data.data.duration === 0)
		return (
			<Dialog open onClose={() => navigate('/', { replace: true })}>
				<DialogTitle sx={{ width: 450, pl: 4, pr: 4, pt: 4 }}>
					<Typography variant="h5" component="span">
						No lectures yet!
					</Typography>
				</DialogTitle>
				<DialogActions sx={{ mb: 2 }}>
					<Button onClick={() => navigate('/', { replace: true })} autoFocus>
						Go to home page
						<ArrowForwardRoundedIcon sx={{ ml: 2 }} />
					</Button>
				</DialogActions>
			</Dialog>
		);

	const course = courseData.data.data;

	const enrollment = enrolData.data.data;

	const courseSections = sectionData.data.data;

	const files = course.files.map((file) => {
		return {
			id: file._id,
			name: file.name,
			info: [
				file.name.split('---')[1],
				file.uploadedBy.firstName + ' ' + file.uploadedBy.lastName,
				new Date(file.uploadedAt).toLocaleDateString('en-UK'),
			],
		};
	});

	const renderedTableHeads = <TableRow data={tableHeads} />;

	const renderedTableRows = files.map((file) => (
		<TableRow
			key={file.id}
			id={file.id}
			name={file.name}
			data={file.info}
			onDownload={handleFileDownload}
		/>
	));

	const renderedSections = courseSections.map((sec) => (
		<StudentSectionAccordion
			key={sec._id}
			section={sec}
			handleChange={handleChange}
			expanded={expanded}
			onLectureChange={handleLectureChange}
			videoId={videoId}
			enrollment={enrollment}
		/>
	));

	return (
		<Container maxWidth="xl" sx={{ mt: 4, minHeight: 750 }}>
			<Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 4 }}>
				<IconButton onClick={() => navigate('/')}>
					<ArrowBackIosNewRoundedIcon />
				</IconButton>
				<Typography variant="h6" sx={{ fontSize: 28 }}>
					{course.name}
				</Typography>
			</Box>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
				}}
			>
				<Box
					sx={{
						width: '1040px',
						display: 'flex',
						flexDirection: 'column',
						gap: 4,
						alignItems: 'center',
					}}
				>
					{videoId && (
						<YouTube videoId={videoId} opts={videoOptions} onEnd={onEnd} />
					)}
				</Box>
				<Box
					sx={{
						width: '490px',
						height: 585,
						overflowY: 'scroll',
						backgroundColor: 'rgba(170, 170, 170, .15)',
					}}
				>
					<Typography variant="h6" sx={{ p: 2, pl: 4 }}>
						Course Content
					</Typography>
					{renderedSections}
				</Box>
			</Box>

			<Box sx={{ mt: 12 }}>
				<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
					<PlayArrowRoundedIcon
						sx={{ fontSize: 36, color: '#574F7D', padding: 0 }}
					/>
					<Typography variant="h6" sx={{ fontSize: 24 }}>
						Course Materials
					</Typography>
				</Box>
				{course.files.length > 0 ? (
					<TableContainer sx={{ p: 4 }}>
						<Table stickyHeader>
							<TableHead>{renderedTableHeads}</TableHead>
							<TableBody>{renderedTableRows}</TableBody>
						</Table>
					</TableContainer>
				) : (
					<Typography variant="h4" sx={{ textAlign: 'center', p: 8 }}>
						No files yet!
					</Typography>
				)}
			</Box>
		</Container>
	);
}
