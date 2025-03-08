import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const FormularioCambiarContraseña = () => {
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorContrasena, setErrorContrasena] = useState('');
    const [errorConfirmarContrasena, setErrorConfirmarContrasena] = useState('');

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleContrasenaChange = (e) => {
        const value = e.target.value;
        setContrasena(value);
        setErrorContrasena(validatePassword(value) ? '' : 'Debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un \nnúmero y un carácter especial');
    };

    const handleConfirmarContrasenaChange = (e) => {
        const value = e.target.value;
        setConfirmarContrasena(value);
        setErrorConfirmarContrasena(value === contrasena ? '' : 'Las contraseñas no coinciden');
    };

    const isFormValid = !errorContrasena && !errorConfirmarContrasena && contrasena && confirmarContrasena;

    return (
        <section className="min-h-screen flex items-center justify-center
        bg-gradient-to-r from-[var(--color-primary)] from-10%
        via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">

            <div className="flex shadow-2xl">
                <div className="flex flex-col items-center justify-center text-center p-20 gap-8 
                bg-white rounded-2xl xl:rounded-tr-2xl xl:rounded-br-2xl">

                    <h1 className="text-5xl font-bold text-[var(--color-secondary)]">
                        Cambiar contraseña
                        <hr className="border-t border-gray-600 my-4" />
                    </h1>

                    <div className="flex flex-col text-2xl gap-1 w-full text-left">
                        <span>Código: </span>
                        <input type="text" className="text-base w-full rounded-md p-2 border-2 
                        outline-none focus:border-[var(--color-secondary)] 
                        focus:bg-[var(--color-gray-light)]"
                        placeholder='Ingrese el código que llegó a su correo'/>

                        <span className="text-lg">Contraseña nueva:</span>
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
                        {errorContrasena && <span className="text-red-500 text-sm whitespace-pre-line">{errorContrasena}</span>}

                        <span className="text-lg">Confirmar contraseña:</span>
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
                        {errorConfirmarContrasena && <span className="text-red-500 text-sm">{errorConfirmarContrasena}</span>}
                    </div>

                    <div className="flex justify-end gap-4 w-full">
                        <a href="/login">
                            <button className="px-6 py-2 text-2xl rounded-md 
                            bg-gray-400 hover:bg-gray-500 text-white">
                                Cancelar
                            </button>
                        </a>
                        <button disabled={!isFormValid} className={`px-6 py-2 text-2xl rounded-md text-white ${isFormValid ? 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]' : 'bg-gray-400 cursor-not-allowed'}`}>
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FormularioCambiarContraseña;
