import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AppBar, Grid, IconButton, MenuItem, Typography } from '@mui/material';
import { useCreateCourseMutation, useGetAllCategoriesQuery } from '../store';
import LoadingBar from '../ultis/LoadingBar';
import Error from '../ultis/Error';

export default function AddCourseOverlay({ open, onClose }) {
	const { data, error, isLoading } = useGetAllCategoriesQuery();
	const [createCourse, results] = useCreateCourseMutation();
	const [edit, setEdit] = useState(false);
	const [course, setCourse] = useState({
		name: '',
		code: '',
		description: '',
		category: '',
	});

	useEffect(() => {
		if (results.isSuccess) {
			onClose();
			handleCancel();
		}
	}, [results.isSuccess, onClose]);

	const handleNameChange = (e) => {
		setCourse({ ...course, name: e.target.value });
		setEdit(true);
	};

	const handleCodeChange = (e) => {
		setCourse({ ...course, code: e.target.value });
		setEdit(true);
	};

	const handleDescriptionChange = (e) => {
		setCourse({ ...course, description: e.target.value });
		setEdit(true);
	};

	const handleCategoryChange = (e) => {
		setCourse({ ...course, category: e.target.value });
		setEdit(true);
	};

	const handleCreateCourseSubmit = (e) => {
		e.preventDefault();
		createCourse(course);
	};

	const handleCancel = () => {
		setCourse({
			name: '',
			code: '',
			description: '',
			category: '',
		});
		setEdit(false);
	};

	const handleClose = () => {
		onClose();
		handleCancel();
	};

	if (error) return <Error message={error.data.message} />;

	if (isLoading) return <LoadingBar />;

	if (data.results === 0)
		return (
			<Error message="There is no categories yet! Try creating some categories first." />
		);

	const categories = data.data.data.map((cate) => {
		return { value: cate._id, label: cate.name };
	});

	return (
		<div>
			{results.isLoading && <LoadingBar />}

			{results.isError && <Error message={results.error.data.message} />}

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
						ADD COURSE
					</Typography>
					<IconButton onClick={() => handleClose()}>
						<CloseRoundedIcon sx={{ color: 'white' }} />
					</IconButton>
				</AppBar>

				<Grid
					container
					spacing={4}
					component="form"
					onSubmit={handleCreateCourseSubmit}
					sx={{ pt: 4, pb: 4, pl: 8, pr: 8 }}
				>
					<Grid item sm={12}>
						<TextField
							fullWidth
							label="Name"
							value={course.name}
							onChange={handleNameChange}
						/>
					</Grid>
					<Grid item sm={6}>
						<TextField
							fullWidth
							label="Course Code"
							value={course.code}
							onChange={handleCodeChange}
						/>
					</Grid>
					<Grid item sm={6}>
						<TextField
							fullWidth
							select
							label="Category *"
							value={course.category || ''}
							onChange={handleCategoryChange}
						>
							{categories.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item sm={12}>
						<TextField
							fullWidth
							label="Description*"
							multiline
							rows={8}
							value={course.description}
							onChange={handleDescriptionChange}
						/>
					</Grid>
					<Grid item sm={6}>
						<Button
							fullWidth
							variant="contained"
							disabled={!edit}
							type="submit"
						>
							add course
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
