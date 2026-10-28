
import {useState} from 'react';
import axios from 'axios';

function Login({setUser,setPage}){
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const login=async()=>{
        if(!email||!password){
            alert('Please enter email and password');
            return;
        }

        try{
            const response=await axios.post(
                'https://chat-application-y73g.onrender.com/api/users/login',
                {
                    email,
                    password
                }
            );

            const data=response.data;

            // Save JWT
            localStorage.setItem('token',data.token);

            // Save logged-in user
            setUser(data.user);

        }catch(error){
            alert(error.response?.data?.message||'Cannot connect to server');
        }
    };

    return(
        <div className="auth-container">
            <div className="auth-box">
                <h1>WhatsApp</h1>
                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <button onClick={login}>Login</button>

                <p>Don't have an account?</p>

                <button
                    className="secondary"
                    onClick={()=>setPage('register')}
                >
                    Create Account
                </button>
            </div>
        </div>
    );
}

export default Login;
