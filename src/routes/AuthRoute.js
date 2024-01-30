import { useCheckLoginQuery } from '../store';
import Loading from 'react-fullscreen-loading';
import { Navigate } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import StudentRoutes from './StudentRoutes';
import { Alert, Container } from '@mui/material';

export default function AuthRoute() {
	const { data, error, isLoading } = useCheckLoginQuery();

	if (isLoading)
		return <Loading loading background="#95ADBE" loaderColor="#574F7D" />;

	if (error) {
		return error.data ? (
			<Navigate to="/login" replace state={{ message: error.data.message }} />
		) : (
			<Container maxWidth="sm">
				<Alert severity="error" sx={{ fontSize: 18 }}>
					Failed to fetch! Check your internet connection and try again.
				</Alert>
			</Container>
		);
	}

	const user = data.data.data;

	return user.role === 'student' ? <StudentRoutes /> : <AdminRoutes />;
}
