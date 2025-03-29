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
            <nav className="text-white py-4 px-6 flex items-center justify-between">
                <h1 className="text-4xl font-extrabold text-blue-500 animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                    OdontoLogic
                </h1>
                <ul className="hidden md:flex md:items-center md:space-x-8 text-xl">
                    <li><a href="/" className={`block ${getLinkClass("/")}`}>Home</a></li>
                    <li><a href="/citas" className={`block ${getLinkClass("/citas")}`}>Citas</a></li>
                    {isLoggedIn ? (
                        <li>
                            <button
                                className="block text-red-500 hover:text-red-700 font-semibold"
                                onClick={handleLogout}
                            >
                                Cerrar sesión
                            </button>
                        </li>
                    ) : (
                        <>
                            <li><a href="/login" className={`block ${getLinkClass("/login")}`}>Iniciar sesión</a></li>
                            <li><a href="/registro" className={`block ${getLinkClass("/registro")}`}>Registro</a></li>
                        </>
                    )}
                </ul>
                <button
                    className="md:hidden text-3xl focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </nav>
        </header>
    );
}
