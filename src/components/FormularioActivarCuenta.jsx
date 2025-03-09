import { FaArrowLeft } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const FormularioActivarCuenta = () => {
    const [codigo, setCodigo] = useState('');
    const [email, setEmail] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState(false); // Estado para habilitar/deshabilitar el botón
    const [emailError, setEmailError] = useState(''); // Estado para el mensaje de error del email

    // Validación de correo electrónico
    const isEmailValid = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    // Función que maneja los cambios en los campos de código y email
    const handleUsuarioChange = (e) => {
        const { name, value } = e.target;

        if (name === 'codigo') {
            setCodigo(value);
        } else if (name === 'email') {
            setEmail(value);

            // Si el correo no es válido, mostrar el mensaje de error
            if (!isEmailValid(value)) {
                setEmailError('Correo electrónico inválido.');
            } else {
                setEmailError(''); // Limpiar el mensaje de error cuando el correo sea válido
            }
        }
    };

    // Efecto para habilitar/deshabilitar el botón cuando los valores cambian
    useEffect(() => {
        // Verifica que el código no esté vacío y que el correo electrónico sea válido
        setIsButtonEnabled(codigo.trim() !== '' && isEmailValid(email));
    }, [codigo, email]); // Se vuelve a evaluar cada vez que 'codigo' o 'email' cambian

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[var(--color-primary)] from-10% via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">
            <div className="flex shadow-2xl">
                <div className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl xl:rounded-tr-2xl xl:rounded-br-2xl relative">
                    {/* Botón de regresar dentro del formulario */}
                    <a href="/#">
                        <button
                            className="absolute top-5 left-5 flex items-center gap-2 text-[var(--color-secondary)] hover:underline text-lg">
                            <FaArrowLeft /> Volver
                        </button>
                    </a>

                    <h1 className="text-5xl font-bold text-[var(--color-secondary)]">Activar cuenta</h1>

                    <div className="flex flex-col text-left gap-1 w-full">
                        <span className="text-lg">Código:</span>
                        <input
                            type="text"
                            name="codigo"
                            className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                            value={codigo}
                            onChange={handleUsuarioChange}
                            placeholder='Ingrese el código que llegó al correo'
                        />
                    </div>

                    <div className="flex flex-col text-left gap-1 w-full">
                        <span className="text-lg">Correo electrónico:</span>
                        <input
                            type="email"
                            name="email"
                            className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                            value={email}
                            onChange={handleUsuarioChange}
                            placeholder='Ingrese el correo electrónico'
                        />
                        {/* Mostrar el mensaje de error si el correo no es válido */}
                        {emailError && <span className="text-red-500 text-sm mt-1">{emailError}</span>}
                    </div>
                    <a href="/login">
                    <button
                        className={`px-10 py-2 text-2xl rounded-md text-white ${isButtonEnabled ? 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!isButtonEnabled}>
                        Ingresar
                    </button>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FormularioActivarCuenta;
