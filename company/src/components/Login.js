import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';



const Login = (props) => {

    const [credentials, setcredentials] = useState({email : "", password : ""});
    const navigate = useNavigate();
    const handleLogin = async(e)=>{
        e.preventDefault();
        const {email, password} = credentials;
        const response = await fetch('http://localhost:5000/api/auth/login',{
            method : "POST",
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({email : email, password : password})
        });
        const json = await response.json();
        console.log(json);

        if(json.success){
            localStorage.setItem('token',json.authToken);
            navigate('/');

        }else{
            alert('Invalid Credentials');
        }

    }

    const onChange = (e)=>{
        setcredentials({...credentials, [e.target.name] : e.target.value});
    }

    return (
        <div className="container my-3 mt-3">
            <div className="col-md-6" style={{margin : "auto"}}>
                <h2 className="mt-4 mb-4" style={{textAlign :"center"}} > Login here </h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3" >
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp"/>
                    </div>
                    <div className="mb-3" >
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" name="password" onChange={onChange} />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Login