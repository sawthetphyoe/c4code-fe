import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
	AppBar,
	Container,
	Grid,
	IconButton,
	MenuItem,
	Typography,
} from '@mui/material';
import { useCreateEnrollmentMutation, useGetAllCoursesQuery } from '../store';
import LoadingBar from '../ultis/LoadingBar';
import { useParams } from 'react-router-dom';
import Error from '../ultis/Error';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// import { LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

export default function AddEnrollmentOverlay({ assignCourses, open, onClose }) {
	const { id } = useParams();
	const { data, error, isLoading } = useGetAllCoursesQuery();
	const [createEnrollment, results] = useCreateEnrollmentMutation();
	const [edit, setEdit] = useState(false);
	const [enrollment, setEnrollment] = useState({
		course: '',
		startDate: null,
		endDate: null,
	});

	useEffect(() => {
		if (results.isSuccess) {
			onClose();
			handleCancel();
		}
	}, [results.isSuccess, onClose]);

	const handleCourseChange = (e) => {
		setEnrollment({ ...enrollment, course: e.target.value });
		setEdit(true);
	};

	const handleStartDateChange = (value) => {
		setEnrollment({ ...enrollment, startDate: value });
		setEdit(true);
	};

	const handleEndDateChange = (value) => {
		setEnrollment({ ...enrollment, endDate: value });
		setEdit(true);
	};

	const handleCreateUserSubmit = (e) => {
		e.preventDefault();
		createEnrollment({
			student: id,
			...enrollment,
		});
	};

	const handleCancel = () => {
		setEnrollment({
			course: '',
			startDate: null,
			endDate: null,
		});
		setEdit(false);
	};

	const handleClose = () => {
		onClose();
		handleCancel();
	};

	if (isLoading) return <LoadingBar />;

	if (error) return <Error message={error.data.message} />;

	const newCourses = data.data.data
		.filter((course) => !assignCourses?.includes(course._id))
		.map((course) => {
			return { value: course._id, label: course.name };
		});

	// if (newCourses.length === 0) return <Error message="No more courses!" />;

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
						Assign a new course
					</Typography>
					<IconButton onClick={() => handleClose()}>
						<CloseRoundedIcon sx={{ color: 'white' }} />
					</IconButton>
				</AppBar>
				{newCourses.length === 0 ? (
					<Container
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							width: 750,
						}}
					>
						<Typography variant="h4" sx={{ alignSelf: 'center', p: 12 }}>
							No more courses!
						</Typography>
					</Container>
				) : (
					<Grid
						container
						spacing={4}
						component="form"
						onSubmit={handleCreateUserSubmit}
						sx={{ pt: 6, pb: 8, pl: 16, pr: 16 }}
					>
						<Grid item sm={12}>
							<TextField
								fullWidth
								select
								label="Course *"
								value={enrollment.course}
								onChange={handleCourseChange}
							>
								{newCourses.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item sm={6}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									label="Start Date"
									value={enrollment.startDate}
									onChange={handleStartDateChange}
									renderInput={(params) => (
										<TextField {...params} fullWidth required />
									)}
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
						<Grid item sm={6}>
							<Button
								fullWidth
								variant="contained"
								disabled={!edit}
								type="submit"
							>
								Assign User
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
				)}
			</Dialog>
		</div>
	);
}
