import {
	Container,
	Button,
	TextField,
	MenuItem,
	Grid,
	Avatar,
	Checkbox,
	FormControlLabel,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
	useGetAllCategoriesQuery,
	useGetCourseQuery,
	useUpdateCourseMutation,
} from '../store';
import LoadingBar from '../ultis/LoadingBar';
import SkeletonList from '../ultis/SkeletonList';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export default function CourseInfoTab() {
	const { id } = useParams();

	const {
		data: courseData,
		error: courseError,
		isLoading: courseLoading,
	} = useGetCourseQuery(id);

	const {
		data: categData,
		error: categError,
		isLoading: categLoading,
	} = useGetAllCategoriesQuery();

	const [updateCourse, results] = useUpdateCourseMutation();

	const [course, setCourse] = useState({
		name: '',
		code: '',
		description: '',
		category: '',
		image: '',
		active: false,
	});
	const [categories, setCategories] = useState([]);
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		if (categData && !categError) {
			setCategories([...categData.data.data]);
			if (courseData && !courseError) {
				const unchangedCourse = courseData.data.data;
				setCourse({
					name: unchangedCourse.name,
					code: unchangedCourse.code,
					description: unchangedCourse.description,
					category: unchangedCourse.category._id,
					image: unchangedCourse.image,
					active: unchangedCourse.active,
				});
			}
		}
	}, [categData, categError, courseData, courseError]);

	useEffect(() => {
		if (edit) {
			results.reset();
		}
	});

	const handleImageChange = (e) => {
		const formData = new FormData();
		formData.append('image', e.target.files[0]);
		updateCourse({
			id,
			body: formData,
		});
	};

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

	const handleActiveChange = (e) => {
		setCourse({ ...course, active: !course.active });
		setEdit(true);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setEdit(false);
		updateCourse({
			id,
			body: {
				name: course.name,
				code: course.code,
				description: course.description,
				category: course.category,
				active: course.active,
			},
		});
	};

	const handleCancel = () => {
		const unchangedCourse = courseData.data.data;
		setCourse({
			name: unchangedCourse.name,
			code: unchangedCourse.code,
			description: unchangedCourse.description,
			category: unchangedCourse.category._id,
			active: unchangedCourse.active,
			image: course.image,
		});
		setEdit(false);
	};

	if (courseLoading || categLoading)
		return (
			<Container maxWidth="sm">
				<LoadingBar />
				<SkeletonList spacing={4} times={4} />
			</Container>
		);

	return (
		<Container
			maxWidth="lg"
			sx={{
				display: 'flex',
				alignItems: 'top',
				justifyContent: 'space-around',
			}}
		>
			<Container
				maxWidth="xs"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 3,
				}}
			>
				<Avatar
					variant="square"
					src={course.image && `http://localhost:3005/images/${course.image}`}
					alt={course.name}
					sx={{ height: 125, width: 200 }}
				/>

				<Button component="label" variant="outlined">
					<PhotoCamera sx={{ fontSize: 18, mr: 1 }} />
					upload new photo
					<input
						hidden
						accept="image/*"
						multiple
						type="file"
						onChange={handleImageChange}
					/>
				</Button>
			</Container>
			<Container maxWidth="sm" sx={{ paddingBottom: 2 }}>
				{results.isLoading && <LoadingBar />}
				<Grid
					container
					component="form"
					onSubmit={handleSubmit}
					autoComplete="off"
					spacing={4}
				>
					<Grid item sm={12}>
						<TextField
							required
							fullWidth
							label="Course Name"
							value={course.name}
							onChange={handleNameChange}
						/>
					</Grid>

					<Grid item xs={6}>
						<TextField
							fullWidth
							label="Course Code *"
							value={course.code}
							onChange={handleCodeChange}
						/>
					</Grid>

					<Grid item xs={6}>
						<TextField
							fullWidth
							select
							label="Category *"
							value={course.category}
							onChange={handleCategoryChange}
						>
							{categories.map((cate) => (
								<MenuItem key={cate.name} value={cate._id}>
									{cate.name}
								</MenuItem>
							))}
						</TextField>
					</Grid>

					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Description *"
							value={course.description}
							onChange={handleDescriptionChange}
							multiline
							rows={6}
						/>
					</Grid>

					<Grid item xs={12}>
						<FormControlLabel
							control={
								<Checkbox
									checked={course.active}
									onChange={handleActiveChange}
								/>
							}
							label="Active"
						/>
					</Grid>

					<Grid item sm={6}>
						<Button
							fullWidth
							variant="contained"
							disabled={!edit}
							type="submit"
						>
							update course
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
			</Container>
		</Container>
	);
}
