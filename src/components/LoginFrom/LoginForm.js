import React,{useState} from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import './LoginFrom.css';

function LoginFrom(){
    const [username,setUsername]  = useState("");
    const [password,setPassword] = useState("");

    const navigate = useNavigate();

    const handleLgoin = async(e)=>{
        e.preventDefault();
        try {
            
            const responseLogin = await axios.post("http://localhost:8080/api/login",
                {
                    username,
                    password
                },{
                    withCredentials: true,
                }
            );
            console.log("Login Success Full: ",responseLogin.data)
            localStorage.setItem("username", username);  // 👈 Add this
            localStorage.setItem("SID",responseLogin.data.sessionId)
            localStorage.setItem("Token",responseLogin.data.Token)
            
          
            console.log("SET success full")
            navigate("/home")
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            alert("Login failed. Check username/password.");
        }
    };

    return (
        <div className="login-container">
                <h2>Login</h2>
                <form  id="from" onSubmit={handleLgoin}>
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        required/>
                        <br></br>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required/>
                            <br></br>
                            <button type="submit" id="btn">Login</button>
                </form>
        
        </div>
    )
}

export default LoginFrom;