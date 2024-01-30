import { Box, Container, Paper } from '@mui/material';
import BreadcrumbsBar from '../components/BreadcrumbsBar';

import Tab from '../components/Tab';
import { useGetCourseQuery } from '../store';
import { useParams } from 'react-router-dom';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';
import CourseInfoTab from '../courses/CourseInfoTab';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import LocalLibraryRoundedIcon from '@mui/icons-material/LocalLibraryRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import CourseContentTab from '../courses/CourseContentTab';
import CourseUserTab from '../courses/CourseUserTab';
import CourseFileTab from '../courses/CourseFileTab';
import CourseReviewTab from '../courses/CourseReviewTab';

const tabHeadings = [
	{
		title: 'Info',
		icon: <InfoRoundedIcon />,
	},
	{
		title: 'Content',
		icon: <LocalLibraryRoundedIcon />,
	},
	{
		title: 'Users',
		icon: <PeopleAltRoundedIcon />,
	},
	{
		title: 'Files',
		icon: <FolderRoundedIcon />,
	},
	{
		title: 'Reviews',
		icon: <RateReviewRoundedIcon />,
	},
];

export default function CourseInfoPage() {
	const { id } = useParams();
	const { data, error, isLoading } = useGetCourseQuery(id);

	if (error) return <Error message={error.data.message} />;

	if (isLoading) return <LoadingBar />;

	const course = data.data.data;

	return (
		<Container maxWidth="xl" sx={{ mt: 8 }}>
			<Paper sx={{ height: '100%', overflow: 'hidden' }}>
				<BreadcrumbsBar
					paths={[
						{
							pathName: 'Home',
							path: '/',
						},
						{
							pathName: 'Courses',
							path: '/courses',
						},
					]}
					currentPage={isLoading ? '-' : course.name}
				/>
				<Box minHeight={700}>
					<Tab
						heads={tabHeadings}
						tabs={[
							<CourseInfoTab />,
							<CourseContentTab />,
							<CourseUserTab course={course} />,
							<CourseFileTab />,
							<CourseReviewTab />,
						]}
					/>
				</Box>
			</Paper>
		</Container>
	);
}
