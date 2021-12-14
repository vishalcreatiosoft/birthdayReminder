import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {

    const [details, setdetails] = useState({firstname: "", lastname: "", email: "", password: ""});
    let navigate = useNavigate();
    const handleSubmit = async(e)=>{
        e.preventDefault();
        const {firstname, lastname, email, password} = details;
        const response = await fetch("http://localhost:5000/api/auth/signup",{
            method : "POST",
            headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({firstname : firstname, lastname : lastname, email : email, password : password})
        });
        const json = await response.json();
        console.log(json);

        if(json.success){
            navigate('/login');
        }else{
            alert('Invalid details');
        }
    }
    
    const onChange = (e)=>{
        setdetails({...details, [e.target.name] : e.target.value});
    }

    return (
        <div className="container mt-3 mb-3">
            <h2 className="mt-4"  style={{textAlign : "center"}}> Signup here </h2>
            <form className="row my-3 g-3" onSubmit={handleSubmit}>
                <div className="col-md-6 ">
                    <label htmlFor="firstname" className="form-label">Firstname</label>
                    <input type="text" className="form-control" id="firstname" name="firstname" onChange={onChange}/>
                </div>
                <div className="col-md-6">
                    <label htmlFor="lastname" className="form-label">Lastname</label>
                    <input type="text" className="form-control" id="lastname" name="lastname" onChange={onChange}/>
                </div>
                <div className="col-12">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email"  onChange={onChange} placeholder="abc@gmail.com"/>
                </div>
                <div className="col-12">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" id="password" onChange={onChange}/>
                </div>
                <div className="col-12">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} />
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn-primary" >Signup</button>
                </div>
            </form>
        </div>
    )
}

export default Signup