import {useState} from 'react';
import axios from 'axios';

function Register({setPage}){
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const register=async()=>{
        if(!name||!email||!password){
            alert('Please fill all fields');
            return;
        }

        try{
            const response=await axios.post(
                'http://localhost:5000/api/users/register',
                {
                    name,
                    email,
                    password
                }
            );

            alert('Registration successful');
            setPage('login');

        }catch(error){
            alert(
                error.response?.data?.message||
                'Cannot connect to server'
            );
        }
    };

    return(
        <div className="auth-container">
            <div className="auth-box">
                <h1>WhatsApp</h1>
                <h2>Register</h2>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />

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

                <button onClick={register}>
                    Register
                </button>

                <p>Already have an account?</p>

                <button
                    className="secondary"
                    onClick={()=>setPage('login')}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Register;

