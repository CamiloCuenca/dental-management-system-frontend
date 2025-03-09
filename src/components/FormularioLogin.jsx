import { useState } from 'react';
import imagenLogin from '../assets/imagenLogin.png';
import api from "../services/api"; // Cliente Axios configurado


const FormularioLogin = () => {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');

    const login = async () => {
        try {
            console.log("Usuario:", usuario);
            console.log("Contraseña:", contraseña);
            const response = await api.post("/cuenta/login", {
                idNumber: usuario,
                password: contraseña
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            

            // Handle successful login, e.g., store token, redirect, etc.
            console.log(response.data);
        } catch (error) {
            // Handle error, e.g., show error message
            console.error(error);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center font-mono bg-gradient-to-r from-[var(--color-primary)] from-10% via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">
            <div className="flex shadow-2xl">
                <div className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white rounded-2xl xl:rounded-tr-none xl:rounded-br-none">
                    <h1 className="text-5xl font-bold text-[var(--color-secondary)]">Bienvenido</h1>
                    <div className="flex flex-col text-2xl text-left gap-1">
                        <span>Usuario: </span>
                        <input
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="rounded-md p-1 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                        />
                    </div>
                    <div className="flex flex-col text-2xl text-left gap-1">
                        <span>Contraseña:</span>
                        <input
                            type="password"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            className="rounded-md p-1 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                        />
                        <div className="flex gap-1 items-center">
                            <p className="font-semibold">
                                <a href="/recuperarContraseña" className="text-[var(--color-secondary)] hover:underline text-sm">
                                    Olvidé mi contraseña
                                </a>
                            </p>
                        </div>
                    </div>
                    <button onClick={login} className="px-10 py-2 text-2xl rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white">
                        Ingresar
                    </button>
                    <p className="font-semibold">
                        ¿No tienes una cuenta? <a href="/registro" className="text-[var(--color-secondary)] hover:underline">Registrarse</a>
                    </p>
                </div>
                <img src={imagenLogin} alt="" className="w-[450px] object-cover xl:rounded-tr-2xl xl:rounded-br-2xl xl:block hidden" />
            </div>
        </section>
    );
};

export default FormularioLogin;
