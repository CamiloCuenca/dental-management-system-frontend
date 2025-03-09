import { useState } from "react";
import Swal from "sweetalert2"; // Importar SweetAlert2
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import api from "../services/api"; // Cliente Axios configurado

const FormularioRecuperarContraseña = () => {
    const [correo, setCorreo] = useState(""); // Estado para almacenar el correo electrónico
    const [error, setError] = useState(""); // Estado para almacenar errores de validación
    const [loading, setLoading] = useState(false); // Estado para manejar la carga de la solicitud
    const navigate = useNavigate(); // Hook para redirigir a otra página

    // Función para manejar cambios en el input de correo
    const handleChange = (e) => {
        const value = e.target.value;
        setCorreo(value);
        validateField(value); // Validar el correo en tiempo real
    };

    // Función para validar el formato del correo electrónico
    const validateField = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setError(emailRegex.test(value) ? "" : "Correo electrónico inválido");
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar si hay errores o el campo está vacío
        if (error || !correo) {
            Swal.fire("⚠️ Error", "Ingresa un correo válido.", "error");
            return;
        }

        setLoading(true); // Activar el estado de carga

        try {
            // Enviar solicitud a la API para recuperar la contraseña
            await api.post("/cuenta/send-recovery-code", null, { params: { email: correo } });

            // Mostrar alerta de éxito
            Swal.fire({
                icon: "success",
                title: "Código enviado",
                text: "Revisa tu correo para continuar con la recuperación.",
                confirmButtonText: "Aceptar",
            }).then(() => {
                navigate("/cambiarContraseña"); // Redirigir después de aceptar
            });

        } catch (error) {
            Swal.fire("❌ Error", "No se pudo enviar el código. Inténtalo de nuevo.", "error");
        } finally {
            setLoading(false); // Desactivar el estado de carga
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]">
            <div className="flex shadow-2xl w-full max-w-2xl">
                <div className="flex flex-col items-center justify-center text-center p-10 sm:p-16 gap-6 sm:gap-8 bg-white rounded-2xl w-full">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary)]">Recuperar contraseña</h1>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="flex flex-col text-lg gap-3 w-full max-w-md text-left">
                        <hr className="border-t border-gray-600 my-4" />
                        <p className="text-base">Introduzca su correo electrónico para recuperar la contraseña.</p>

                        {/* Campo de entrada para el correo */}
                        <div className="flex justify-center w-full">
                            <input
                                type="email"
                                value={correo}
                                onChange={handleChange}
                                className={`text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)] ${error ? 'border-red-500' : ''}`}
                                placeholder="Ingrese su correo electrónico"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                        <hr className="border-t border-gray-600 my-4" />

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 w-full max-w-md">
                            <a href="/login" className="w-full sm:w-auto">
                                <button type="button" className="w-full sm:w-auto px-6 py-2 text-lg sm:text-2xl rounded-md bg-gray-400 hover:bg-gray-500 text-white">
                                    Cancelar
                                </button>
                            </a>
                            <button
                                type="submit"
                                className={`w-full sm:w-auto px-6 py-2 text-lg sm:text-2xl rounded-md text-white ${loading || error || !correo ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]'}`}
                                disabled={loading || error || !correo}
                            >
                                {loading ? "Enviando..." : "Recuperar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FormularioRecuperarContraseña;
