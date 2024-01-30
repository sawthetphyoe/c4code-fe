import { IconButton, TableRow as MuiTableRow, Typography } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import LinearProgress, {
	linearProgressClasses,
} from '@mui/material/LinearProgress';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 8,
	borderRadius: 3,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.grey[400],
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 3,
		backgroundColor: '#6F6698',
	},
}));

function LinearProgressWithLabel(props) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box sx={{ width: '100%', mr: 1 }}>
				<BorderLinearProgress variant="determinate" {...props} />
			</Box>
			<Box sx={{ minWidth: 35 }}>
				<Typography variant="body2" color="text.secondary">{`${Math.round(
					props.value
				)}%`}</Typography>
			</Box>
		</Box>
	);
}

LinearProgressWithLabel.propTypes = {
	value: PropTypes.number.isRequired,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.common.black,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 16,
	},
	'&': {
		padding: '18px 36px',
	},
}));

const StyledTableRow = styled(MuiTableRow)(({ theme }) => ({
	'&:nth-of-type(even)': {
		backgroundColor: theme.palette.action.hover,
	},
}));

export default function TableRow({
	id,
	name,
	rawData,
	progress,
	data,
	onEdit,
	onDownload,
	onDelete,
}) {
	const itemCells = data.map((item, index) => (
		<StyledTableCell key={index}>{item}</StyledTableCell>
	));
	return (
		<StyledTableRow>
			{itemCells}

			{progress !== undefined && (
				<StyledTableCell>
					<LinearProgressWithLabel value={progress} />
				</StyledTableCell>
			)}

			{onEdit && (
				<StyledTableCell style={{ padding: 0 }}>
					<IconButton onClick={() => onEdit(rawData || id)}>
						<EditRoundedIcon />
					</IconButton>
				</StyledTableCell>
			)}

			{onDownload && (
				<StyledTableCell style={{ padding: 0 }}>
					<IconButton onClick={() => onDownload(name)}>
						<DownloadRoundedIcon />
					</IconButton>
				</StyledTableCell>
			)}

			{onDelete && (
				<StyledTableCell style={{ padding: 0 }}>
					<IconButton onClick={() => onDelete(id)}>
						<DeleteRoundedIcon />
					</IconButton>
				</StyledTableCell>
			)}
		</StyledTableRow>
	);
}
