import { Button, Container, Paper } from '@mui/material';
import CourseList from '../courses/CourseList';
import BreadcrumbsBar from '../components/BreadcrumbsBar';
import { useState, useCallback } from 'react';
import SearchInput from '../components/SearchInput';
import AddCourseOverlay from '../courses/AddCourseOverlay';

export default function CoursesPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [modalOpen, setModalOpen] = useState(false);

	const handleSearchTermChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const onModalClose = useCallback(() => {
		setModalOpen(false);
	}, []);

	return (
		<Container maxWidth="xl" sx={{ mt: 8 }}>
			<Paper>
				<BreadcrumbsBar
					paths={[
						{
							pathName: 'Home',
							path: '/',
						},
					]}
					currentPage="courses"
				>
					<SearchInput term={searchTerm} onChange={handleSearchTermChange} />
				</BreadcrumbsBar>
				<Container
					maxWidth="lg"
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
						gap: 4,
						pt: 4,
						pb: 4,
						minHeight: 700,
					}}
				>
					<Button variant="contained" onClick={() => setModalOpen(true)}>
						+ Add course
					</Button>

					<CourseList searchTerm={searchTerm} />
				</Container>
			</Paper>
			<AddCourseOverlay open={modalOpen} onClose={onModalClose} />
		</Container>
	);
}
