import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TokenService from '../services/tokenService';

const FormularioHistorialMedico = () => {
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar autenticación
        if (!TokenService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        // Obtener ID del usuario
        const id = TokenService.getUserId();
        if (!id) {
            navigate('/login');
            return;
        }
        setUserId(id);
    }, [navigate]);

    // Si no hay userId, no renderizar el formulario
    if (!userId) {
        return null;
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10
        bg-gradient-to-r from-[var(--color-primary)] from-10%
        via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">
            <div className="flex shadow-2xl w-full max-w-2xl">
                <div className="flex flex-col items-center justify-center text-center p-10 sm:p-16 gap-6 sm:gap-8 
                bg-white rounded-2xl xl:rounded-tr-2xl xl:rounded-br-2xl w-full">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary)]">
                        Historial Médico
                        <hr className="border-t border-gray-600 my-4" />
                    </h1>
                    {/* Aquí irá el contenido del formulario */}
                </div>
            </div>
        </section>
    );
};

export default FormularioHistorialMedico; 