import React from 'react'
import UserContext from './userContext';

const userState = (props) => {


    const person = {
        name : 'vishal'
    }

    return (
        <UserContext.Provider value={person} >
            {props.children}
        </UserContext.Provider>
    )
}

export default userState
