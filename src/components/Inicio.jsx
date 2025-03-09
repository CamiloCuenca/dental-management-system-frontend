import imagenAgendaCita from '../assets/imagenAgendaCita.png';
import imagenLogin from '../assets/imagenLogin.png';

const Inicio = () => {
    return (
        <section className="pt-10 pb-10 flex flex-col items-center justify-center gap-10 px-6 md:px-12">
            <div className="flex flex-col md:flex-row shadow-2xl w-full max-w-4xl">
                <img 
                    src={imagenAgendaCita} 
                    alt="Agenda tu Cita" 
                    className="w-full md:w-[450px] object-cover rounded-t-2xl md:rounded-tr-none md:rounded-bl-2xl hidden md:block"
                />
                <div className="flex flex-col items-center justify-center text-center p-10 md:p-20 gap-6 bg-white rounded-2xl md:rounded-tr-2xl md:rounded-br-2xl w-full">
                    <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-secondary)]">Agenda tu Cita</h1>
                    <p className="text-lg md:text-2xl text-gray-700">Solicita tu cita con nosotros de manera rápida y sencilla.</p>
                    <button 
                        onClick={() => window.location.href='/citas'}
                        className="px-6 md:px-10 py-2 text-lg md:text-2xl rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white transition duration-300">
                        Agendar Cita
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Inicio;