"use client";
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSuccess } from '@/store/slices/authSlice';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
} from '@mui/material';

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate a successful signup and auto-login
    const mockUser = { id: '1', name: name, email: email };
    const mockToken = 'fake-jwt-token';
    dispatch(loginSuccess({ user: mockUser, token: mockToken }));
    router.push('/'); // Redirect to the main app page
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <MuiLink component={Link} href="/login" variant="body2">
            {"Already have an account? Sign In"}
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;