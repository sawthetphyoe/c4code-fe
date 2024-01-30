import { useCallback, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AppBar, Grid, IconButton, Typography } from '@mui/material';
import LoadingBar from '../ultis/LoadingBar';
import { useUpdateSectionMutation } from '../store';

export default function EditSectionOverlay({
	unChangedSection,
	open,
	onClose,
}) {
	const [updateSection, results] = useUpdateSectionMutation();
	const [edit, setEdit] = useState(false);
	const [section, setSection] = useState({
		id: unChangedSection._id,
		name: unChangedSection.name,
		index: unChangedSection.index,
	});

	const handleCancel = useCallback(() => {
		setSection({
			id: unChangedSection._id,
			name: unChangedSection.name,
			index: unChangedSection.index,
		});
		setEdit(false);
	}, [unChangedSection]);

	useEffect(() => {
		if (results.isSuccess) {
			onClose();
			handleCancel();
		}
	}, [results.isSuccess, onClose, handleCancel]);

	const handleNameChange = (e) => {
		setSection({ ...section, name: e.target.value });
		setEdit(true);
	};

	const handleOrderChange = (e) => {
		if (e.target.value < 1) return;
		setSection({ ...section, index: e.target.value });
		setEdit(true);
	};

	const handleUpdateCategorySubmit = (e) => {
		e.preventDefault();
		updateSection({
			id: section.id,
			body: {
				name: section.name,
				index: section.index,
			},
		});
	};

	const handleClose = () => {
		onClose();
		handleCancel();
	};

	return (
		<div>
			{results.isLoading && <LoadingBar />}

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
						Edit {unChangedSection.name}
					</Typography>
					<IconButton onClick={() => handleClose()}>
						<CloseRoundedIcon sx={{ color: 'white' }} />
					</IconButton>
				</AppBar>

				<Grid
					container
					spacing={4}
					component="form"
					onSubmit={handleUpdateCategorySubmit}
					sx={{ pt: 4, pb: 4, pl: 8, pr: 8, width: 900 }}
				>
					<Grid item sm={2}>
						<TextField
							required
							fullWidth
							type="number"
							label="Order"
							value={section.index}
							onChange={handleOrderChange}
						/>
					</Grid>
					<Grid item sm={10}>
						<TextField
							required
							fullWidth
							label="Name"
							value={section.name}
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
							SAVE
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
