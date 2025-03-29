import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();

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
        `relative text-lg font-semibold tracking-wide uppercase transition-all duration-300 ${location.pathname === path ? "text-primary" : "text-white hover:text-accent"}`
    );

    return (
        <header className="bg-secondary shadow-lg">
            <nav className="text-white py-4 px-6 flex items-center justify-between">

                {/* Logo estilizado con efecto glow */}
                <h1 className="text-4xl font-extrabold text-white animate-pulse drop-shadow-[0_0_15px_rgba(215,47,139,0.7)]">
                    Odonto<span className="text-primary">Logic</span>
                </h1>

                {/* Enlaces principales con subrayado animado */}
                <ul className="hidden md:flex space-x-8 text-xl">
                    {["/", "/citas"].map((path, index) => (
                        <li key={index} className="relative group">
                            <a href={path} className={getLinkClass(path)}>
                                {path === "/" ? "Home" : "Citas"}
                            </a>
                            <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                        </li>
                    ))}
                </ul>

                {/* Botones de usuario */}
                <ul className="hidden md:flex space-x-6 text-xl">
                    {isLoggedIn ? (
                        <li>
                            <button
                                className="text-red-500 hover:text-red-700 font-semibold transition-all duration-300"
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

                {/* Menú hamburguesa para móviles */}
                <button
                    className="md:hidden text-3xl text-white focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </nav>

            {/* Menú móvil */}
            {isOpen && (
                <div className="md:hidden bg-secondary text-white py-4 px-6 space-y-4">
                    {["Home", "Citas", "Iniciar sesión", "Registro"].map((text, index) => (
                        <a
                            key={index}
                            href={text === "Home" ? "/" : text === "Citas" ? "/citas" : text === "Iniciar sesión" ? "/login" : "/registro"}
                            className="block text-xl font-semibold hover:text-accent transition-all duration-300"
                        >
                            {text}
                        </a>
                    ))}
                    {isLoggedIn && (
                        <button
                            className="block text-xl font-semibold text-red-500 hover:text-red-700 transition-all duration-300"
                            onClick={handleLogout}
                        >
                            Cerrar sesión
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}