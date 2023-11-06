import { useContext } from 'react';
import AuthContext from '../auth'
import { useState } from "react";

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        auth.registerUser(
            username, 
            email, 
            password 
        );
    };

    console.log(auth);
    

    return (
        <div style={{ flex: 1, marginTop: '100px' }}>
            <form onSubmit={handleSubmit} className='registerInfo'>
                {error && <p className='errorMessage'>{error}</p>}
                <label className='inputLabel'>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label className='inputLabel'>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label className='inputLabel'>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" className='registerButton'>Register</button>
            </form>
        </div>
    );
}