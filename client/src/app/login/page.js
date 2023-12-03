"use client"

import { useState, useContext } from "react";

import AuthContext from "@/auth";
import "./LoginScreen.css"
import Button from "@mui/material/Button";
import Link from "next/link";
import StoreContext from "@/store";


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { auth } = useContext(AuthContext);
    const { store } = useContext(StoreContext);

    if (!store.disableSearchBar) {
        store.setDisableSearchBar(true);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        
        auth.loginUser(
            email,
            password
        );
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='loginInfo'>
                <h1>Login</h1>

                {error && <p className='errorMessage'>{error}</p>}
                <div className='inputContainer'>
                    <div className="inputRow">
                        <label className='inputLabel'>
                            Email:
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </label>
                        <label className='inputLabel'>
                            Password:
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <div className='forgot'>
                                <Link href='/recovery'>Forgot Password?</Link>
                            </div>
                        </label>
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
                        Login
                    </Button>
                </div>
                <div className='need'>
                    Need an account? <Link href='/register'>SIGN UP</Link>
                </div>
            </form>
        </div>
    );
}



