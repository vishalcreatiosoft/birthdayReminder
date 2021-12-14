import React, { useContext } from 'react'
import userContext from '../context/users/userContext'

const About = () => {

    const person = useContext(userContext);
    
    return (
        <div className='container my-3'>
            this is about page for {person.name}
        </div>
    )
}

export default About
