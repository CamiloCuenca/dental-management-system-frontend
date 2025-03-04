import imagenLogin from '../assets/imagenLogin.png'

const FormularioLogin = () => {
    return (
        <section className="min-h-screen flex
        items-center justify-center font-mono
        bg-gradient-to-r from-[var(--color-primary)] from-10%
        via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">

            <div className="flex shadow-2xl">
                <div className="flex flex-col items-center
                justify-center text-center p-20 gap-8 
                bg-white rounded-2xl
                
                xl:rounded-tr-none xl:rounded-br-none">

                    <h1 className="text-5xl font-bold text-[var(--color-secondary)]">Bienvenido</h1>
                    <div className="flex flex-col text-2xl
                    text-left gap-1">
                        <span>Usuario: </span>
                        <input type="text" className="rounded-md p-1 border-2
                        outline-none focus:border-[var(--color-secondary)] 
                        focus:bg-[var(--color-gray-light)]"/>
                    </div>
                    <div className="flex flex-col text-2xl
                    text-left gap-1">
                        <span>Contraseña:</span>
                        <input type="password" 
                        className="rounded-md p-1 border-2
                        outline-none focus:border-[var(--color-secondary)]
                        focus:bg-[var(--color-gray-light)]" />

                        <div className="flex gap-1 items-center">
                            <p className="font-semibold">
                            <a href="/#" 
                            className="text-[var(--color-secondary)] hover:underline text-sm">
                            Olvidé mi contraseña</a></p>
                        </div>
                    </div>
                    <button className="px-10 py-2
                    text-2xl rounded-md bg-[var(--color-primary)]
                     hover:bg-[var(--color-secondary)]
                     text-white">Ingresar</button>

                     <p className="font-semibold">
                        ¿No tienes una cuenta? <a href="/registro" 
                        className="text-[var(--color-secondary)] hover:underline">
                        Registrarse</a></p>
                </div>
                <img src={imagenLogin} alt="" 
                className='w-[450px] object-cover
                xl:rounded-tr-2xl
                xl:rounded-br-2xl
                xl:block hidden'/>
            </div>
        </section>
    )
}

export default FormularioLogin;