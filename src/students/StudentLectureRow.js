import { Box, Checkbox, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBox = styled((props) => <Box {...props} />)(({ theme }) => ({
	'&': {
		display: 'flex',
		gap: '10px',
		alignItems: 'center',
		cursor: 'pointer',
		transition: 'all 0.1s',
	},
	'&:hover': {
		backgroundColor: '#D9E5ED',
	},
}));

const formatDuration = (hour) => {
	if (!hour) return '(0 hr)';
	if (hour === 1) return `(${hour.toFixed(1)} hr)`;
	if (hour > 1) return `(${hour.toFixed(1)} hrs)`;
	if (hour < 1) return `(${Math.round(hour * 60)} mins)`;
};

export default function StudentLectureRow({
	lecture,
	onLectureChange,
	videoId,
	enrollment,
}) {
	const completed = enrollment.completedLectures
		.map((lec) => lec._id)
		.includes(lecture._id);
	return (
		<StyledBox
			key={lecture._id}
			sx={{
				backgroundColor:
					lecture.url.split('/')[3] === videoId ? '#D9E5ED' : 'transparent',
				pl: 6,
				pr: 6,
				pt: 1,
				pb: 1,
			}}
			onClick={() => {
				onLectureChange(lecture);
			}}
		>
			<Checkbox checked={completed} size="small" style={{ padding: 0 }} />
			<Typography variant="subtitle1" sx={{ fontSize: 18 }}>
				{lecture.name}
			</Typography>
			<Typography sx={{ fontSize: 14 }}>
				{formatDuration(lecture.duration)}
			</Typography>
		</StyledBox>
	);
}
