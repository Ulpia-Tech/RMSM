import { AppBar, Box, Toolbar, Typography } from '@material-ui/core';
import { useTheme } from '@mui/material/styles';
import DownloadPDF from '../DownloadPDF/DownloadPDF';

const Header = () => {
	const theme = useTheme();

	return (
		<Box>
			<AppBar data-testid="header" position="static" style={{ backgroundColor: theme.palette.primary.main, boxShadow: 'none' }}>
				<Toolbar>
					<Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontSize: 600 }}>
						Reltio Metadata Security Management
					</Typography>
					<DownloadPDF />
				</Toolbar>
			</AppBar>
		</Box>
	);
}

export default Header