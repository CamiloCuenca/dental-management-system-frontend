const FormularioRegistro = () => {
    return (
        <section className="min-h-screen flex items-center justify-center font-mono
        bg-gradient-to-r from-[var(--color-primary)] from-10%
        via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100% p-10">

            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-5xl">
                <h1 className="text-4xl font-bold text-center mb-8 text-[var(--color-secondary)]">Crear una cuenta</h1>
                <h4 className="text-xl font-bold text-center mb-8 text-[var(--color-secondary)]">Es rápido y sencillo</h4>
                <hr className="border-t border-gray-600 my-4" />
                <br></br>


                <div className="grid grid-cols-3 grid-rows-3 gap-5">
                    <div className="flex flex-col">
                        <span className="text-lg text-left">Número de identificación*:</span>
                        <input type="number" name="identificacion" className="rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"/>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-lg text-left">Nombres*:</span>
                        <input type="text" name="primerNombre" className="rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"/>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-lg text-left">Apellidos*:</span>
                        <input type="text" name="primerApellido" className="rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"/>
                    </div>

                    <div className="flex flex-col col-span-2">
                        <span className="text-lg text-left">Dirección*:</span>
                        <input type="text" name="direccion" className="rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"/>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-lg text-left">Fecha de nacimiento*:</span>
                        <input type="date" name="fechaNacimiento" className="rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"/>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-lg text-left">Número telefónico*:</span>
                        <input type="number" name="telefono" className="rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"/>
                    </div>

                    <div className="flex flex-col col-span-2">
                        <span className="text-lg text-left">Correo electrónico*:</span>
                        <input type="email" name="correo" className="rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"/>
                    </div>
                
                </div>

                <div className="grid grid-cols-2 gap-5 mt-5">
                    
                    <div className="flex flex-col">
                        <span className="text-lg text-left">Contraseña*:</span>
                        <input type="password" name="contraseña" className="rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"/>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-lg text-left">Confirmar contraseña*:</span>
                        <input type="password" name="confirmarContraseña" className="rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"/>
                    </div>
                </div>

                <div className="flex flex-col items-center mt-8">
                    <button className="px-5 py-2 text-2xl rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)]">
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
