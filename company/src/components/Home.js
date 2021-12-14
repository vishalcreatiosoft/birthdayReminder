import React, { useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();
    useEffect(() => {
       if(localStorage.getItem('token')){
           //console.log(localStorage.getItem('token'));
       }else{
           navigate('/login');
       }
       // eslint-disable-next-line
    }, [])

    return (
        <div className='container my-3'>
            Welcome to Home page.
        </div>
    )
}

export default Home
