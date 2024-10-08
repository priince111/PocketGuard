import React,{useContext, useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useLogin} from '../hooks/useLogin';
import { useGuestLogin } from '../hooks/useGuestLogin';
import { UserContext } from '../contexts/UserContext';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href={`${process.env.REACT_APP_HOST}/signin`}>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const defaultTheme = createTheme();

export default function SignIn() {
  const { login, isLoading: isLoginLoading, error: loginError, success } = useLogin();
  const { user } = useContext(UserContext);
  const { guestLogin, isLoading: isGuestLoading, error: guestLoginError } = useGuestLogin();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {
      email: data.get('email'),
      password: data.get('password'),
    };
    console.log("data in modal",userData);
    login(userData);
  };

  const handleGuestLogin = () => {
    guestLogin();
  }

  useEffect ( () => {
    if (user) {
      window.location.href = '/home'
    }
  }, [user]);
  

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {(loginError|| guestLoginError) && <Alert severity="error">{((loginError|| guestLoginError))}</Alert>}
          {success && <Alert severity="success">Login successfully! Redirecting to home page...</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoginLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link onClick={handleGuestLogin} variant="body2">
                {isGuestLoading ? 'Logging in as Guest...' : 'Login as Guest'}
                </Link>
              </Grid>
              <Grid item xs style={{ textAlign: 'right' }}>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}