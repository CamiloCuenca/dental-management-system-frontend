import { useState, useEffect } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import api from '../services/api';
import TokenService from '../services/tokenService';
import Swal from 'sweetalert2';

// Constantes para validación
const PASSWORD_REQUIREMENTS = {
  regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  message: "Debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
};

/**
 * Componente reutilizable para inputs de contraseña
 */
const PasswordInput = ({ 
  label, 
  name,
  value, 
  onChange, 
  showPassword, 
  toggleShowPassword,
  error,
  placeholder 
}) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-[var(--color-secondary)] mb-2 tracking-wide">{label}</label>
    <div className="relative group">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        className="w-full px-4 py-3 rounded-lg border-2 border-[var(--color-gray-light)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-all duration-300 ease-in-out shadow-sm"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button 
        type="button" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-[var(--color-primary)] transition-colors duration-300"
        onClick={toggleShowPassword}
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
      </button>
    </div>
    {error && <span className="text-red-500 text-sm mt-2 block">{error}</span>}
  </div>
);

/**
 * Componente principal para cambiar contraseña
 */
const FormularioCambiarContraseñaActual = () => {
    // Estados
    const [formData, setFormData] = useState({
      contraseñaActual: '',
      nuevaContraseña: '',
      confirmarContraseña: ''
    });
    
    const [visibility, setVisibility] = useState({
      showContraseñaActual: false,
      showNuevaContraseña: false,
      showConfirmarContraseña: false
    });
    
    const [cargando, setCargando] = useState(false);
    const [accountId, setAccountId] = useState(null);
    const navigate = useNavigate();

    // Obtener ID de cuenta desde el token
    useEffect(() => {
        const id = TokenService.getAccountId();
        if (!id) {
            navigate('/login');
            return;
        }
        setAccountId(id);
    }, [navigate]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleVisibility = (field) => {
        setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // Validaciones
    const validatePassword = (password) => PASSWORD_REQUIREMENTS.regex.test(password);

    const isFormValid = () => {
      return (
        formData.contraseñaActual.trim() !== '' &&
        validatePassword(formData.nuevaContraseña) &&
        formData.nuevaContraseña === formData.confirmarContraseña
      );
    };

    // Submit handler con debounce
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isFormValid() || cargando) return;
        
        setCargando(true);

        try {
            if (!accountId) throw new Error("No se encontró el ID de la cuenta");

            await api.put(`/cuenta/update-password/${accountId}`, {
                currentPassword: formData.contraseñaActual,
                newPassword: formData.nuevaContraseña,
                confirmationPassword: formData.confirmarContraseña
            });

            await Swal.fire({
                title: "¡Éxito!",
                text: "Tu contraseña ha sido actualizada correctamente. Serás redirigido para iniciar sesión nuevamente.",
                icon: "success",
                confirmButtonText: "Entendido"
            });

            TokenService.clearToken();
            navigate('/login');

        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            
            let mensajeError = "Error al cambiar la contraseña.";
            
            if (error.response?.status === 400) {
                mensajeError = error.response.data?.message || "La contraseña actual es incorrecta o las contraseñas no coinciden.";
            } else if (error.response?.status === 404) {
                mensajeError = "Cuenta no encontrada.";
            } else if (error.message.includes("ID de la cuenta")) {
                mensajeError = "Error de autenticación. Por favor, inicie sesión nuevamente.";
            }

            await Swal.fire({
                title: "Error",
                text: mensajeError,
                icon: "error",
                confirmButtonText: "Intentar de nuevo"
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--color-secondary)] mb-2">
                            Cambiar Contraseña
                        </h1>
                        <p className="text-gray-600">Actualiza tus credenciales de forma segura</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <PasswordInput
                            label="Contraseña actual"
                            name="contraseñaActual"
                            value={formData.contraseñaActual}
                            onChange={handleChange}
                            showPassword={visibility.showContraseñaActual}
                            toggleShowPassword={() => toggleVisibility('showContraseñaActual')}
                            placeholder="Ingrese su contraseña actual"
                        />

                        <PasswordInput
                            label="Nueva contraseña"
                            name="nuevaContraseña"
                            value={formData.nuevaContraseña}
                            onChange={handleChange}
                            showPassword={visibility.showNuevaContraseña}
                            toggleShowPassword={() => toggleVisibility('showNuevaContraseña')}
                            placeholder="Ingrese la nueva contraseña"
                            error={
                              formData.nuevaContraseña && !validatePassword(formData.nuevaContraseña) 
                                ? PASSWORD_REQUIREMENTS.message 
                                : null
                            }
                        />

                        <PasswordInput
                            label="Confirmar nueva contraseña"
                            name="confirmarContraseña"
                            value={formData.confirmarContraseña}
                            onChange={handleChange}
                            showPassword={visibility.showConfirmarContraseña}
                            toggleShowPassword={() => toggleVisibility('showConfirmarContraseña')}
                            placeholder="Ingrese de nuevo la nueva contraseña"
                            error={
                              formData.confirmarContraseña && formData.nuevaContraseña !== formData.confirmarContraseña 
                                ? "Las contraseñas no coinciden." 
                                : null
                            }
                        />

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
                                disabled={!isFormValid() || cargando}
                                className={`px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow-md ${
                                  isFormValid() 
                                    ? 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]' 
                                    : 'bg-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {cargando ? "Procesando..." : "Cambiar contraseña"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FormularioCambiarContraseñaActual;