import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from './components/Copyright';
import LoginPage from './pages/LoginPage';
import AuthRoute from './routes/AuthRoute';
import NavBar from './components/NavBar';

const theme = createTheme({
	palette: {
		primary: {
			main: '#574F7D',
			dark: '#503A65',
			contrastText: '#fff',
		},
		secondary: {
			light: '#ff7961',
			main: '#95ADBE',
			dark: '#ba000d',
			contrastText: '#000',
		},
		text: {
			white: '#FFF',
		},
	},
	components: {
		MuiContainer: {
			defaultProps: {
				disableGutters: true,
			},
			styleOverrides: {
				maxWidthXl: {
					'&.MuiContainer-maxWidthXl': {
						maxWidth: 1440,
					},
				},
				maxWidthLg: {
					'&.MuiContainer-maxWidthLg': {
						maxWidth: 1271,
					},
				},
				maxWidthMd: {
					'&.MuiContainer-maxWidthMd': {
						maxWidth: 1008,
					},
				},
				maxWidthSm: {
					'&.MuiContainer-maxWidthSm': {
						maxWidth: 750,
					},
				},
				maxWidthXs: {
					'&.MuiContainer-maxWidthXs': {
						maxWidth: 360,
					},
				},
			},
		},
	},
});

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<NavBar />
				<Routes>
					<Route path="/*" element={<AuthRoute />} />
					<Route path="/login" element={<LoginPage />} />
				</Routes>
				<Copyright />
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
