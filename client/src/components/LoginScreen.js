import { useState } from "react";
import axios from "axios"; 


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

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
        <div style={{ flex: 1, marginTop: '100px' }}>
            <form onSubmit={handleSubmit} className='loginInfo'>
                {error && <p className='errorMessage'>{error}</p>}
                <label className='inputLabel'>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label className='inputLabel'>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit" className='loginButton'>Login</button>
            </form>
        </div>
    );
}



