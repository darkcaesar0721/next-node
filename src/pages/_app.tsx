import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react';

import authApi from '@/lib/api/authApi';
import { ThemeProvider, createTheme } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#673ab7', // замените на ваш цвет
    },
  },
});


export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    const fetchToken = async () => {
      try {
        console.log('Before authApi.login call');

        const payload = {
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
          grant_type: process.env.NEXT_PUBLIC_GRANT_TYPE!,
        };

        const response = await authApi.login(payload);

        console.log('After authApi.login call');
        console.log('response', response);

        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
        }
      } catch (error) {
        console.log('Error during authApi.login call:', error);
      }
    };

    fetchToken();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
