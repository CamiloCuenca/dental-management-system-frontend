import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import TokenService from '../services/tokenService';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userRole, setUserRole] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el usuario está autenticado
        setIsLoggedIn(TokenService.isAuthenticated());
        
        if (TokenService.isAuthenticated()) {
            // Obtener el nombre completo del usuario
            const fullName = TokenService.getFullName();
            if (fullName) {
                const [nombre, apellido] = fullName.split(' ');
                setUserName(nombre || "Usuario");
                setUserLastName(apellido || "");
            }
            // Obtener el rol del usuario
            const role = TokenService.getRole();
            setUserRole(role);
        }
    }, []);

    const handleLogout = () => {
        TokenService.clearToken();
        setIsLoggedIn(false);
        window.location.href = "/";
    };

    const handleNavigation = (path) => {
        if (path === "/citas") {
            if (!isLoggedIn) {
                navigate("/agendar-cita");
                return;
            }
            if (userRole === "DOCTOR") {
                navigate("/homeDoctor");
                return;
            }
            if (userRole === "ADMINISTRATOR") {
                navigate("/homeAdmin");
                return;
            }
        }
        navigate(path);
    };

    const getLinkClass = (path) => (
        `relative text-lg font-semibold tracking-wide uppercase transition-all duration-300 ${location.pathname === path ? "text-primary" : "text-white hover:text-accent"}`
    );

    const getAdminLinks = () => {
        if (userRole === "ADMINISTRATOR") {
            return (
                <>
                    <li className="relative group">
                        <button
                            onClick={() => handleNavigation("/admin/citas-no-autenticadas")}
                            className={getLinkClass("/admin/citas-no-autenticadas")}
                        >
                            Gestión de Citas
                        </button>
                        <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                    </li>
                </>
            );
        }
        return null;
    };

    const getRolePrefix = () => {
        if (userRole === "DOCTOR") return "Doctor ";
        if (userRole === "ADMINISTRATOR") return "Admin ";
        return "";
    };

    return (
        <header className="bg-secondary shadow-lg">
            <nav className="text-white py-4 px-6 flex items-center justify-between">
                {/* Logo estilizado con efecto glow */}
                <button
                    onClick={() => handleNavigation("/")}
                    className={getLinkClass("/")}
                >
                    <h1 className="text-4xl font-extrabold text-white animate-pulse drop-shadow-[0_0_15px_rgba(215,47,139,0.7)] normal-case">
                        Odonto<span className="text-primary">Logic</span>
                    </h1>
                </button>

                {/* Enlaces principales con subrayado animado */}
                <ul className="hidden md:flex space-x-8 text-xl">
                    {["/", "/citas", "/historialMedicoUsuario"].map((path, index) => (
                        <li key={index} className="relative group">
                            <button
                                onClick={() => handleNavigation(path)}
                                className={getLinkClass(path)}
                            >
                                {path === "/" ? "Home" : path === "/citas" ? "Citas" : "Historiales Médicos"}
                            </button>
                            <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-accent transition-all duration-300 group-hover:w-full"></span>
                        </li>
                    ))}
                    {getAdminLinks()}
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
                                <span>{getRolePrefix()}{userName} {userLastName}</span>
                                <FaCaretDown className="text-xl" />
                            </button>
                            
                            {/* Menú desplegable */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm text-gray-500">Bienvenido</p>
                                        <p className="font-semibold text-gray-800">{getRolePrefix()}{userName} {userLastName}</p>
                                    </div>
                                    <button
                                        onClick={() => handleNavigation("/perfil")}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-all duration-300"
                                    >
                                        Contenido del Perfil
                                    </button>
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
                            <li>
                                <button
                                    onClick={() => handleNavigation("/login")}
                                    className={getLinkClass("/login")}
                                >
                                    Iniciar sesión
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavigation("/registro")}
                                    className={getLinkClass("/registro")}
                                >
                                    Registro
                                </button>
                            </li>
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
                    {["Home", "Citas", "Historiales Médicos"].map((text, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigation(
                                text === "Home" ? "/" : 
                                text === "Citas" ? "/citas" : 
                                "/historialMedicoUsuario"
                            )}
                            className="block text-xl font-semibold hover:text-accent transition-all duration-300"
                        >
                            {text}
                        </button>
                    ))}
                    {userRole === "ADMINISTRATOR" && (
                        <button
                            onClick={() => handleNavigation("/admin/citas-no-autenticadas")}
                            className="block text-xl font-semibold hover:text-accent transition-all duration-300"
                        >
                            Gestión de Citas
                        </button>
                    )}
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={() => handleNavigation("/perfil")}
                                className="block text-xl font-semibold hover:text-accent transition-all duration-300"
                            >
                                Contenido del Perfil
                            </button>
                            <button
                                className="block text-xl font-semibold text-red-500 hover:text-red-700 transition-all duration-300"
                                onClick={handleLogout}
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => handleNavigation("/login")}
                                className="block text-xl font-semibold hover:text-accent transition-all duration-300"
                            >
                                Iniciar sesión
                            </button>
                            <button
                                onClick={() => handleNavigation("/registro")}
                                className="block text-xl font-semibold hover:text-accent transition-all duration-300"
                            >
                                Registro
                            </button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
