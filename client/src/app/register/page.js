"use client"

import React, { useContext, useState,useEffect } from 'react';
import Link from 'next/link';
import "./RegisterScreen.css";
import Button from "@mui/material/Button";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import AuthContext from '@/auth';

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (auth.errorMessage) {
            setError(auth.errorMessage);
        }
    }, [auth.errorMessage]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (username.length < 5 || username.length > 50) {
            setError('Username must be between 5 and 50 characters.');
            return;
        }

        // Regular expression for email validation
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        if (!passwordPattern.test(password)) {
            setError('Password must contain at least 8 characters, including one uppercase letter, one number, and one special character.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        auth.registerUser(username, email, password)
            .then(() => {
                // Check for an error message in the auth state
                if (auth.errorMessage) {
                    setError(auth.errorMessage);
                } else {
                    // Handle successful registration
                    // Redirect to login or show success message
                }
            })
            .catch(() => {
                // Handle any additional errors
                if (auth.errorMessage) {
                    setError(auth.errorMessage);
                }
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='registerInfo'>
                <h1>Create Account</h1>
                {error && <p className='errorMessage'>{error}</p>}
                <div className='inputContainer'>
                    <div className='inputRow'>
                        <div className='inputLabel'>
                            <label>
                                Username:
                                <br />
                                <input
                                    type='text'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div className='inputLabel'>
                            <label>
                                Email:
                                <br />
                                <input
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                    </div>
                    <div className='inputRow'>
                        <div className='inputLabel'>
                            <label>
                                Password:
                                <br />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <IconButton
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </label>
                            <p>Password must contain at least 8 characters, include both uppercase
                                and lowercase letters, and at least 1 special character.
                            </p>
                        </div>
                        <div className='inputLabel'>
                            <label>
                                Confirm Password:
                                <br />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <IconButton
                                    onClick={toggleConfirmPasswordVisibility}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="buttonContainer">
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            mt: 1,
                            mb: 3,
                            backgroundColor: "#F06292",
                            color: "white",
                            ":hover": {
                                backgroundColor: "lightpink",
                            },
                            border: "3px solid white",
                            width: "300px",
                        }}
                    >
                        Register
                    </Button>
                </div>
                <div className='already'>
                    Already have an account? <Link href='/login'>LOGIN</Link>
                </div>
            </form>
        </div>
    );
}