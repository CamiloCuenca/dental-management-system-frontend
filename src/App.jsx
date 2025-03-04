import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Citas from './pages/citas'
import Login from './pages/login'
import Registro from './pages/registro';
import { Toaster } from 'react-hot-toast';


function App() {


  return (
    <Router>
<Toaster
  position="top-center"
  reverseOrder={false}
/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/citas" element={<Citas />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
    </Router>

  )
}

export default App
