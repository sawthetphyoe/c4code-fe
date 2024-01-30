import { Container, Grid } from '@mui/material';
import CourseSummary from './CourseSummary';
import CourseMaterials from './CourseMaterials';

export default function CourseContentTab() {
	// const {
	// 	data: sectionData,
	// 	error: sectionError,
	// 	isLoading: sectionLoading,
	// 	isFetching: sectionFetching,
	// } = useGetAllSectionsQuery({ filter: 'course', value: id });

	return (
		<Container maxWidth="lg" sx={{ pl: 3, pr: 3 }}>
			<Grid container spacing={8}>
				<Grid item sm={4}>
					<CourseSummary />
				</Grid>
				<Grid item sm={8}>
					<CourseMaterials />
				</Grid>
			</Grid>
		</Container>
	);
}
