import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
	AppBar,
	Checkbox,
	FormControlLabel,
	Grid,
	IconButton,
	Typography,
} from '@mui/material';
import { useUpdateEnrollmentMutation } from '../store';
import LoadingBar from '../ultis/LoadingBar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// import { LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function EditEnrollmentOverlay({
	unchangedEnrollment,
	open,
	onClose,
}) {
	const [updateEnrollment, results] = useUpdateEnrollmentMutation();
	const [edit, setEdit] = useState(false);
	const [enrollment, setEnrollment] = useState(unchangedEnrollment);

	const handleCancel = useCallback(() => {
		setEnrollment(unchangedEnrollment);
		setEdit(false);
	}, [unchangedEnrollment]);

	useEffect(() => {
		if (results.isSuccess) {
			onClose();
			handleCancel();
		}
	}, [results.isSuccess, onClose, handleCancel]);

	const handleStartDateChange = (value) => {
		setEnrollment({ ...enrollment, startDate: value });
		setEdit(true);
	};

	const handleEndDateChange = (value) => {
		setEnrollment({ ...enrollment, endDate: value });
		setEdit(true);
	};

	const handleCompletedChange = (e) => {
		setEnrollment({ ...enrollment, completed: !enrollment.completed });
		setEdit(true);
	};

	const handleUpdateEnrollmentSubmit = (e) => {
		e.preventDefault();
		updateEnrollment(enrollment);
	};

	const handleClose = () => {
		onClose();
		handleCancel();
	};

	const student = unchangedEnrollment.student;

	return (
		<div>
			{results.isLoading && <LoadingBar />}

			<Dialog open={open} onClose={() => handleClose()} maxWidth="md">
				<AppBar
					position="relative"
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						pl: 4,
						pr: 4,
						pt: 2,
						pb: 2,
					}}
				>
					<Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>
						Edit Enrollment for {`${student.firstName} ${student.lastName}`}
					</Typography>
					<IconButton onClick={() => handleClose()}>
						<CloseRoundedIcon sx={{ color: 'white' }} />
					</IconButton>
				</AppBar>
				<Grid
					container
					spacing={4}
					component="form"
					onSubmit={handleUpdateEnrollmentSubmit}
					sx={{ pt: 6, pb: 8, pl: 16, pr: 16 }}
				>
					<Grid item sm={12}>
						<TextField
							fullWidth
							label="Course *"
							defaultValue={enrollment.course.name}
							disabled
						/>
					</Grid>
					<Grid item sm={6}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								label="Start Date"
								value={enrollment.startDate}
								onChange={handleStartDateChange}
								renderInput={(params) => <TextField {...params} fullWidth />}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item sm={6}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								label="End Date"
								value={enrollment.endDate}
								onChange={handleEndDateChange}
								renderInput={(params) => <TextField {...params} fullWidth />}
							/>
						</LocalizationProvider>
					</Grid>
					<Grid item xs={12}>
						<FormControlLabel
							control={
								<Checkbox
									checked={enrollment.completed}
									onChange={handleCompletedChange}
								/>
							}
							label="Completed"
						/>
					</Grid>
					<Grid item sm={6}>
						<Button
							fullWidth
							variant="contained"
							disabled={!edit}
							type="submit"
						>
							Save
						</Button>
					</Grid>
					<Grid item sm={6}>
						{edit && (
							<Button fullWidth variant="outlined" onClick={handleCancel}>
								CANCEL
							</Button>
						)}
					</Grid>
				</Grid>
			</Dialog>
		</div>
	);
}
