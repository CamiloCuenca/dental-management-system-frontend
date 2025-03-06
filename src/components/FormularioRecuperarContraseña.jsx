const FormularioRecuperarContraseña = () => {
    return (
        <section className="min-h-screen flex items-center justify-center font-mono
        bg-gradient-to-r from-[var(--color-primary)] from-10%
        via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">

            <div className="flex shadow-2xl">
                <div className="flex flex-col items-center justify-center text-center p-20 gap-8 
                bg-white rounded-2xl xl:rounded-tr-2xl xl:rounded-br-2xl">

                    <h1 className="text-5xl font-bold text-[var(--color-secondary)]">
                        Recuperar contraseña
                    </h1>

                    <div className="flex flex-col text-2xl gap-1 w-full">
                        <hr className="border-t border-gray-600 my-4" />

                        <p className="text-base self-start whitespace-pre-line">
                            Introduzca su correo electrónico para recuperar la contraseña.
                        </p>
                        <br />

                        <div className="flex justify-center w-full">
                            <input type="text" className="w-100 rounded-md p-2 border-2 
                            outline-none focus:border-[var(--color-secondary)] 
                            focus:bg-[var(--color-gray-light)]"/>
                        </div>


                        <hr className="border-t border-gray-600 my-4" />
                    </div>

                    {/* Sección de botones alineados a la derecha */}
                    <div className="flex justify-end gap-4 w-full">
                    <a href="/login">
                        <button className="px-6 py-2 text-2xl rounded-md 
                        bg-gray-400 hover:bg-gray-500 text-white">
                            Cancelar
                        </button>
                    </a>

                    <a href="/cambiarContraseña">
                        <button className="px-6 py-2 text-2xl rounded-md 
                        bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] 
                        text-white">
                            Recuperar
                        </button>
                    </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FormularioRecuperarContraseña;
