import React, { useState, useContext } from 'react';
import './PasswordRecoveryPage.css'
import { Link } from 'react-router-dom';
import AuthContext from '../../auth';


import Button from "@mui/material/Button";
import TitleBar from '../TitleBar';
import StatusBar from '../StatusBar';
import StoreContext from '../../store';



function PasswordRecoveryPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);



    const {auth} = useContext(AuthContext);

    const { store } = useContext(StoreContext);

    if (!store.disableSearchBar) {
        store.setDisableSearchBar(true);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await auth.sendPasswordRecoveryEmail(email);
        console.log(response);
        if (response && response.status === 200){
            setError(null);
            setInfo("Email has been sent. Please check your mail box.")
        }
        else{
            setInfo(null);
            setError("We can't find any account with this email address, please check again.");
        }
    };

    return (
        <div>
            <div style={{ flex: 1, marginTop: '50px'}}>
                <form onSubmit={handleSubmit} className='recoveryInfo'>
                    {error && <p className='errorMessage'>{error}</p>}
                    {info && <p className='errorMessage' style={{color: "blue"}}>{info}</p>}

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
