import imagenAgendaCita from '../assets/imagenAgendaCita.png';
import Historial from '../assets/historial.png';
import Card from './Card';
import TokenService from '../services/tokenService';

const Inicio = () => {
  const handleAgendarCita = () => {
    if (TokenService.isAuthenticated()) {
      return '/citas';
    } else {
      return '/agendar-cita';
    }
  };

  return (
    <section className="pt-10 pb-10 flex flex-col md:flex-row gap-10 md:gap-20 items-center justify-center px-6 md:px-12">
      <Card
        image={imagenAgendaCita}
        imageAlt="Agenda tu Cita"
        title="Agenda tu Cita"
        description="Solicita tu cita con nosotros de manera rápida y sencilla."
        buttonText="Agendar Cita"
        redirectTo={handleAgendarCita()}
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
