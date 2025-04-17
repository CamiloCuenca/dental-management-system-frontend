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
        setCargando(true);

        try {
            // Validar que al menos un campo haya sido modificado
            if (!isFormValid()) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Campos vacíos',
                    text: 'Debe modificar al menos un campo para actualizar su información.'
                });
                return;
            }

            // Validar formato de teléfono si se está actualizando
            if (formData.phoneNumber && !formData.phoneNumber.match(/^\d{10}$/)) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El número de teléfono debe contener exactamente 10 dígitos.'
                });
                return;
            }

            // Validar formato de email si se está actualizando
            if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, ingrese un email válido.'
                });
                return;
            }

            const response = await api.put(`/cuenta/usuario/${accountId}`, formData);

            // Actualizar el token con la nueva información
            if (response.data.token) {
                TokenService.setToken(response.data.token);
            }

            // Mostrar mensaje de éxito
            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: response.data.message || 'Información actualizada correctamente',
                timer: 2000,
                showConfirmButton: false
            });

            // Redirigir al perfil
            navigate('/perfil');
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar la información del usuario'
            });
        } finally {
            setCargando(false);
        }
    };

    const isFormValid = () => {
        return Object.values(formData).some(value => value !== "");
    };

    if (!accountId) return null;

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-50 via-blue-50/80 to-blue-50">
            <div className="w-full max-w-2xl">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-12 transform transition-all duration-300 hover:shadow-2xl border border-pink-100">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-pink-100">
                            <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--color-secondary)] mb-2">
                            Actualizar Información
                        </h1>
                        <p className="text-gray-600">Actualiza tus datos personales</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--color-secondary)] tracking-wide">Nombres</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-gray-light)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-all duration-300 ease-in-out shadow-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--color-secondary)] tracking-wide">Apellidos</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-gray-light)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-all duration-300 ease-in-out shadow-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--color-secondary)] tracking-wide">Número de Teléfono</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-gray-light)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-all duration-300 ease-in-out shadow-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--color-secondary)] tracking-wide">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-gray-light)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-all duration-300 ease-in-out shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[var(--color-secondary)] tracking-wide">Dirección</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-gray-light)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-all duration-300 ease-in-out shadow-sm"
                                required
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                            <button 
                                type="button" 
                                onClick={() => navigate('/perfil')}
                                className="px-6 py-3 text-white bg-gray-400 hover:bg-gray-500 rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                            >
                                Cancelar
                            </button>
                            
                            <button
                                type="submit"
                                disabled={cargando}
                                className={`px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow-md ${
                                    cargando 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-[var(--color-secondary)] hover:bg-[var(--color-primary)]'
                                }`}
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