import { useGetCategoryQuery, useUpdateCategoryMutation } from '../store';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, TextField, Container, Paper, Grid } from '@mui/material';
import BreadcrumbsBar from '../components/BreadcrumbsBar';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';

export default function CategoryInfoPage() {
	const { id } = useParams();
	const { data, error, isFetching, isLoading } = useGetCategoryQuery(id);
	const [updateCategory, results] = useUpdateCategoryMutation();
	const [name, setName] = useState('');
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		if (data && !error) {
			setName(data.data.data.name);
		}
	}, [data, error]);

	useEffect(() => {
		if (edit) results.reset();
	}, [edit, results]);

	const handleNameChange = (e) => {
		setName(e.target.value);
		setEdit(true);
		results.reset();
	};

	const handleCancel = () => {
		const category = data.data.data;
		setName(category.name);
		setEdit(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setEdit(false);
		updateCategory({ name, id });
	};

	if (error) return <Error message={error.data.message} />;

	if (isLoading) return <LoadingBar />;

	const category = data.data.data;

	return (
		<Container maxWidth="md" sx={{ mt: 8 }}>
			{(isFetching || results.isLoading) && <LoadingBar />}

			<Paper sx={{ height: '100%', overflow: 'hidden' }}>
				<BreadcrumbsBar
					paths={[
						{ pathName: 'Home', path: '/' },
						{ pathName: 'Categories', path: '/categories' },
					]}
					currentPage={category.name}
				/>

				<Container maxWidth="sm">
					<Grid
						container
						spacing={4}
						component="form"
						onSubmit={handleSubmit}
						sx={{ p: 8 }}
					>
						<Grid item sm={12}>
							<TextField
								required
								fullWidth
								label="Name"
								value={name}
								onChange={handleNameChange}
							/>
						</Grid>
						<Grid item sm={6}>
							<Button
								fullWidth
								variant="contained"
								disabled={!edit}
								type="submit"
							>
								save
							</Button>
						</Grid>
						<Grid item xs={6}>
							{edit && (
								<Button fullWidth variant="outlined" onClick={handleCancel}>
									CANCEL
								</Button>
							)}
						</Grid>
					</Grid>
				</Container>
			</Paper>
		</Container>
	);
}
