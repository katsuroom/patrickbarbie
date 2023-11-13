import { useState, useContext } from "react";
import axios from "axios";

import AuthContext from '../../auth';
import "./LoginScreen.css"
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';
import TitleBar from '../TitleBar';
import StatusBar from '../StatusBar';


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { auth } = useContext(AuthContext);

    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     loginUser(email, password)
    //     .then(userCredientials => {
    //         window.alert(`Welcome to Patrick Barbie, ${userCredientials.user.displayName}.`);
    //         window.location.href = "/main";
    //     })
    //     .catch(error => {
    //         setError("Invalid login credentials.");
    //     })
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        auth.loginUser(
            email,
            password
        );

        // try {
        //     const response = await axios.post('http://localhost:8000/login', { email, password });

        //     if (response.status === 200) {
        //         window.alert("Login successful. Redirect to dashboard."); 
        //         window.location.href = "/main";

        //     } else {
        //         setError("Invalid email or password. Please try again.");
        //     }
        // } catch (error) {
        //     console.error("Login error:", error);
        //     setError("Invalid email or password. Please try again.");
        // }
    };

    return (
        <div>
            <TitleBar />
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
                                <Link to='/recovery'>Forgot Password?</Link>
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
                    Need an account? <Link to='/register'>SIGN UP</Link>
                </div>
            </form>
            <StatusBar />
        </div>
    );
}



