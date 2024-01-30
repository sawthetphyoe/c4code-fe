import { Button, Container, Paper } from '@mui/material';
import CategoryList from '../categories/CategoryList';
import BreadcrumbsBar from '../components/BreadcrumbsBar';
import { useState, useCallback } from 'react';
import SearchInput from '../components/SearchInput';
import AddCategoryOverlay from '../categories/AddCategoryOverlay';
function CategoriesPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [modalOpen, setModalOpen] = useState(false);

	const handleSearchTermChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const onModalClose = useCallback(() => {
		setModalOpen(false);
	}, []);

	return (
		<Container maxWidth="lg" sx={{ mt: 8 }}>
			<Paper sx={{ height: '100%', overflow: 'hidden' }}>
				<BreadcrumbsBar
					paths={[
						{
							pathName: 'Home',
							path: '/',
						},
					]}
					currentPage="categories"
				>
					<SearchInput term={searchTerm} onChange={handleSearchTermChange} />
				</BreadcrumbsBar>
				<Container
					maxWidth="md"
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
						gap: 4,
						mt: 4,
						mb: 4,
					}}
				>
					<Button variant="contained" onClick={() => setModalOpen(true)}>
						+ Add Category
					</Button>
					<CategoryList searchTerm={searchTerm} />
				</Container>
			</Paper>

			<AddCategoryOverlay open={modalOpen} onClose={onModalClose} />
		</Container>
	);
}

export default CategoriesPage;
