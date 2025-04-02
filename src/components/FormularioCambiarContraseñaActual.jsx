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
  <div className="mb-4">
    <label className="font-medium block mb-1">{label}:</label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button 
        type="button" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
        onClick={toggleShowPassword}
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
      </button>
    </div>
    {error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
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
        <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-r from-[var(--color-primary)] from-10% via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">
            <div className="flex shadow-2xl w-full max-w-2xl">
                <div className="flex flex-col items-center justify-center text-center p-10 sm:p-16 gap-6 sm:gap-8 bg-white rounded-2xl xl:rounded-tr-2xl xl:rounded-br-2xl w-full">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary)]">
                        Cambiar contraseña
                        <hr className="border-t border-gray-600 my-4" />
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col text-lg gap-3 w-full max-w-md">
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
                                disabled={!isFormValid() || cargando}
                                className={`w-full sm:w-auto px-6 py-2 text-lg sm:text-xl rounded-md text-white transition-colors ${
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