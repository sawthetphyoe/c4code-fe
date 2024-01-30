import * as React from 'react';
import { styled } from '@mui/material/styles';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Box, Button, Stack } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { useDeleteSectionMutation, useGetAllLecturesQuery } from '../store';
import LoadingBar from '../ultis/LoadingBar';
import Error from '../ultis/Error';
import EditSectionOverlay from './EditSectionOverlay';
import LectureRow from './LectureRow';
import AddLectureOverlay from './AddLectureOverlay';

const Accordion = styled((props) => (
	<MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
	'&:not(:last-child)': {
		borderBottom: 0,
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
	backgroundColor: 'rgba(170, 170, 170, .15)',
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
	padding: theme.spacing(2),
	borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const formatDuration = (hour) => {
	if (!hour) return '(0 hr)';
	if (hour === 1) return `(${hour.toFixed(1)} hr)`;
	if (hour > 1) return `(${hour.toFixed(1)} hrs)`;
	if (hour < 1) return `(${Math.round(hour * 60)} mins)`;
};

export default function SectionAccordion({ section, expanded, handleChange }) {
	const { data, error, isLoading, isFetching } = useGetAllLecturesQuery([
		{
			key: 'section',
			value: section._id,
		},
		{
			key: 'sort',
			value: 'index',
		},
	]);
	const [deleteSection, results] = useDeleteSectionMutation();
	const [secModalOpen, setSecModalOpen] = React.useState(false);
	const [addLecModalOpen, setAddLecModalOpen] = React.useState(false);

	const onSecModalClose = React.useCallback(() => {
		setSecModalOpen(false);
	}, []);

	const onAddLecModalClose = React.useCallback(() => {
		setAddLecModalOpen(false);
	}, []);

	if (isLoading) return <LoadingBar />;

	if (error) return <Error message={error.data.message} />;

	const lectures = data.data.data;

	const renderedLectures = lectures.map((lecture) => {
		return (
			<LectureRow
				key={lecture._id}
				lecture={lecture}
				courseId={section.course}
			/>
		);
	});

	return (
		<Accordion
			expanded={expanded === section._id}
			onChange={handleChange(section._id)}
		>
			{(results.isLoading || isFetching) && <LoadingBar />}

			<AccordionSummary
				aria-controls="panel1d-content"
				id="panel1d-header"
				expanded={expanded}
				sx={{
					backgroundColor:
						expanded === section._id
							? 'rgba(170, 170, 170, .05)'
							: 'rgba(170, 170, 170, .15)',
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Typography
						variant="h6"
						sx={{
							fontSize: 18,
							fontWeight: 'bold',
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
			<Box
				sx={{
					display: 'flex',
					gap: 2,
					alignItems: 'center',
					p: 1,
					pl: 4,
					backgroundColor:
						expanded === section._id
							? 'rgba(170, 170, 170, .05)'
							: 'rgba(170, 170, 170, .15)',
				}}
			>
				<Button size="small" onClick={() => setSecModalOpen(true)}>
					<EditRoundedIcon fontSize="small" sx={{ mr: 1 }} />
					Edit
				</Button>
				<Button size="small" onClick={() => deleteSection(section)}>
					<DeleteRoundedIcon fontSize="small" sx={{ mr: 1 }} />
					Delete
				</Button>
			</Box>
			<AccordionDetails
				sx={{
					backgroundColor:
						expanded === section._id
							? 'rgba(170, 170, 170, .05)'
							: 'rgba(170, 170, 170, .15)',
				}}
			>
				<Stack spacing={1}>
					{renderedLectures}
					<Button
						size="small"
						sx={{ backgroundColor: '#E2E2E2', pt: 1, pb: 1 }}
						onClick={() => setAddLecModalOpen(true)}
					>
						+ Add Lecture
					</Button>
				</Stack>
			</AccordionDetails>
			<EditSectionOverlay
				unChangedSection={section}
				open={secModalOpen}
				onClose={onSecModalClose}
			/>
			<AddLectureOverlay
				lectureIndex={lectures.length + 1}
				courseId={section.course}
				sectionId={section._id}
				open={addLecModalOpen}
				onClose={onAddLecModalClose}
			/>
		</Accordion>
	);
}
