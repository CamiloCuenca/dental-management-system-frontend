import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TokenService from '../services/tokenService';
import Swal from 'sweetalert2';

const FormularioActualizarUsuario = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        email: ""
    });
    const [cargando, setCargando] = useState(false);
    const [accountId, setAccountId] = useState(null);

    useEffect(() => {
        // Verificar autenticación
        if (!TokenService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        // Obtener ID de la cuenta desde el token
        const id = TokenService.getAccountId();
        if (!id) {
            navigate('/login');
            return;
        }
        setAccountId(id);

        // Obtener datos actuales del usuario
        const obtenerDatosUsuario = async () => {
            try {
                const response = await api.get(`/cuenta/perfil/${id}`);
                const perfilData = response.data;
                setFormData({
                    name: perfilData.name || "",
                    lastName: perfilData.lastName || "",
                    phoneNumber: perfilData.phoneNumber || "",
                    address: perfilData.address || "",
                    email: perfilData.email || ""
                });
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los datos del usuario',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        };

        obtenerDatosUsuario();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cargando) return;

        setCargando(true);

        try {
            await api.put(`/cuenta/usuario/${accountId}`, formData);

            await Swal.fire({
                title: '¡Éxito!',
                text: 'Tu información ha sido actualizada correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });

            navigate('/perfil');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar la información',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setCargando(false);
        }
    };

    if (!accountId) return null;

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-r from-[var(--color-primary)] from-10% via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">
            <div className="flex shadow-2xl w-full max-w-2xl">
                <div className="flex flex-col items-center justify-center text-center p-10 sm:p-16 gap-6 sm:gap-8 bg-white rounded-2xl xl:rounded-tr-2xl xl:rounded-br-2xl w-full">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary)]">
                        Actualizar Información
                        <hr className="border-t border-gray-600 my-4" />
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col text-lg gap-3 w-full max-w-md">
                        <div className="mb-4">
                            <label className="font-medium block mb-1">Nombres:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="font-medium block mb-1">Apellidos:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="font-medium block mb-1">Número de Teléfono:</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="font-medium block mb-1">Dirección:</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="font-medium block mb-1">Correo Electrónico:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                                required
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-4 w-full max-w-md mt-4">
                            <button 
                                type="button" 
                                onClick={() => navigate('/perfil')}
                                className="w-full sm:w-auto px-6 py-2 text-lg sm:text-xl rounded-md bg-gray-400 hover:bg-gray-500 text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            
                            <button
                                type="submit"
                                disabled={cargando}
                                className="w-full sm:w-auto px-6 py-2 text-lg sm:text-xl rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-colors disabled:bg-gray-400"
                            >
                                {cargando ? "Actualizando..." : "Actualizar Información"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FormularioActualizarUsuario; 