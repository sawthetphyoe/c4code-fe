import { Box, Container, Paper } from '@mui/material';
import BreadcrumbsBar from '../components/BreadcrumbsBar';
import UserInfoTab from '../users/UserInfoTab';
import Tab from '../components/Tab';
import { useGetUserByIdQuery } from '../store';
import { useParams } from 'react-router-dom';
import Error from '../ultis/Error';
import LoadingBar from '../ultis/LoadingBar';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import UserCourseTab from '../users/UserCourseTab';
import UserFileTab from '../users/UserFileTab';

const tabHeadings = [
	{
		title: 'Info',
		icon: <InfoRoundedIcon />,
	},
	{
		title: 'Courses',
		icon: <SchoolRoundedIcon />,
	},
	{
		title: 'Files',
		icon: <FolderRoundedIcon />,
	},
];

export default function UserInfoPage() {
	const { id } = useParams();
	const { data, error, isLoading, isFetching } = useGetUserByIdQuery(id);

	if (error) return <Error message={error.data.message} />;

	if (isLoading) return <LoadingBar />;

	const user = data.data.data;

	const formattedName =
		user.firstName.split(' ')[0].charAt(0) +
		'. ' +
		(user.firstName.split(' ')[1] || '') +
		' ' +
		user.lastName;

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
							pathName: 'Users',
							path: '/users',
						},
					]}
					currentPage={isFetching ? '-' : formattedName}
				/>
				<Box minHeight={700}>
					<Tab
						heads={tabHeadings}
						tabs={[<UserInfoTab />, <UserCourseTab />, <UserFileTab />]}
					/>
				</Box>
			</Paper>
		</Container>
	);
}
