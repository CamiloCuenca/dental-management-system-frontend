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
                {/* Título alineado a la izquierda */}
                <h1 className="text-4xl font-extrabold text-white animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                    OdontoLogic
                </h1>

                {/* Sección central con Home y Citas */}
                <ul className="flex space-x-8 text-xl">
                    <li><a href="/" className={getLinkClass("/")}>Home</a></li>
                    <li><a href="/citas" className={getLinkClass("/citas")}>Citas</a></li>
                </ul>

                {/* Sección derecha con Iniciar sesión y Registro */}
                <ul className="flex space-x-6 text-xl">
                    {isLoggedIn ? (
                        <li>
                            <button
                                className="text-red-500 hover:text-red-700 font-semibold"
                                onClick={handleLogout}
                            >
                                Cerrar sesión
                            </button>
                        </li>
                    ) : (
                        <>
                            <li><a href="/login" className={getLinkClass("/login")}>Iniciar sesión</a></li>
                            <li><a href="/registro" className={getLinkClass("/registro")}>Registro</a></li>
                        </>
                    )}
                </ul>

                {/* Botón de menú hamburguesa en móviles */}
                <button
                    className="md:hidden text-3xl focus:outline-none absolute right-6"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </nav>
        </header>
    );
}
