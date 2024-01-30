import {
	useChangePasswordMutation,
	useChangeUserPhotoMutation,
} from '../store';
import { useState } from 'react';
import {
	Box,
	Container,
	Button,
	Avatar,
	Grid,
	TextField,
	Typography,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';

export default function StudentProfileTab({ user }) {
	const [changePasswrod, passwordResults] = useChangePasswordMutation();
	const [changePhoto, photoResults] = useChangeUserPhotoMutation();
	const [edit, setEdit] = useState(false);
	const [passwords, setPasswords] = useState({
		password: '',
		passwordConfirm: '',
	});

	const handleImageChange = (e) => {
		const formData = new FormData();
		formData.append('image', e.target.files[0]);
		changePhoto(formData);
	};

	const handlePasswordChange = (e) => {
		setPasswords({ ...passwords, password: e.target.value });
		setEdit(true);
	};

	const handlePasswordConfirmChange = (e) => {
		setPasswords({ ...passwords, passwordConfirm: e.target.value });
		setEdit(true);
	};

	const handlePasswordChangeSubmit = (e) => {
		e.preventDefault();
		setEdit(false);
		changePasswrod(passwords);
	};

	const handleCancel = () => {
		setPasswords({
			password: '',
			passwordConfirm: '',
		});
		setEdit(false);
	};

	return (
		<Container maxWidth="md" sx={{ mt: 4, minHeight: 540 }}>
			{(passwordResults.isLoading || photoResults.isLoading) && <LoadingBar />}

			{passwordResults.isError && (
				<Error message={passwordResults.error.data.message} />
			)}

			{photoResults.isError && (
				<Error message={photoResults.error.data.message} />
			)}

			<Box
				sx={{
					display: 'flex',
					alignItems: 'top',
					justifyContent: 'space-around',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 3,
					}}
				>
					<Avatar
						src={user.image && `http://localhost:3005/images/${user.image}`}
						alt={user.firstName}
						sx={{ height: 150, width: 150 }}
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
				</Box>

				<Box sx={{ maxWidth: 450 }}>
					<Box sx={{ mb: 8 }}>
						<Typography
							variant="subtitle2"
							sx={{ fontSize: 18, color: '#503A65', mb: 2 }}
						>
							General
						</Typography>
						<Grid container spacing={2}>
							<Grid item sm={12}>
								<TextField
									disabled
									fullWidth
									label="Name"
									defaultValue={`${user.firstName} ${user.lastName}`}
								/>
							</Grid>
							<Grid item sm={12}>
								<TextField
									disabled
									fullWidth
									label="Email"
									defaultValue={user.email}
								/>
							</Grid>
							<Typography
								variant="subtitle1"
								component="span"
								sx={{ pl: 2, pt: 1, fontSize: 14, color: 'grey' }}
							>
								Please contact the administrator to change your general
								information.
							</Typography>
						</Grid>
					</Box>

					<Box>
						<Typography
							variant="subtitle2"
							sx={{ fontSize: 18, color: '#503A65', mb: 2 }}
						>
							Password
						</Typography>
						<Grid
							container
							spacing={2}
							component="form"
							onSubmit={handlePasswordChangeSubmit}
						>
							<Grid item sm={12}>
								<TextField
									required
									fullWidth
									label="New Password"
									value={passwords.password}
									onChange={handlePasswordChange}
								/>
							</Grid>
							<Grid item sm={12}>
								<TextField
									error={passwords.password !== passwords.passwordConfirm}
									required
									fullWidth
									label="Confirm Password"
									value={passwords.passwordConfirm}
									onChange={handlePasswordConfirmChange}
								/>
							</Grid>
							<Grid item xs={6}>
								<Button
									fullWidth
									variant="contained"
									disabled={!edit}
									type="submit"
								>
									save changes
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
					</Box>
				</Box>
			</Box>
		</Container>
	);
}
