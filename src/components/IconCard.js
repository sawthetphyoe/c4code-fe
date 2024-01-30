import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

export default function IconCard({ icon, buttonText, link }) {
	const navigate = useNavigate();
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 2,
				p: 3,
			}}
		>
			<Box
				sx={{ bgcolor: '#95ADBE', pt: 2, pb: 2, pl: 3, pr: 3, borderRadius: 2 }}
			>
				{icon}
			</Box>
			<Button variant="text" size="large" onClick={() => navigate(link)}>
				{buttonText}
			</Button>
		</Box>
	);
}
