import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { theme } from './mui/theme';
import './styles/styles.css';


ReactDOM.render(
	<React.StrictMode>

			<ThemeProvider theme={theme}>
				<App />
			</ThemeProvider>

	</React.StrictMode>,
	document.getElementById('root')
);