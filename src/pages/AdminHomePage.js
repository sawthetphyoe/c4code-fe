import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
// import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import { Container, Grid, Paper } from '@mui/material';
import IconCard from '../components/IconCard';
import BreadcrumbsBar from '../components/BreadcrumbsBar';

const iconStyle = {
	fontSize: 78,
	color: '#e0f0ea',
};

export default function AdminHomePage() {
	return (
		<Container maxWidth="md" sx={{ mt: 8 }}>
			<Paper elevation={3}>
				<BreadcrumbsBar currentPage="Home" />
				<Container maxWidth="sm">
					<Grid
						container
						spacing={6}
						maxWidth="md"
						sx={{
							alignItems: 'center',
							p: 8,
						}}
					>
						<Grid item xs={4}>
							<IconCard
								icon={<SchoolRoundedIcon sx={iconStyle} />}
								buttonText="courses"
								link="/courses"
							/>
						</Grid>

						<Grid item xs={4}>
							<IconCard
								icon={<CategoryRoundedIcon sx={iconStyle} />}
								buttonText="categories"
								link="/categories"
							/>
						</Grid>

						<Grid item xs={4}>
							<IconCard
								icon={<PeopleAltRoundedIcon sx={iconStyle} />}
								buttonText="users"
								link="/users"
							/>
						</Grid>

						{/* <Grid item xs={6}>
							<IconCard
								icon={<AssessmentRoundedIcon sx={iconStyle} />}
								buttonText="reports"
								link="/reports"
							/>
						</Grid> */}
					</Grid>
				</Container>
			</Paper>
		</Container>
	);
}
