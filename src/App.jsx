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
    // Se utiliza el componente Router para manejar la navegación en la aplicación
    <Router>
      {/* Toaster permite mostrar notificaciones emergentes en la parte superior */}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      {/* Se definen las rutas de la aplicación usando el componente Routes */}
      <Routes>
        {/* Ruta principal que carga la página de inicio */}
        <Route path="/" element={<Home />} />

        {/* Ruta para la gestión de citas */}
        <Route path="/citas" element={<Citas />} />

        {/* Ruta para el inicio de sesión */}
        <Route path="/login" element={<Login />} />

        {/* Ruta para el registro de nuevos usuarios */}
        <Route path="/registro" element={<Registro />} />

        {/* Ruta para la activación de cuentas */}
        <Route path="/activarCuenta" element={<ActivarCuenta />} />

        {/* Ruta para recuperar la contraseña */}
        <Route path="/recuperarContraseña" element={<RecuperarContraseña />} />

        {/* Ruta para cambiar la contraseña */}
        <Route path="/cambiarContraseña" element={<CambiarContraseña />} />
      </Routes>
    </Router>
  )
}

export default App
