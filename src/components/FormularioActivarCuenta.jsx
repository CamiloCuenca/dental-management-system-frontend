import { FaArrowLeft } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../services/api'; // Importamos la instancia de Axios configurada globalmente
import Swal from 'sweetalert2'; // Librería para mostrar alertas bonitas

const FormularioActivarCuenta = () => {
    // Estados para manejar el código y el email ingresados por el usuario
    const [codigo, setCodigo] = useState('');
    const [email, setEmail] = useState('');

    // Estado para habilitar o deshabilitar el botón de envío
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    // Estado para manejar el mensaje de error en el email
    const [emailError, setEmailError] = useState('');

    // Función para validar que el email tenga un formato correcto
    const isEmailValid = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    // Función que maneja los cambios en los campos de entrada
    const handleUsuarioChange = (e) => {
        const { name, value } = e.target;

        if (name === 'codigo') {
            setCodigo(value);
        } else if (name === 'email') {
            setEmail(value);
            // Validamos el correo y mostramos un mensaje de error si es incorrecto
            if (!isEmailValid(value)) {
                setEmailError('Correo electrónico inválido.');
            } else {
                setEmailError('');
            }
        }
    };

    // Efecto que se ejecuta cuando cambian los valores de `codigo` o `email`
    useEffect(() => {
        setIsButtonEnabled(codigo.trim() !== '' && isEmailValid(email));
    }, [codigo, email]);

    // Función que maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        try {
            // Construimos el payload que se enviará al backend
            const payload = {
                code: codigo,  // Clave "code" debe coincidir con la esperada en el backend
                email: email   // Clave "email" debe coincidir con la esperada en el backend
            };

            console.log('Payload enviado al backend:', payload); // Para depuración

            // Realizamos la petición al backend para activar la cuenta
            const response = await api.post('/cuenta/activate', payload);

            // Si la activación es exitosa, mostramos un mensaje y redirigimos a login
            Swal.fire({
                icon: 'success',
                title: 'Cuenta activada',
                text: response.data,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = '/login';
            });

        } catch (error) {
            console.error('Error activando cuenta:', error);
            // Mostramos un mensaje de error si la activación falla
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data || 'Error al activar la cuenta',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Intentar de nuevo'
            });
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[var(--color-primary)] from-10% via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">
            <div className="flex shadow-2xl">
                <div className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl xl:rounded-tr-2xl xl:rounded-br-2xl relative">

                    {/* Botón de volver */}
                    <a href="/#">
                        <button className="absolute top-5 left-5 flex items-center gap-2 text-[var(--color-secondary)] hover:underline text-lg">
                            <FaArrowLeft /> Volver
                        </button>
                    </a>

                    {/* Título */}
                    <h1 className="text-5xl font-bold text-[var(--color-secondary)]">Activar cuenta</h1>

                    {/* Formulario de activación */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">

                        {/* Campo para el código de activación */}
                        <div className="flex flex-col text-left gap-1 w-full">
                            <span className="text-lg">Código:</span>
                            <input
                                type="text"
                                name="codigo"
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                                value={codigo}
                                onChange={handleUsuarioChange}
                                placeholder="Ingrese el código que llegó al correo"
                                required
                            />
                        </div>

                        {/* Campo para el correo electrónico */}
                        <div className="flex flex-col text-left gap-1 w-full">
                            <span className="text-lg">Correo electrónico:</span>
                            <input
                                type="email"
                                name="email"
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                                value={email}
                                onChange={handleUsuarioChange}
                                placeholder="Ingrese el correo electrónico"
                                required
                            />
                            {/* Mostrar mensaje de error si el email es inválido */}
                            {emailError && <span className="text-red-500 text-sm mt-1">{emailError}</span>}
                        </div>

                        {/* Botón de activación de cuenta */}
                        <button
                            type="submit"
                            className={`px-10 py-2 text-2xl rounded-md text-white ${isButtonEnabled ? 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]' : 'bg-gray-400 cursor-not-allowed'}`}
                            disabled={!isButtonEnabled}
                        >
                            Activar cuenta
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FormularioActivarCuenta;
