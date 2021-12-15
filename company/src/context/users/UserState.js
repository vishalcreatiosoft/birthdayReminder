import React, { useState } from 'react'
import UserContext from './userContext';

const UserState = (props) => {

    const host = 'http://localhost:5000';
    const [name, setname] = useState([]);

    //Route1 - getting all names from database to show birthday - /api/auth/employee/birthday.
    const getname = async()=>{
        const response = await fetch(`${host}/api/auth/employee/birthday`,{
            method : "GET",
            headers : {
                'Content-type' : 'application/json',
            }
        });
        const json = await response.json();
        console.log(json);   
        setname(json);
       // console.log('hello');
    }




    return (
        <UserContext.Provider value={{getname, name}} >
            {props.children}
        </UserContext.Provider>
    )
}

export default UserState
