import React, {useContext} from 'react';
import userContext from '../context/users/userContext'


const Notifications = () => {

    const context = useContext(userContext);
    const {getname, name} = context;

    const handleBirthday = (e) => {
        e.preventDefault();
        getname();
        
    }

  
    return (
        <div className='container my-3'>
            <button type="button" className="btn btn-primary" onClick={handleBirthday}>Get birthdays</button><br/>
            {name }
            
        </div>  
    )
}

export default Notifications
