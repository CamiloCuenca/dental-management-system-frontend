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
    const [errors, setErrors] = useState({});
    const [cargando, setCargando] = useState(false);
    const [accountId, setAccountId] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [initialData, setInitialData] = useState({});

    useEffect(() => {
        if (!TokenService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        const id = TokenService.getAccountId();
        if (!id) {
            navigate('/login');
            return;
        }
        setAccountId(id);

        const obtenerDatosUsuario = async () => {
            try {
                const response = await api.get(`/cuenta/perfil/${id}`);
                const perfilData = response.data;
                const initialValues = {
                    name: perfilData.name || "",
                    lastName: perfilData.lastName || "",
                    phoneNumber: perfilData.phoneNumber || "",
                    address: perfilData.address || "",
                    email: perfilData.email || ""
                };
                setFormData(initialValues);
                setInitialData(initialValues);
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

    const validateField = (name, value) => {
        let error = "";

        if (name === "name" || name === "lastName") {
            const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s']+$/;
            if (!value.trim()) {
                error = "Este campo es requerido";
            } else if (!nameRegex.test(value)) {
                error = "Solo se permiten letras y espacios";
            }
        }

        if (name === "phoneNumber") {
            const phoneRegex = /^[0-9]{10}$/;
            if (!value.trim()) {
                error = "Este campo es requerido";
            } else if (!phoneRegex.test(value)) {
                error = "Debe contener exactamente 10 dígitos";
            }
        }

        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value.trim()) {
                error = "Este campo es requerido";
            } else if (!emailRegex.test(value)) {
                error = "Correo electrónico inválido";
            }
        }

        if (name === "address" && !value.trim()) {
            error = "Este campo es requerido";
        }

        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Filtro especial para el campo de teléfono
        let processedValue = value;
        if (name === "phoneNumber") {
            processedValue = value.replace(/\D/g, '').slice(0, 10);
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
        
        validateField(name, processedValue);
    };

    useEffect(() => {
        // Verificar si hay cambios en los datos
        const hasChanges = Object.keys(formData).some(
            key => formData[key] !== initialData[key]
        );
        
        // Verificar si hay errores
        const hasErrors = Object.values(errors).some(error => error !== "");
        
        // Verificar si todos los campos requeridos están llenos
        const allFieldsFilled = Object.values(formData).every(
            field => field.trim() !== ""
        );
        
        setIsFormValid(hasChanges && !hasErrors && allFieldsFilled);
    }, [formData, errors, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setCargando(true);

        try {
            if (!isFormValid) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Formulario inválido',
                    text: 'Por favor complete todos los campos correctamente.'
                });
                return;
            }

            const response = await api.put(`/cuenta/usuario/${accountId}`, formData);

            if (response.data.token) {
                TokenService.setToken(response.data.token);
            }

            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: response.data.message || 'Información actualizada correctamente',
                timer: 2000,
                showConfirmButton: false
            });

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
                        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-2">
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
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--color-secondary)] tracking-wide">Apellidos</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-gray-light)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-all duration-300 ease-in-out shadow-sm"
                                />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--color-secondary)] tracking-wide">Número de Teléfono</label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-gray-light)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-all duration-300 ease-in-out shadow-sm"
                                    inputMode="numeric"
                                />
                                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[var(--color-secondary)] tracking-wide">Correo Electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-gray-light)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-all duration-300 ease-in-out shadow-sm"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                            />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
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
                                disabled={cargando || !isFormValid}
                                className={`px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow-md ${
                                    cargando || !isFormValid
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