import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import imagenLogin from '../assets/imagenLogin.png';
import { FaArrowLeft, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const FormularioLogin = () => {
    const [captchaValido, setCaptchaValido] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mensajeError, setMensajeError] = useState('');
    
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const onChangeCaptcha = (e) => {
        setCaptchaValido(!!e);
    };

    const handleUsuarioChange = (e) => {
        setUsuario(e.target.value);
    };

    const handleContrasenaChange = (e) => {
        setContrasena(e.target.value);
    };

    const isButtonEnabled = usuario.trim() !== '' && contrasena.trim() !== '' && captchaValido;

    const handleLogin = async () => {
        if (!isButtonEnabled) return;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario, contrasena })
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log('Login exitoso:', data);
                // Redirigir o manejar el login exitoso aquí
            } else {
                setMensajeError(data.message || 'Error en el inicio de sesión');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setMensajeError('Hubo un problema con el servidor');
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[var(--color-primary)] from-10% via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">
            <div className="flex shadow-2xl">
                <div className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl xl:rounded-tr-none xl:rounded-br-none relative">
                    <a href="/#">
                        <button  
                            className="absolute top-5 left-5 flex items-center gap-2 text-[var(--color-secondary)] hover:underline text-lg">
                            <FaArrowLeft /> Volver
                        </button>
                    </a>

                    <h1 className="text-5xl font-bold text-[var(--color-secondary)]">Bienvenido</h1>

                    <div className="flex flex-col text-left gap-1 w-full">
                        <span className="text-lg">Usuario:</span>
                        <input 
                            type="number" 
                            className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]" 
                            value={usuario} 
                            onChange={handleUsuarioChange}
                            placeholder='Ingrese el número de identificación'
                        />
                    </div>

                    <div className="flex flex-col text-left gap-1 w-full">
                        <span className="text-lg">Contraseña:</span>
                        <div className="relative w-full">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]" 
                                value={contrasena} 
                                onChange={handleContrasenaChange}
                                placeholder='Ingrese la contraseña'
                            />
                            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={togglePasswordVisibility}>
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                        <div className="flex gap-1 items-center">
                            <p className="font-semibold">
                                <a href="/recuperarContraseña" className="text-[var(--color-secondary)] hover:underline text-sm">Olvidé mi contraseña</a>
                            </p>
                        </div>
                    </div>

                    <ReCAPTCHA sitekey='6LewT-0qAAAAAPjdrCwXd3Ofu4ZT1565ziPLMeyz' onChange={onChangeCaptcha} />

                    {mensajeError && <p className="text-red-500 text-sm">{mensajeError}</p>}
                    
                    <button 
                        className={`px-10 py-2 text-2xl rounded-md text-white ${isButtonEnabled ? 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]' : 'bg-gray-400 cursor-not-allowed'}`} 
                        disabled={!isButtonEnabled}
                        onClick={handleLogin}
                    >
                        Ingresar
                    </button>

                    <p className="font-semibold">
                        ¿No tienes una cuenta? <a href="/registro" className="text-[var(--color-secondary)] hover:underline">Registrarse</a>
                    </p>
                </div>
                <img src={imagenLogin} alt="" className='w-[450px] object-cover xl:rounded-tr-2xl xl:rounded-br-2xl xl:block hidden'/>
            </div>
        </section>
    );
};

export default FormularioLogin;
