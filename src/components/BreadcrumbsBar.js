import { AppBar, Box, Toolbar, Breadcrumbs, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';

function BreadcrumbsBar({ paths, currentPage, children }) {
	return (
		<Box>
			<AppBar position="static">
				<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Breadcrumbs
						separator={<NavigateNextIcon fontSize="small" />}
						sx={{ color: 'inherit' }}
					>
						{paths &&
							paths.map((path, index) => {
								return (
									<Typography
										variant="subtitle2"
										component="span"
										key={index + path.pathName}
									>
										<Link
											to={path.path}
											style={{
												textDecoration: 'none',
												color: 'inherit',
												letterSpacing: '.05rem',
											}}
											className="hover-underlined"
										>
											{path.pathName.toUpperCase()}
										</Link>
									</Typography>
								);
							})}
						<span style={{ fontSize: '18px', fontWeight: 'bold' }}>
							{currentPage.toUpperCase()}
						</span>
					</Breadcrumbs>
					{children}
				</Toolbar>
			</AppBar>
		</Box>
	);
}

export default BreadcrumbsBar;
