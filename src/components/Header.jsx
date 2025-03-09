import { useState, useEffect } from "react"; // Importamos React y los hooks useState y useEffect
import { FaBars, FaTimes } from "react-icons/fa"; // Importamos iconos de react-icons

export default function Header() {
    // Estado para controlar si el menú hamburguesa está abierto o cerrado
    const [isOpen, setIsOpen] = useState(false);
    
    // Estado para verificar si el usuario está autenticado
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Verificar si hay un token en sessionStorage
        const token = sessionStorage.getItem("token");
        setIsLoggedIn(!!token); // Si hay token, establece isLoggedIn en true, si no, en false
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token"); // Eliminar token de sessionStorage
        setIsLoggedIn(false); // Actualizar el estado de autenticación
        window.location.reload(); // Recargar la página para reflejar los cambios
    };

    return (
        <header className="bg-secondary">
            <nav className="text-white py-5 px-6">
                <div className="flex justify-between items-center">
                    {/* Nombre de la aplicación */}
                    <h1 className="text-3xl font-bold">OdontoLogic</h1>

                    {/* Botón del menú hamburguesa para pantallas pequeñas */}
                    <button 
                        className="md:hidden text-3xl focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)} // Cambia el estado de isOpen al hacer clic
                    >
                        {isOpen ? <FaTimes /> : <FaBars />} {/* Alterna entre ícono de abrir y cerrar menú */}
                    </button>
                </div>

                {/* Menú de navegación */}
                <ul className={`md:flex md:justify-center md:space-x-8 text-2xl mt-5 md:mt-0 transition-all duration-300 ${isOpen ? 'block' : 'hidden'} md:block`}>
                    <li><a href="/" className="block md:inline hover:text-accent">Home</a></li>
                    <li><a href="/citas" className="block md:inline hover:text-accent">Citas</a></li>

                    {/* Si el usuario está autenticado, muestra la opción de cerrar sesión */}
                    {isLoggedIn ? (
                        <li>
                            <button 
                                className="block md:inline text-red-500 hover:text-red-700 font-semibold"
                                onClick={handleLogout} // Llama a la función handleLogout al hacer clic
                            >
                                Cerrar sesión
                            </button>
                        </li>
                    ) : (
                        // Si no está autenticado, muestra las opciones de inicio de sesión y registro
                        <>
                            <li><a href="/login" className="block md:inline hover:text-accent">Iniciar sesión</a></li>
                            <li><a href="/registro" className="block md:inline hover:text-accent">Registro</a></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}