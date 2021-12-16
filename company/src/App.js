import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserState from "./context/users/UserState";
import AddEmployee from "./components/AddEmployee";
import BirthdayList from "./components/BirthdayList";


function App() {
  return (
    <div>
      <UserState>
      <Router>
        <Navbar />
        
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/addemployee" element={<AddEmployee />} />
          <Route exact path="/birthdaylist" element={<BirthdayList />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
        </Routes> 
      </Router>
      </UserState>
    </div>
  );
}

export default App;
