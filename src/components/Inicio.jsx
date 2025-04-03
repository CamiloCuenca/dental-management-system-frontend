import imagenAgendaCita from '../assets/imagenAgendaCita.png';
import Historial from '../assets/historial.png';

const Inicio = () => {
    return (
        // Sección principal con espaciado superior e inferior y centrado de contenido
        <section className="pt-10 pb-10 flex flex-col items-center justify-center gap-20 px-6 md:px-12">
            {/* Contenedor principal que se adapta en columna o fila según el tamaño de la pantalla */}
            <div className="flex flex-col md:flex-row shadow-2xl w-full max-w-4xl">

                {/* Imagen de la sección "Agenda tu Cita", oculta en pantallas pequeñas y visible en pantallas medianas y grandes */}
                <img
                    src={imagenAgendaCita}
                    alt="Agenda tu Cita"
                    className="w-full md:w-[450px] object-cover rounded-t-2xl md:rounded-tr-none md:rounded-bl-2xl hidden md:block"
                />

                {/* Contenedor de texto y botón, alineado al centro */}
                <div className="flex flex-col items-center justify-center text-center p-10 md:p-20 gap-6 bg-white rounded-2xl md:rounded-tr-2xl md:rounded-br-2xl w-full">

                    {/* Título de la sección */}
                    <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-secondary)]">Agenda tu Cita</h1>

                    {/* Descripción breve */}
                    <p className="text-lg md:text-2xl text-gray-700">Solicita tu cita con nosotros de manera rápida y sencilla.</p>

                    {/* Botón para agendar una cita, al hacer clic redirige a la página de citas */}
                    <button
                        onClick={() => window.location.href = '/citas'}
                        className="px-6 md:px-10 py-2 text-lg md:text-2xl rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white transition duration-300">
                        Agendar Cita
                    </button>
                </div>
            </div>

                        {/* Contenedor principal que se adapta en columna o fila según el tamaño de la pantalla */}
                        <div className="flex flex-col md:flex-row shadow-2xl w-full max-w-4xl">
                
                {/* Imagen de la sección "Agenda tu Cita", oculta en pantallas pequeñas y visible en pantallas medianas y grandes */}
                <img 
                    src={Historial} 
                    alt="Consulta historial médico" 
                    className="w-full md:w-[450px] object-cover rounded-t-2xl md:rounded-tr-none md:rounded-bl-2xl hidden md:block"
                />

                {/* Contenedor de texto y botón, alineado al centro */}
                <div className="flex flex-col items-center justify-center text-center p-10 md:p-20 gap-6 bg-white rounded-2xl md:rounded-tr-2xl md:rounded-br-2xl w-full">
                    
                    {/* Título de la sección */}
                    <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-secondary)]">Historiales médicos</h1>
                    
                    {/* Descripción breve */}
                    <p className="text-lg md:text-2xl text-gray-700">Consulta y descarga tu historial médico de manera rápida y segura.</p>
                    
                    {/* Botón para agendar una cita, al hacer clic redirige a la página de citas */}
                    <button 
                        onClick={() => window.location.href='/historialMedicoUsuario'}
                        className="px-6 md:px-10 py-2 text-lg md:text-2xl rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white transition duration-300">
                        Consultar historial
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Inicio;
