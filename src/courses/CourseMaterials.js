import { Box, Button, Container, Divider, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAllSectionsQuery } from '../store';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';
import AddSectionOverlay from './AddSectionOverlay';
import SectionAccordion from './SectionAccordion';
import { Stack } from '@mui/system';
import SkeletonList from '../ultis/SkeletonList';

export default function CourseMaterials() {
	const { id } = useParams();
	const { data, error, isLoading, isFetching } = useGetAllSectionsQuery([
		{
			key: 'course',
			value: id,
		},
		{
			key: 'sort',
			value: 'index',
		},
	]);
	const [modalOpen, setModalOpen] = useState(false);
	const [expanded, setExpanded] = useState('');
	const onModalClose = useCallback(() => {
		setModalOpen(false);
	}, []);
	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : undefined);
	};
	if (isLoading)
		return (
			<Container>
				<LoadingBar />
				<SkeletonList times={6} spacing={1} />
			</Container>
		);

	if (error) return <Error message={error.data.message} />;

	const sections = data.data.data.map((section, index) => (
		<Box key={section._id}>
			<SectionAccordion
				section={section}
				handleChange={handleChange}
				expanded={expanded}
			/>
		</Box>
	));

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				alignItems: 'flex-start',
			}}
		>
			{isFetching && <LoadingBar />}
			<Button variant="contained" onClick={() => setModalOpen(true)}>
				+ add section
			</Button>
			<Container
				sx={{
					pt: 1,
					pb: 1,
					pl: 2,
					pr: 2,
					backgroundColor: 'rgba(170, 170, 170, .15)',
					borderRadius: '.3rem',
				}}
			>
				{data.results === 0 ? (
					<Typography variant="h6" textAlign="center" p={4}>
						No contents yet!
					</Typography>
				) : (
					<Stack divider={<Divider />}>{sections}</Stack>
				)}
			</Container>
			<AddSectionOverlay
				sectionIndex={sections.length + 1}
				open={modalOpen}
				onClose={onModalClose}
			/>
		</Box>
	);
}
