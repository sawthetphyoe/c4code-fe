import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Box, Stack } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { useGetAllLecturesQuery } from '../store';
import LoadingBar from '../ultis/LoadingBar';
import Error from '../ultis/Error';
import StudentLectureRow from './StudentLectureRow';
import { useEffect } from 'react';

const Accordion = styled((props) => (
	<MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
	borderBottom: '1px solid rgba(0, 0, 0, .125)',
	'&:first-of-type': {
		borderTop: '1px solid rgba(0, 0, 0, .125)',
	},
	'&:before': {
		display: 'none',
	},
}));

const AccordionSummary = styled((props) => (
	<MuiAccordionSummary
		expandIcon={
			<PlayArrowRoundedIcon sx={{ fontSize: 22, color: '#574F7D' }} />
		}
		{...props}
	/>
))(({ theme }) => ({
	backgroundColor: '#EFF7FC',
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	backgroundColor: 'rgba(170, 170, 170, .15)',
	padding: 0,
}));

const formatDuration = (hour) => {
	if (!hour) return '(0 hr)';
	if (hour === 1) return `(${hour.toFixed(1)} hr)`;
	if (hour > 1) return `(${hour.toFixed(1)} hrs)`;
	if (hour < 1) return `(${Math.round(hour * 60)} mins)`;
};

export default function StudentSectionAccordion({
	section,
	expanded,
	handleChange,
	videoId,
	onLectureChange,
	enrollment,
}) {
	const { data, error, isLoading } = useGetAllLecturesQuery([
		{
			key: 'section',
			value: section._id,
		},
		{
			key: 'sort',
			value: 'index',
		},
	]);

	useEffect(() => {
		if (data && section.index === 1 && !enrollment.currentLecture) {
			const lectures = data.data.data;
			onLectureChange(lectures[0]);
		}
	}, [enrollment.currentLecture, data, onLectureChange, section]);

	if (isLoading) return <LoadingBar />;

	if (error) return <Error message={error.data.message} />;

	const lectures = data.data.data;

	const renderedLectures = lectures.map((lecture) => {
		return (
			<StudentLectureRow
				key={lecture._id}
				videoId={videoId}
				lecture={lecture}
				onLectureChange={onLectureChange}
				enrollment={enrollment}
			/>
		);
	});

	const autoExpend = lectures
		.map((lec) => lec.url.split('/')[3])
		.includes(videoId);

	return (
		<Accordion
			expanded={expanded === section._id || autoExpend}
			onChange={handleChange(section._id)}
		>
			<AccordionSummary
				aria-controls="panel1d-content"
				id="panel1d-header"
				expanded={expanded}
				sx={{
					backgroundColor:
						expanded === section._id
							? 'rgba(170, 170, 170, .05)'
							: 'rgba(170, 170, 170, .15)',
					pl: 4,
					pr: 4,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Typography
						variant="h6"
						sx={{
							fontSize: 16,
							fontWeight: 'medium',
							textTransform: 'uppercase',
						}}
					>
						{section.name}
					</Typography>
					<Typography sx={{ lineHeight: '100%', fontSize: 14 }}>
						{formatDuration(section.duration)}
					</Typography>
				</Box>
			</AccordionSummary>
			<AccordionDetails
				sx={{
					backgroundColor:
						expanded === section._id
							? 'rgba(170, 170, 170, .05)'
							: 'rgba(170, 170, 170, .15)',
				}}
			>
				<Stack spacing={1} sx={{ pb: 1 }}>
					{renderedLectures}
				</Stack>
			</AccordionDetails>
		</Accordion>
	);
}
