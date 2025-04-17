import imagenAgendaCita from '../assets/imagenAgendaCita.png';
import Historial from '../assets/historial.png';
import Card from './Card';

const Inicio = () => {
  return (
    <section className="pt-10 pb-10 flex flex-col md:flex-row gap-10 md:gap-20 items-center justify-center px-6 md:px-12">
      <Card
        image={imagenAgendaCita}
        imageAlt="Agenda tu Cita"
        title="Agenda tu Cita"
        description="Solicita tu cita con nosotros de manera rápida y sencilla."
        buttonText="Agendar Cita"
        redirectTo="/agendar-cita"
      />
      <Card
        image={Historial}
        imageAlt="Consulta historial médico"
        title="Historiales médicos"
        description="Consulta y descarga tu historial médico."
        buttonText="Consultar historial"
        redirectTo="/historialMedicoUsuario"
      />
    </section>
  );
};

export default Inicio;
