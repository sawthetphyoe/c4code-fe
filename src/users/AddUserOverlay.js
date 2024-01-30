import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AppBar, Grid, IconButton, MenuItem, Typography } from '@mui/material';
import { useCreateUserMutation } from '../store';
import LoadingBar from '../ultis/LoadingBar';
import Error from '../ultis/Error';

const roles = [
	{
		value: 'student',
		label: 'Student',
	},
	{
		value: 'instructor',
		label: 'Instructor',
	},
	{
		value: 'admin',
		label: 'Admin',
	},
	{
		value: 'super-admin',
		label: 'Super Admin',
	},
];

export default function AddUserOverlay({ open, onClose }) {
	const [createUser, results ] = useCreateUserMutation();
	const [edit, setEdit] = useState(false);
	const [user, setUser] = useState({
		firstName: '',
		lastName: '',
		email: '',
		role: '',
	});

	useEffect(() => {
		if (results.isSuccess) {
			onClose();
			handleCancel();
		}
	}, [results.isSuccess, onClose]);

	const handleFirstNameChange = (e) => {
		setUser({ ...user, firstName: e.target.value });
		setEdit(true);
	};

	const handleLastNameChange = (e) => {
		setUser({ ...user, lastName: e.target.value });
		setEdit(true);
	};

	const handleEmailChange = (e) => {
		setUser({ ...user, email: e.target.value });
		setEdit(true);
	};

	const handleRoleChange = (e) => {
		setUser({ ...user, role: e.target.value });
		setEdit(true);
	};

	const handleCreateUserSubmit = (e) => {
		e.preventDefault();
		createUser(user);
	};

	const handleCancel = () => {
		setUser({
			firstName: '',
			lastName: '',
			email: '',
			role: '',
		});
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
						ADD USER
					</Typography>
					<IconButton onClick={() => handleClose()}>
						<CloseRoundedIcon sx={{ color: 'white' }} />
					</IconButton>
				</AppBar>
				<Grid
					container
					spacing={4}
					component="form"
					onSubmit={handleCreateUserSubmit}
					sx={{ pt: 4, pb: 4, pl: 16, pr: 16 }}
				>
					<Grid item sm={6}>
						<TextField
							fullWidth
							label="First Name"
							value={user.firstName}
							onChange={handleFirstNameChange}
						/>
					</Grid>
					<Grid item sm={6}>
						<TextField
							fullWidth
							label="Last Name"
							value={user.lastName}
							onChange={handleLastNameChange}
						/>
					</Grid>
					<Grid item sm={12}>
						<TextField
							fullWidth
							label="Email Address"
							value={user.email}
							onChange={handleEmailChange}
						/>
					</Grid>
					<Grid item sm={12}>
						<TextField
							fullWidth
							id="outlined-select-currency"
							select
							label="User type *"
							value={user.role}
							onChange={handleRoleChange}
						>
							{roles.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item sm={6}>
						<Button
							fullWidth
							variant="contained"
							disabled={!edit}
							type="submit"
						>
							add user
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
