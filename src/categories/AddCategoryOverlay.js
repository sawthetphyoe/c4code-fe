import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AppBar, Grid, IconButton, Typography } from '@mui/material';
import { useCreateCategoryMutation } from '../store';
import LoadingBar from '../ultis/LoadingBar';
import Error from '../ultis/Error';

export default function AddUserOverlay({ open, onClose }) {
	const [createCategory, results] = useCreateCategoryMutation();
	const [edit, setEdit] = useState(false);
	const [name, setName] = useState('');

	useEffect(() => {
		if (results.isSuccess) {
			onClose();
			handleCancel();
		}
	}, [results.isSuccess, onClose]);

	const handleNameChange = (e) => {
		setName(e.target.value);
		setEdit(true);
	};

	const handleCreateCategorySubmit = (e) => {
		e.preventDefault();
		createCategory(name);
	};

	const handleCancel = () => {
		setName('');
		setEdit(false);
	};

	const handleClose = () => {
		onClose();
		handleCancel();
	};

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
						ADD CATEGORY
					</Typography>
					<IconButton onClick={() => handleClose()}>
						<CloseRoundedIcon sx={{ color: 'white' }} />
					</IconButton>
				</AppBar>
				<Grid
					container
					spacing={4}
					component="form"
					onSubmit={handleCreateCategorySubmit}
					sx={{ pt: 4, pb: 4, pl: 16, pr: 16, width: 900 }}
				>
					<Grid item sm={12}>
						<TextField
							fullWidth
							required
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
							add category
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
