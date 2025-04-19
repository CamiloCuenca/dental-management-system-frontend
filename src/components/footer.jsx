import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[var(--color-secondary)] px-4 md:px-16 lg:px-28 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h2 className="text-lg font-bold mb-4 text-[var(--color-white)]">
                        Información de contacto
                    </h2>
                    <ul className="space-y-2">
                        <li className="text-[var(--color-gray-light)] font-light"> <b>Dirección 1:</b> Cra. 123 #98, Armenia </li>
                        <li className="text-[var(--color-gray-light)] font-light"> <b>Dirección 2:</b> Cra. 987 #36, Armenia </li>
                        <li className="text-[var(--color-gray-light)] font-light"> <b>Teléfono:</b> (606) 7123456 - 300 1234567 </li>
                        <li className="text-[var(--color-gray-light)] font-light"> <b>Correo:</b> odontologic@info.com</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 text-[var(--color-white)]">
                        Enlaces rápidos
                    </h2>
                    <ul className="space-y-2">
                        <li> <a href="#" className="hover:scale-110 transition-all duration-300 text-[var(--color-gray-light)]"> Inicio </a></li>
                        <li> <a href="/login" className="hover:scale-110 transition-all duration-300 text-[var(--color-gray-light)]"> Iniciar sesión </a></li>
                        <li> <a href="/citas" className="hover:scale-110 transition-all duration-300 text-[var(--color-gray-light)]"> Agendar cita </a></li>
                        <li> <a href="#" className="hover:scale-110 transition-all duration-300 text-[var(--color-gray-light)]"> Política de privacidad </a></li>
                        <li> <a href="#" className="hover:scale-110 transition-all duration-300 text-[var(--color-gray-light)]"> Términos y condiciones </a></li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-bold mb-4 text-[var(--color-white)]">
                        Redes sociales
                    </h2>
                    <ul className="flex space-x-6">
                        <li className="flex items-center space-x-2">
                            <FaFacebook className="text-blue-900 drop-shadow-lg hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-300" />
                            <a href="https://www.facebook.com" className="hover:scale-110 transition-all duration-300 text-[var(--color-gray-light)]"> Facebook</a>
                        </li>
                        <li className="flex items-center space-x-2">
                            <FaTwitter className="text-blue-400 drop-shadow-lg hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-300" />
                            <a href="https://x.com" className="hover:scale-110 transition-all duration-300 text-[var(--color-gray-light)]"> Twitter</a>
                        </li>
                        <li className="flex items-center space-x-2">
                            <FaInstagram className="text-orange-500 drop-shadow-lg hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-300" />
                            <a href="https://www.instagram.com" className="hover:scale-110 transition-all duration-300 text-[var(--color-gray-light)]"> Instagram</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-gray-400 border-t pt-6 text-[var(--color-gray-light)] text-center mt-6">
                <p className="font-light">© 2025 OdontoLogic. Todos los derechos reservados</p>
            </div>
        </footer>
    );
}