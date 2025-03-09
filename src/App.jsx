import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Citas from './pages/citas'
import Login from './pages/login'
import Registro from './pages/registro';
import ActivarCuenta from './pages/activarCuenta';
import RecuperarContraseña from './pages/recuperarContraseña';
import CambiarContraseña from './pages/cambiarContraseña';
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
      <Route path="/activarCuenta" element={<ActivarCuenta />} />
      <Route path="/recuperarContraseña" element={<RecuperarContraseña />} />
      <Route path="/cambiarContraseña" element={<CambiarContraseña />} />
    </Routes>
    </Router>

  )
}

export default App
