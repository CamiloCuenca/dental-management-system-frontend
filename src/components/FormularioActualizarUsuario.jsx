// Importación de dependencias necesarias
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TokenService from '../services/tokenService';
import Swal from 'sweetalert2';

const FormularioActualizarUsuario = () => {
    // Hook para navegación
    const navigate = useNavigate();

    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        email: ""
    });

    // Estado para manejar el estado de carga
    const [cargando, setCargando] = useState(false);
    // Estado para almacenar el ID de la cuenta
    const [accountId, setAccountId] = useState(null);

    // Effect para cargar datos iniciales y verificar autenticación
    useEffect(() => {
        // Verificar si el usuario está autenticado
        if (!TokenService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        // Obtener y verificar el ID de la cuenta
        const id = TokenService.getAccountId();
        if (!id) {
            navigate('/login');
            return;
        }
        setAccountId(id);

        // Función para obtener los datos del usuario
        const obtenerDatosUsuario = async () => {
            try {
                // Realizar petición GET al backend
                const response = await api.get(`/cuenta/perfil/${id}`);
                const perfilData = response.data;
                
                // Actualizar el estado con los datos obtenidos
                setFormData({
                    name: perfilData.name || "",
                    lastName: perfilData.lastName || "",
                    phoneNumber: perfilData.phoneNumber || "",
                    address: perfilData.address || "",
                    email: perfilData.email || ""
                });
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
                // Mostrar alerta de error
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los datos del usuario',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        };

        // Ejecutar la función de obtención de datos
        obtenerDatosUsuario();
    }, [navigate]);

    // Manejador de cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejador del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            // Validar que haya campos modificados
            if (!isFormValid()) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Campos vacíos',
                    text: 'Debe modificar al menos un campo para actualizar su información.'
                });
                return;
            }

            // Validar formato del teléfono (10 dígitos)
            if (formData.phoneNumber && !formData.phoneNumber.match(/^\d{10}$/)) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El número de teléfono debe contener exactamente 10 dígitos.'
                });
                return;
            }

            // Validar formato del email
            if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor, ingrese un email válido.'
                });
                return;
            }

            // Enviar datos actualizados al backend
            const response = await api.put(`/cuenta/usuario/${accountId}`, formData);

            // Actualizar token si es necesario
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
            // Mostrar mensaje de error
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar la información del usuario'
            });
        } finally {
            setCargando(false);
        }
    };

    // Función para validar que al menos un campo tenga valor
    const isFormValid = () => {
        return Object.values(formData).some(value => value !== "");
    };

    // Si no hay ID de cuenta, no renderizar nada
    if (!accountId) return null;

    // Renderizado del componente
    return (
        // Contenedor principal con gradiente de fondo
        <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-r from-[var(--color-primary)] from-10% via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">
            {/* Contenedor del formulario */}
            <div className="flex shadow-2xl w-full max-w-2xl">
                <div className="flex flex-col items-center justify-center text-center p-10 sm:p-16 gap-6 sm:gap-8 bg-white rounded-2xl xl:rounded-tr-2xl xl:rounded-br-2xl w-full">
                    {/* Título del formulario */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary)]">
                        Actualizar Información
                        <hr className="border-t border-gray-600 my-4" />
                    </h1>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="flex flex-col text-lg gap-3 w-full max-w-md">
                        {/* Campos del formulario */}
                        {/* ... (campos de entrada para name, lastName, phoneNumber, address, email) ... */}

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 w-full max-w-md mt-4">
                            {/* Botón Cancelar */}
                            <button 
                                type="button" 
                                onClick={() => navigate('/perfil')}
                                className="w-full sm:w-auto px-6 py-2 text-lg sm:text-xl rounded-md bg-gray-400 hover:bg-gray-500 text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            
                            {/* Botón Actualizar */}
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