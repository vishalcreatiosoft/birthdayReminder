import React, { useState } from 'react'
import UserContext from './userContext';

const UserState = (props) => {
    let initialName = []
    const host = 'http://localhost:5000';
    const [name, setname] = useState(initialName);

    //Route1 - getting all names from database to show birthday - /api/auth/employee/birthday.
    const getname = async(dob)=>{
        const response = await fetch(`${host}/api/auth/employee/birthday`,{
            method : "POST",
            headers : {
                'Content-type' : 'application/json',
            },
            body: JSON.stringify({dob})
        });
        const json = await response.json(); 
        setname(json);
       
    }




    return (
        <UserContext.Provider value={{getname, name}} >
            {props.children}
        </UserContext.Provider>
    )
}

export default UserState
