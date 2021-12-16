import React from 'react'
import { Link, useNavigate} from 'react-router-dom';


const Navbar = () => {
    const navigate = useNavigate();
   
    const handleLogout = ()=>{
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                {!localStorage.getItem('token') ? <Link className="navbar-brand" to="/login">Company</Link>:
                <Link className="navbar-brand" to="/">Company</Link>}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                {localStorage.getItem('token')? 
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/addemployee">AddEmployee</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/birthdaylist">BirthdayList</Link>
                        </li>
                  
                    </ul> :<ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link " aria-current="page" to="/login"></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link " to="/login"></Link>
                        </li>
                    </ul> }

                    {!localStorage.getItem('token') ?<form className="d-flex">
                        <Link className="btn btn-primary mx-1" to="/login" role="button">Login</Link>
                        <Link className="btn btn-primary mx-1" to="/signup" role="button">Signup</Link>
                    </form> : <Link className="btn btn-primary " to="/login" onClick={handleLogout} role="button">Logout</Link> }
                    
                </div>
            </div>
        </nav>
    )
}

export default Navbar
