import React, {useContext, useState} from 'react';
import userContext from '../context/users/userContext'
import BirthdayCard from './BirthdayCard';

const BirthdayList = () => {
    let i = 0
    const context = useContext(userContext);
    const {getname, name} = context;

    const [date, setdate] = useState({dob : "dd/mm/yyyy"})
    
    const handleSubmit = (e)=>{
        e.preventDefault();
        if(date.dob === "dd/mm/yyyy")
        {
            alert('Please Select Date')
        }else{
            getname(date.dob);
        } 
    }

    const onChange = (e)=>{
        setdate({...date, [e.target.name] : e.target.value});
    }

    return (
        <div className='container my-3' >

            <h2 className="mt-4" style={{ textAlign: "center" }}> </h2>
            <form className="row my-3 g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                    <label htmlFor="start" style={{marginRight : "20px"}}>Date of birth</label>
                    <input type="date" id="dob" name="dob"  value={date.dob} onChange={onChange} min="1990-01-01" max="2010-12-31"/>
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn-primary" >Submit</button>
                </div>
            </form>

            {name.map((person=>{
                return <BirthdayCard key={i++} person={person} />
            }))}

        </div>
    )
}

export default BirthdayList
