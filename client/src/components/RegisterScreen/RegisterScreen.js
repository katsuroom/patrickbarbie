
import AuthContext from '../../auth';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import "./RegisterScreen.css";
import Button from "@mui/material/Button";

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        auth.registerUser(username, email, password);
    };

    console.log(auth);

    return (
        <div style={{ flex: 1, marginTop: '100px' }}>
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
                                    type='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <p>Password must contain at least 8 characters, include both uppercase
                                    and lowercase letters, and at least 1 special character.
                                </p>
                            </label>
                        </div>
                        <div className='inputLabel'>
                            <label>
                                Confirm Password:
                                <br />
                                <input
                                    type='password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="buttonContainer">
                    <Button
                        type="submit"
                        variant="contained"
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
                    Already have an account? <Link to='/login'>LOGIN</Link>
                </div>
            </form>
        </div>
    );
}
