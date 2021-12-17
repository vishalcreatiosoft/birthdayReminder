import React, {useState} from 'react';


const AddEmployee = () => {

    const [details, setdetails] = useState({firstname: "", lastname: "", email: "", city: "", dob : "dd/mm/yyyy"});
    
    const handleAddEmployee = async(e)=>{
        e.preventDefault();
        const {firstname, lastname, email, city, dob} = details;
        const response = await fetch("http://localhost:5000/api/auth/addemployee",{
            method : "POST",
            headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({firstname : firstname, lastname : lastname, email : email, city : city, dob : dob})
        });
        const json = await response.json();
        //console.log(json);

        if(json.success){
            setdetails({firstname: "", lastname: "", email: "", city: "", dob : "dd/mm/yyyy"});
            alert('Employee Addedd')
            
        }else{
            alert('Invalid details');
        }
    }
    
    const onChange = (e)=>{
        setdetails({...details, [e.target.name] : e.target.value});
    }




    return (
        <div className='container my-3'>
            <h2 className="mt-4" style={{ textAlign: "center" }}> Add Employee </h2>
            <form className="row my-3 g-3" onSubmit={handleAddEmployee}>
                <div className="col-md-6 ">
                    <label htmlFor="firstname" className="form-label">Firstname</label>
                    <input type="text" className="form-control" id="firstname" name="firstname" value={details.firstname} onChange={onChange} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="lastname" className="form-label">Lastname</label>
                    <input type="text" className="form-control" id="lastname" name="lastname" value={details.lastname} onChange={onChange} />
                </div>
                <div className="col-12">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={details.email} onChange={onChange} placeholder="abc@gmail.com" />
                </div>
                <div className="col-12">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control" name="city" id="city" value={details.city} onChange={onChange} />
                </div>
                <div className="col-12">
                    <label htmlFor="start" style={{marginRight : "20px"}}>Date of birth</label>
                    <input type="date" id="dob" name="dob" value={details.dob}  onChange={onChange} min="1990-01-01" max="2010-12-31"/>

                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn-primary" >Add Employee</button>
                </div>
            </form>
        </div>
    )
}

export default AddEmployee
