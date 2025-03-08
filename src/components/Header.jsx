import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="bg-secondary">
            <nav className="text-white py-5 px-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Corpodent</h1>
                    
                    {/* Botón del menú hamburguesa */}
                    <button 
                        className="md:hidden text-3xl focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Menú de navegación */}
                <ul className={`md:flex md:justify-center md:space-x-8 text-2xl mt-5 md:mt-0 transition-all duration-300 ${isOpen ? 'block' : 'hidden'} md:block`}>
                    <li><a href="#" className="block py-2 md:inline hover:text-accent">Home</a></li>
                    <li><a href="/citas" className="block py-2 md:inline hover:text-accent">Citas</a></li>
                    <li><a href="/login" className="block py-2 md:inline hover:text-accent">Iniciar sesión</a></li>
                    <li><a href="/registro" className="block py-2 md:inline hover:text-accent">Registro</a></li>
                </ul>
            </nav>
        </header>
    );
}