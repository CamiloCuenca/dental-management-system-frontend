import { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FaArrowLeft, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const FormularioRegistro = () => {
    const [formData, setFormData] = useState({
        identificacion: '',
        primerNombre: '',
        primerApellido: '',
        direccion: '',
        fechaNacimiento: '',
        telefono: '',
        correo: '',
        contraseña: '',
        confirmarContraseña: ''
    });
    const [captchaValido, setCaptchaValido] = useState(false);
    const [formValido, setFormValido] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({ correo: '', contraseña: '', confirmarContraseña: '' });

    useEffect(() => {
        validateForm();
    }, [formData, captchaValido]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let error = '';

        if (name === 'correo') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            error = emailRegex.test(value) ? '' : 'Correo electrónico inválido';
        }

        if (name === 'contraseña') {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            error = passwordRegex.test(value)
                ? ''
                : 'Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
        }

        if (name === 'confirmarContraseña') {
            error = value !== formData.contraseña ? 'Las contraseñas no coinciden' : '';
        }

        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    const validateForm = () => {
        const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '');
        const noErrors = Object.values(errors).every(error => error === '');
        setFormValido(allFieldsFilled && noErrors && captchaValido);
    };

    const onChangeCaptcha = (value) => {
        setCaptchaValido(!!value);
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[var(--color-primary)] from-10% via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100% p-10">
            <div className="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-5xl relative">
                <button 
                    onClick={() => window.history.back()} 
                    className="absolute top-5 left-5 flex items-center gap-2 text-[var(--color-secondary)] hover:underline text-lg"
                >
                    <FaArrowLeft /> Volver
                </button>

                <h1 className="text-4xl font-bold text-center mb-2.5 text-[var(--color-secondary)]">Crear una cuenta</h1>
                <h4 className="text-xl font-bold text-center mb-2.5 text-[var(--color-secondary)]">Es rápido y sencillo</h4>
                <hr className="border-t border-gray-600 my-4" />

                <div className="grid grid-cols-3 grid-rows-3 gap-5">
                    {[
                        { label: "Número de identificación*:", type: "number", name: "identificacion", placeholder: "Ingrese su número de identificación"},
                        { label: "Nombres*:", type: "text", name: "nombres", placeholder: "Ingrese sus nombres" },
                        { label: "Apellidos*:", type: "text", name: "apellidos", placeholder: "Ingrese sus apellidos" },
                        { label: "Dirección*:", type: "text", name: "direccion", className: "col-span-2", placeholder: "Ingrese su número dirección" },
                        { label: "Fecha de nacimiento*:", type: "date", name: "fechaNacimiento" },
                        { label: "Número telefónico*:", type: "number", name: "telefono", placeholder: "Ingrese su número telefónico" },
                        { label: "Correo electrónico*:", type: "email", name: "correo", className: "col-span-2", error: errors.correo, placeholder: "Ingrese su correo electrónico" }
                    ].map(({ label, type, name, className, placeholder, error }, index) => (
                        <div key={index} className={`flex flex-col ${className || ''}`}>
                            <span className="text-lg text-left">{label}</span>
                            <input 
                                type={type} 
                                name={name} 
                                value={formData[name]} 
                                placeholder={placeholder}
                                onChange={handleChange} 
                                className={`rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)] ${error ? 'border-red-500' : ''}`} 
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-5 mt-5">
                    {[
                        { label: "Contraseña*:", name: "contraseña", show: showPassword, setShow: setShowPassword, error: errors.contraseña, placeholder: "Ingrese la contraseña" },
                        { label: "Confirmar contraseña*:", name: "confirmarContraseña", show: showConfirmPassword, setShow: setShowConfirmPassword, error: errors.confirmarContraseña, placeholder: "Ingrese de nuevo la contraseña" }
                    ].map(({ label, name, show, setShow, error, placeholder }, index) => (
                        <div key={index} className="flex flex-col relative">
                            <span className="text-lg text-left">{label}</span>
                            <div className="relative">
                                <input 
                                    type={show ? "text" : "password"} 
                                    name={name} 
                                    placeholder={placeholder}
                                    value={formData[name]} 
                                    onChange={handleChange} 
                                    className={`w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)] pr-10 ${error ? 'border-red-500' : ''}`} 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShow(!show)} 
                                    className="absolute inset-y-0 right-2 flex items-center"
                                >
                                    {show ? <FaRegEyeSlash /> : <FaRegEye />}
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </div>
                    ))}
                </div>

                <div className='flex items-center justify-center mt-5'>
                    <ReCAPTCHA sitekey='6LewT-0qAAAAAPjdrCwXd3Ofu4ZT1565ziPLMeyz' onChange={onChangeCaptcha} />
                    {/* Se debe comentar cuando se despliegue */}
                    {/* <ReCAPTCHA sitekey='6LfZTu0qAAAAAO-EpbIWUAaX0L1KY31D5IOuuZhs' onChange={onChange}/> */} 
                    {/* Este se usa cuando esté desplegado, se debe descomentar */}
                </div>

                <div className="flex flex-col items-center mt-5">
                    <button 
                        disabled={!formValido} 
                        className={`px-5 py-2 text-2xl rounded-md text-white ${formValido ? 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        Registrarse
                    </button>
                    <p className="font-semibold mt-4">
                        ¿Ya tienes una cuenta? 
                        <a href="/login" className="text-[var(--color-secondary)] hover:underline"> Iniciar sesión</a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FormularioRegistro;