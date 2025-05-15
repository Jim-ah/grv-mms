// src/pages/Login.tsx
import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import {login} from '../services/authService';
import {parseJwt} from '../contexts/AuthContext';

import {
    Avatar, Box, Button, Container, CssBaseline, Paper,
    TextField, Typography, IconButton, InputAdornment
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Visibility, VisibilityOff} from '@mui/icons-material';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShow] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            await login({email, password});
            const token = localStorage.getItem('token')!;
            const {role} = parseJwt<{ role: string }>(token);

            if (role === 'Client') {
                navigate('/tickets', {replace: true});
            } else if (role === 'Engineer') {
                navigate('/engineer', {replace: true});
            } else if (role === 'Admin') {
                navigate('/admin', {replace: true});
            }
            else if (role === 'Technician') {
            navigate('/technician', {replace: true});
        }


        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e0e7ff 0%, #f4f6f8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Container component="main" maxWidth="xs">
                <CssBaseline/>

                <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
                    <Avatar sx={{bgcolor: 'primary.main', width: 56, height: 56}}>
                        <LockOutlinedIcon fontSize="large"/>
                    </Avatar>
                </Box>

                <Paper elevation={6} sx={{p: 4, borderRadius: 2}}>
                    <Typography component="h1" variant="h5" sx={{mb: 2, textAlign: 'center'}}>
                        Sign in to MMS
                    </Typography>

                    {error && (
                        <Typography color="error" sx={{mb: 2}}>
                            {error}
                        </Typography>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required fullWidth id="email" label="Email Address"
                            autoComplete="email" autoFocus
                            value={email} onChange={e => setEmail(e.target.value)}
                        />

                        <TextField
                            margin="normal"
                            required fullWidth name="password" label="Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            value={password} onChange={e => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShow(s => !s)} edge="end">
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
                            Log In
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
