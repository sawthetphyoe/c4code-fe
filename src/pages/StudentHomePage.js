import Tab from '../components/Tab';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import StudentCourseTab from '../students/StudentCoursesTab';
import StudentProfileTab from '../students/StudentProfileTab';
import StudentFileTab from '../students/StudentFilesTab';
import { Box, Container, Typography } from '@mui/material';
import { useCheckLoginQuery } from '../store';
import LoadingBar from '../ultis/LoadingBar';
import Error from '../ultis/Error';

const tabHeadings = [
	{
		title: 'My Courses',
		icon: <SchoolRoundedIcon />,
	},
	{
		title: 'My Profile',
		icon: <AccountCircleRoundedIcon />,
	},
	{
		title: 'My Files',
		icon: <FolderRoundedIcon />,
	},
];

export default function StudentHomePage() {
	const { data, error, isLoading, isFetching } = useCheckLoginQuery();

	if (isLoading || isFetching) return <LoadingBar />;

	if (error) return <Error message={error.data.message} />;

	const user = data.data.data;

	return (
		<>
			<Box sx={{ height: '125px', bgcolor: '#1E1E1E', width: '100%' }}>
				<Container maxWidth="lg">
					<Typography
						variant="h4"
						sx={{
							fontSize: 38,
							color: '#FFF',
							lineHeight: '140px',
							letterSpacing: '0.2rem',
						}}
					>
						Welcome, {user.firstName}
					</Typography>
				</Container>
			</Box>
			<Tab
				student
				heads={tabHeadings}
				tabs={[
					<StudentCourseTab user={user} />,
					<StudentProfileTab user={user} />,
					<StudentFileTab user={user} />,
				]}
			/>
		</>
	);
}
