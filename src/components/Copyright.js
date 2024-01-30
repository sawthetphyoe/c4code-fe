import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import { Link } from 'react-router-dom';

function Copyright(props) {
	return (
		<Container sx={{ mt: 8, mb: 4 }}>
			<Typography variant="body2" align="center" {...props}>
				{'Copyright © '}
				<Link to="/">
					<Typography
						variant="body2"
						component={'span'}
						sx={{ letterSpacing: '.1rem', color: 'primary' }}
					>
						C4CODE
					</Typography>
				</Link>{' '}
				{new Date().getFullYear()}
				{'.'}
			</Typography>
		</Container>
	);
}

export default Copyright;
