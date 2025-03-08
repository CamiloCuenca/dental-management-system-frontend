import imagenAgendaCita from '../assets/imagenAgendaCita.png';
import imagenLogin from '../assets/imagenLogin.png';

const Inicio = () => {
    return (
        <section className="pt-10 pb-10 flex flex-col items-center justify-center gap-10 ">

            <div className="flex shadow-2xl w-s">
                <img src={imagenAgendaCita} alt="" 
                    className='w-[450px] object-cover rounded-2xl xl:rounded-tr-none xl:rounded-br-none xl:block hidden'/>
                <div className="flex flex-col items-center justify-center text-center p-20 gap-8 bg-white xl:rounded-tr-2xl xl:rounded-br-2xl">
                    <h1 className="text-5xl font-bold text-[var(--color-secondary)]">Agenda tu Cita</h1>
                    <p className="text-2xl text-gray-700">Solicita tu cita con nosotros de manera rápida y sencilla.</p>
                    <button 
                        onClick={() => window.location.href='/citas'}
                        className="px-10 py-2 text-2xl rounded-md bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white">
                        Agendar Cita
                    </button>
                </div>
            </div>
            
        </section>
        
    );
}

export default Inicio;