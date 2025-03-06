const FormularioCambiarContraseña = () => {
    return (
        <section className="min-h-screen flex items-center justify-center font-mono
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
                    
                        <div className="flex w-full">
                            <input type="text" className="w-100 rounded-md p-2 border-2 
                            outline-none focus:border-[var(--color-secondary)] 
                            focus:bg-[var(--color-gray-light)]"/>
                        </div>
                        <br />

                        <span>Contraseña nueva: </span>
                        <div className="flex w-full">
                            <input type="password" className="w-100 rounded-md p-2 border-2 
                            outline-none focus:border-[var(--color-secondary)] 
                            focus:bg-[var(--color-gray-light)]"/>
                        </div>
                        <br />

                        <span>Confirmar contraseña: </span>
                        <div className="flex w-full">
                            <input type="password" className="w-100 rounded-md p-2 border-2 
                            outline-none focus:border-[var(--color-secondary)] 
                            focus:bg-[var(--color-gray-light)]"/>
                        </div>
                    </div>

                    {/* Sección de botones alineados a la derecha */}
                    <div className="flex justify-end gap-4 w-full">
                    <a href="/login">
                        <button className="px-6 py-2 text-2xl rounded-md 
                        bg-gray-400 hover:bg-gray-500 text-white">
                            Cancelar
                        </button>
                    </a>

                    <a href="/login">
                        <button className="px-6 py-2 text-2xl rounded-md 
                        bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] 
                        text-white">
                            Confirmar
                        </button>
                    </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FormularioCambiarContraseña;
