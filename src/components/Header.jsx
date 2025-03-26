import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom"; // Importamos useLocation para detectar la ruta actual

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation(); // Obtiene la ubicación actual

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        window.location.reload();
    };

    const getLinkClass = (path) => (
        location.pathname === path ? "text-primary font-bold" : "hover:text-accent"
    );

    return (
        <header className="bg-secondary">
            <nav className="text-white py-5 px-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">OdontoLogic</h1>
                    <button
                        className="md:hidden text-3xl focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                <ul className={`md:flex md:justify-center md:space-x-8 text-2xl mt-5 md:mt-0 transition-all duration-300 ${isOpen ? 'block' : 'hidden'} md:block`}>
                    <li><a href="/" className={`block md:inline ${getLinkClass("/")}`}>Home</a></li>
                    <li><a href="/citas" className={`block md:inline ${getLinkClass("/citas")}`}>Citas</a></li>
                    {isLoggedIn ? (
                        <li>
                            <button
                                className="block md:inline text-red-500 hover:text-red-700 font-semibold"
                                onClick={handleLogout}
                            >
                                Cerrar sesión
                            </button>
                        </li>
                    ) : (
                        <>
                            <li><a href="/login" className={`block md:inline ${getLinkClass("/login")}`}>Iniciar sesión</a></li>
                            <li><a href="/registro" className={`block md:inline ${getLinkClass("/registro")}`}>Registro</a></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}
