import Register from "./pages/Register"
import Login from './pages/Login'
import Budget from './pages/Budget'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element= {<Login />}></Route>
        <Route path="/register" element ={<Register />}></Route>
        <Route path="/budget" element ={<Budget />}></Route>
      </Routes>
    </Router>
    </div>
  );
}

export default App;