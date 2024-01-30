import {
	useGetUserByIdQuery,
	useUpdateUserByIdMutation,
	useResetPasswordMutation,
} from '../store';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
	Box,
	Container,
	Button,
	Avatar,
	MenuItem,
	Grid,
	TextField,
	Skeleton,
	Alert,
	Typography,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Error from '../ultis/Error';
import SkeletonList from '../ultis/SkeletonList';
import LoadingBar from '../ultis/LoadingBar';

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

export default function UserInfoTab() {
	const { id } = useParams();
	const { data, error, isLoading, isFetching } = useGetUserByIdQuery(id);
	const [updateUserById, updateUserResults] = useUpdateUserByIdMutation();
	const [resetPassword, resetPasswordResults] = useResetPasswordMutation();

	const [edit, setEdit] = useState(false);
	const [user, setUser] = useState({
		firstName: '',
		lastName: '',
		email: '',
		role: '',
		image: '',
	});

	useEffect(() => {
		if (data && !error) {
			const defaultUser = data.data.data;
			setUser({
				firstName: defaultUser.firstName,
				lastName: defaultUser.lastName,
				email: defaultUser.email,
				role: defaultUser.role,
				image: defaultUser.image,
			});
		}
	}, [data, error]);

	useEffect(() => {
		if (edit) {
			updateUserResults.reset();
			resetPasswordResults.reset();
		}
	});

	const handleImageChange = (e) => {
		const formData = new FormData();
		formData.append('image', e.target.files[0]);
		updateUserById({
			id,
			body: formData,
		});
	};

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

	const handleUserUpdateSubmit = (e) => {
		e.preventDefault();
		setEdit(false);
		updateUserById({
			id,
			body: {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
			},
		});
		resetPasswordResults.reset();
	};

	const handleCancel = () => {
		const defaultUser = data.data.data;
		setUser({
			firstName: defaultUser.firstName,
			lastName: defaultUser.lastName,
			email: defaultUser.email,
			role: defaultUser.role,
			image: defaultUser.image,
		});
		setEdit(false);
	};

	const handleResetPasswordClick = () => {
		resetPassword(id);
		updateUserResults.reset();
	};

	if (error) return <Error message={error.data.message} />;

	return (
		<Container maxWidth="md">
			{/* Refetching */}
			{(isFetching ||
				updateUserResults.isLoading ||
				resetPasswordResults.isLoading) && <LoadingBar />}

			{/* Error Alerts */}
			{updateUserResults.isError && (
				<Error message={updateUserResults.error.data.message} />
			)}
			{resetPasswordResults.isError && (
				<Error message={resetPasswordResults.error.data.message} />
			)}

			{/* Success Alerts */}
			<Box sx={{ height: 60, mb: 4 }}>
				{updateUserResults.isSuccess && (
					<Alert severity="success">
						<Typography variant="h6" sx={{ fontSize: 18 }}>
							Successfully updated user!
						</Typography>
					</Alert>
				)}
				{resetPasswordResults.isSuccess && (
					<Alert severity="success">
						<Typography variant="h6" sx={{ fontSize: 18 }}>
							Successfully reset user's password to default password!
						</Typography>
					</Alert>
				)}
			</Box>

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

					{isLoading ? (
						<Skeleton sx={{ width: 300 }} />
					) : (
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
					)}
				</Box>

				<Box noValidate sx={{ maxWidth: 450 }}>
					{isLoading ? (
						<SkeletonList spacing={2} times={5} />
					) : (
						<Grid
							container
							spacing={2}
							component="form"
							onSubmit={handleUserUpdateSubmit}
						>
							<Grid item sm={12}>
								<TextField
									autoComplete="given-name"
									name="firstName"
									required
									fullWidth
									id="firstName"
									label="First Name"
									value={user.firstName}
									onChange={handleFirstNameChange}
								/>
							</Grid>
							<Grid item sm={12}>
								<TextField
									required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="family-name"
									value={user.lastName}
									onChange={handleLastNameChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									value={user.email}
									onChange={handleEmailChange}
								/>
							</Grid>
							<Grid item xs={12}>
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
							<Grid item xs={6}>
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
							<Grid item xs={6}>
								<Button
									fullWidth
									variant="outlined"
									color="warning"
									onClick={handleResetPasswordClick}
									sx={{ mt: 4 }}
								>
									reset password
								</Button>
							</Grid>
							<Typography
								variant="caption"
								component="span"
								sx={{ pl: 2, pt: 1 }}
							>
								This action will reset user's password to default password:
								"asdf1234"
							</Typography>
						</Grid>
					)}
				</Box>
			</Box>
		</Container>
	);
}
