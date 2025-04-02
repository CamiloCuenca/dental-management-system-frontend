import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const location = useLocation();

    const obtenerDatosUsuarioDesdeToken = () => {
        const token = sessionStorage.getItem('token');
        if (!token) return null;
        try {
            const payloadBase64 = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            // Decodificar el nombre y apellido para manejar caracteres especiales
            const nombre = decodeURIComponent(escape(decodedPayload.nombre));
            const apellido = decodeURIComponent(escape(decodedPayload.lastName));
            return { nombre, apellido };
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        setIsLoggedIn(!!token);
        if (token) {
            const datosUsuario = obtenerDatosUsuarioDesdeToken();
            if (datosUsuario) {
                setUserName(datosUsuario.nombre || "Usuario");
                setUserLastName(datosUsuario.apellido || "");
            }
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        setIsLoggedIn(false);
        window.location.href = "/";
    };

    const getLinkClass = (path) => (
        `relative text-lg font-semibold tracking-wide uppercase transition-all duration-300 ${location.pathname === path ? "text-primary" : "text-white hover:text-accent"}`
    );

    return (
        <header className="bg-secondary shadow-lg">
            <nav className="text-white py-4 px-6 flex items-center justify-between">

                {/* Logo estilizado con efecto glow */}
                <a href="/" className={getLinkClass("/")}>
                    <h1 className="text-4xl font-extrabold text-white animate-pulse drop-shadow-[0_0_15px_rgba(215,47,139,0.7)] normal-case">
                        Odonto<span className="text-primary">Logic</span>
                    </h1>
                </a>

                {/* Enlaces principales con subrayado animado */}
                <ul className="hidden md:flex space-x-8 text-xl">
                    {["/", "/citas", "/historialMedicoUsuario"].map((path, index) => (
                        <li key={index} className="relative group">
                            <a href={path} className={getLinkClass(path)}>
                                {path === "/" ? "Home" : path === "/citas" ? "Citas" : "Historiales Médicos"}
                            </a>
                            <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                        </li>
                    ))}
                </ul>

                {/* Botones de usuario */}
                <ul className="hidden md:flex space-x-6 text-xl">
                    {isLoggedIn ? (
                        <li className="relative">
                            <button
                                className="flex items-center space-x-2 text-white hover:text-accent transition-all duration-300"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <FaUserCircle className="text-2xl" />
                                <span>{userName} {userLastName}</span>
                                <FaCaretDown className="text-xl" />
                            </button>
                            
                            {/* Menú desplegable */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm text-gray-500">Bienvenido</p>
                                        <p className="font-semibold text-gray-800">{userName} {userLastName}</p>
                                    </div>
                                    <a
                                        href="/perfil"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-all duration-300"
                                    >
                                        Contenido del Perfil
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition-all duration-300"
                                    >
                                        Cerrar sesión
                                    </button>
                                </div>
                            )}
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
                    {["Home", "Citas", "Historiales Médicos", "Iniciar sesión", "Registro"].map((text, index) => (
                        <a
                            key={index}
                            href={text === "Home" ? "/" : text === "Citas" ? "/citas" : text === "Historiales Médicos" ? "/historialMedicoUsuario" : text === "Iniciar sesión" ? "/login" : "/registro"}
                            className="block text-xl font-semibold hover:text-accent transition-all duration-300"
                        >
                            {text}
                        </a>
                    ))}
                    {isLoggedIn && (
                        <>
                            <a
                                href="/perfil"
                                className="block text-xl font-semibold hover:text-accent transition-all duration-300"
                            >
                                Contenido del Perfil
                            </a>
                            <button
                                className="block text-xl font-semibold text-red-500 hover:text-red-700 transition-all duration-300"
                                onClick={handleLogout}
                            >
                                Cerrar sesión
                            </button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
