import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import CodeIcon from '@mui/icons-material/Code';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useCheckLoginQuery, useUserLogoutMutation } from '../store';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
	'&': {
		backgroundColor: theme.palette.primary.dark,
	},
}));

export default function NavBar() {
	const [userLogout] = useUserLogoutMutation();
	const { data, error } = useCheckLoginQuery();
	const navigate = useNavigate();

	const handleLogout = () => {
		userLogout();
		navigate('/login');
	};

	return (
		<StyledAppBar position="sticky" sx={{ pt: 2, pb: 2 }}>
			<Container
				maxWidth="xl"
				sx={{ display: 'flex', justifyContent: 'space-between' }}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						cursor: 'pointer',
					}}
					onClick={() => navigate('/')}
				>
					<CodeIcon sx={{ fontSize: 32, mr: 1 }} />
					<Typography
						sx={{
							fontSize: 22,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.1rem',
							mr: 2,
						}}
					>
						C4CODE
					</Typography>
				</Box>

				<Box sx={{ justifySelf: 'flex-end' }}>
					{!error && data && (
						<Box
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gap: 10,
							}}
						>
							<Avatar
								sx={{ width: 45, height: 45, mr: 2 }}
								alt={data.data.data.firstName}
								src={
									data.data.data.image &&
									`http://localhost:3005/images/${data.data.data.image}`
								}
							/>

							<span
								style={{
									fontSize: 16,
									fontWeight: 'medium',
									color: 'inherit',
									letterSpacing: '.05rem',
									textTransform: 'uppercase',
									paddingRight: 8,
								}}
							>
								{`${data.data.data.firstName} ${data.data.data.lastName}`}
							</span>

							<IconButton onClick={handleLogout}>
								<LogoutRoundedIcon sx={{ color: 'white' }} />
							</IconButton>
						</Box>
					)}
				</Box>
			</Container>
		</StyledAppBar>
	);
}
