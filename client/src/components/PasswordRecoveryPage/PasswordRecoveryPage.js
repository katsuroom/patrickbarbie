import React, { useState } from 'react';
import './PasswordRecoveryPage.css'
import { Link } from 'react-router-dom';


import Button from "@mui/material/Button";
import TitleBar from '../TitleBar';
import StatusBar from '../StatusBar';



function PasswordRecoveryPage() {
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // how to handle it 
    };

    return (
        <div>
            <TitleBar />
            <div style={{ flex: 1, marginTop: '50px'}}>
                <form onSubmit={handleSubmit} className='recoveryInfo'>
                    <h1>Reset Password</h1>
                    <div className='inputContainer'>
                        <div className='inputRow'>
                            <p>Enter the email address associated with your
                                account and we'll send you a link to reset your password.</p>
                            <label htmlFor="email">Email</label>

                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                            {/* <button type="submit">CONTINUE</button> */}
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
                                    CONTINUE
                                </Button>
                            </div>
                            <p>Don't have an account? <Link to='/register'>SIGN UP</Link></p>
                        </div>
                    </div>
                </form>
            </div>
            <StatusBar />
        </div>
    );
}

export default PasswordRecoveryPage;
