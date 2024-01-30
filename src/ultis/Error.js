import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';

export default function Error({ message, variant }) {
	const navigate = useNavigate();
	const [open, setOpen] = useState(true);

	const handleClose = () => {
		variant === 'link' && navigate(-1, { replace: true });
		setOpen(false);
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<Box sx={{ pl: 2, pr: 2, pt: 1, pb: 1 }}>
				<DialogTitle color="error">Error !</DialogTitle>
				<DialogContent>
					<DialogContentText>{message}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>
						{variant === 'link' ? 'Go Back' : 'Close'}
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
}
