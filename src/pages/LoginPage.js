import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import {
	Grid,
	TextField,
	Alert,
	Typography,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	Container,
	Box,
	DialogTitle,
} from '@mui/material';

import { useState } from 'react';

import { useLoginUserMutation } from '../store';
import { useLocation, useNavigate } from 'react-router-dom';
import Error from '../ultis/Error';

export default function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [loginUser, results] = useLoginUserMutation();
	const [user, setUser] = useState({
		email: '',
		password: '',
	});
	const [edit, setEdit] = useState(false);

	const handleEmailChange = (e) => {
		setUser({ ...user, email: e.target.value });
		setEdit(true);
	};

	const handlePasswordChange = (e) => {
		setUser({ ...user, password: e.target.value });
		setEdit(true);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setEdit(false);
		loginUser(user);
	};

	const handleClose = () => {
		navigate('/', { replace: true });
	};

	return (
		<Container
			component="form"
			maxWidth="sm"
			sx={{ mt: 12 }}
			onSubmit={handleSubmit}
		>
			<Box>
				<Grid container spacing={4}>
					{location.state && (
						<Grid item xs={12}>
							<Alert severity="warning" sx={{ fontSize: 18 }}>
								{location.state.message}
							</Alert>
						</Grid>
					)}
					<Grid item xs={12}>
						<TextField
							error={results.isError && !edit ? true : false}
							required
							fullWidth
							autoFocus
							label="Email Address"
							value={user.email}
							onChange={handleEmailChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							error={results.isError && !edit ? true : false}
							required
							fullWidth
							label="Password"
							type="password"
							value={user.password}
							onChange={handlePasswordChange}
						/>
					</Grid>
					<Grid item sm={12}>
						<Button
							fullWidth
							variant="contained"
							disabled={!edit}
							type="submit"
							style={{
								height: 52,
							}}
						>
							Login
						</Button>
					</Grid>
				</Grid>
			</Box>

			{results.isError && <Error message={results.error.data.message} />}

			{results.isSuccess && (
				<Dialog open onClose={handleClose}>
					<DialogTitle>
						<Typography variant="h6" component="span">
							{`Welcome, ${results.data.data.data.firstName}`}
						</Typography>
					</DialogTitle>
					<DialogContent sx={{ width: 600, pb: 4 }}>
						You have successfully logged in.
					</DialogContent>
					<DialogActions sx={{ mb: 2 }}>
						<Button onClick={handleClose} autoFocus>
							Go to home page
							<ArrowForwardRoundedIcon sx={{ ml: 2 }} />
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</Container>
	);
}
