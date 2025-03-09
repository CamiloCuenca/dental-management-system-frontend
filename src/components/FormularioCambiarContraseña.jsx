import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import api from '../services/api'; // Axios configurado globalmente
import Swal from 'sweetalert2';

const FormularioCambiarContraseña = () => {
    const [codigo, setCodigo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate(); // Hook para la navegación

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleContrasenaChange = (e) => {
        const value = e.target.value;
        setContrasena(value);
    };

    const handleConfirmarContrasenaChange = (e) => {
        const value = e.target.value;
        setConfirmarContrasena(value);
    };

    const isFormValid = 
        validatePassword(contrasena) &&
        contrasena === confirmarContrasena &&
        codigo.trim() !== '';

        const handleSubmit = async (e) => {
            e.preventDefault();
            setCargando(true);
            setMensaje('');
            setError('');
        
            try {
                console.log("Formulario válido:", isFormValid);
        
                const response = await api.post("/cuenta/change-password", {
                    code: codigo,
                    newPassword: contrasena,
                    confirmationPassword: confirmarContrasena
                });
        
                console.log("Respuesta del servidor:", response.data);
        
                setMensaje(response.data);
        
                Swal.fire({
                    title: "Contraseña cambiada",
                    text: "Tu contraseña ha sido actualizada con éxito.",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    navigate('/login'); // Redirigir al login después de aceptar la alerta
                });
        
            } catch (err) {
                setError(err.response?.data || "Error interno del servidor");
                Swal.fire({
                    title: "Error",
                    text: err.response?.data || "Ocurrió un error al cambiar la contraseña.",
                    icon: "error",
                    confirmButtonText: "Intentar de nuevo"
                });
            } finally {
                setCargando(false);
            }
        };
        

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10
        bg-gradient-to-r from-[var(--color-primary)] from-10%
        via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">
            <div className="flex shadow-2xl w-full max-w-2xl">
                <div className="flex flex-col items-center justify-center text-center p-10 sm:p-16 gap-6 sm:gap-8 
                bg-white rounded-2xl xl:rounded-tr-2xl xl:rounded-br-2xl w-full">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary)]">
                        Cambiar contraseña
                        <hr className="border-t border-gray-600 my-4" />
                    </h1>

                    {mensaje && <p className="text-green-600 font-medium">{mensaje}</p>}
                    {error && <p className="text-red-600 font-medium">{error}</p>}

                    <form onSubmit={handleSubmit} className="flex flex-col text-lg gap-3 w-full max-w-md text-left">
                        <span className="font-medium">Código:</span>
                        <input 
                            type="text" 
                            className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                            placeholder='Ingrese el código que llegó a su correo' 
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                        />

                        <span className="font-medium">Contraseña nueva:</span>
                        <div className="relative w-full">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]" 
                                value={contrasena} 
                                onChange={handleContrasenaChange}
                                placeholder='Ingrese la nueva contraseña'
                            />
                            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                        {!validatePassword(contrasena) && contrasena.length > 0 && (
                            <span className="text-red-500 text-sm">
                                Debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
                            </span>
                        )}

                        <span className="font-medium">Confirmar contraseña:</span>
                        <div className="relative w-full">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]" 
                                value={confirmarContrasena} 
                                onChange={handleConfirmarContrasenaChange}
                                placeholder='Ingrese de nuevo la contraseña'
                            />
                            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                        {contrasena !== confirmarContrasena && confirmarContrasena.length > 0 && (
                            <span className="text-red-500 text-sm">Las contraseñas no coinciden.</span>
                        )}

                        <div className="flex flex-col sm:flex-row justify-end gap-4 w-full max-w-md mt-4">
                            <a href="/login" className="w-full sm:w-auto">
                                <button type="button" className="w-full sm:w-auto px-6 py-2 text-lg sm:text-2xl rounded-md 
                                bg-gray-400 hover:bg-gray-500 text-white">
                                    Cancelar
                                </button>
                            </a>
                            <button 
                                type="submit" 
                                disabled={!isFormValid || cargando} 
                                className={`w-full sm:w-auto px-6 py-2 text-lg sm:text-2xl rounded-md text-white ${isFormValid ? 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]' : 'bg-gray-400 cursor-not-allowed'}`}
                            >
                                {cargando ? "Procesando..." : "Confirmar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FormularioCambiarContraseña;
