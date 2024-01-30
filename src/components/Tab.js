import { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import { Container, styled, Tab as MuiTab } from '@mui/material';
import Box from '@mui/material/Box';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const StyledTabs = styled((props) => (
	<Tabs
		{...props}
		TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
	/>
))({
	'& .MuiTabs-indicator': {
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		height: '5px',
	},
	'& .MuiTabs-indicatorSpan': {
		width: '100%',
		backgroundColor: '#FFF',
	},
});

const StyledTab = styled((props) => <MuiTab disableRipple {...props} />)(
	({ theme }) => ({
		textTransform: 'none',
		fontWeight: theme.typography.fontWeightRegular,
		fontSize: theme.typography.pxToRem(16),
		marginRight: theme.spacing(1),
		letterSpacing: '0.1rem',
		// color: 'rgba(255, 255, 255, 0.7)',
		color: '#65737E',
		'&.Mui-selected': {
			color: '#fff',
		},
	})
);

export default function Tab({ heads, tabs, student }) {
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const renderedHeads = heads.map((head, index) => {
		return student ? (
			<StyledTab
				disableFocusRipple
				key={head.title}
				icon={head.icon}
				iconPosition="start"
				label={head.title}
				{...a11yProps(index)}
			/>
		) : (
			<MuiTab
				disableFocusRipple
				key={head.title}
				icon={head.icon}
				iconPosition="start"
				label={head.title}
				{...a11yProps(index)}
			/>
		);
	});

	const renderedContents = tabs.map((tab, i) => (
		<TabPanel key={i} index={i} value={value}>
			{tab}
		</TabPanel>
	));

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
				{student ? (
					<Box sx={{ bgcolor: '#1E1E1E', width: '100%' }}>
						<Container maxWidth="lg">
							<StyledTabs
								selectionFollowsFocus
								aria-label="Tabs where selection follows focus"
								value={value}
								onChange={handleChange}
							>
								{renderedHeads}
							</StyledTabs>
						</Container>
					</Box>
				) : (
					<Tabs
						selectionFollowsFocus
						aria-label="Tabs where selection follows focus"
						value={value}
						onChange={handleChange}
					>
						{renderedHeads}
					</Tabs>
				)}
			</Box>
			{renderedContents}
		</Box>
	);
}
