import imagenAgendaCita from '../assets/imagenAgendaCita.png';
import Historial from '../assets/historial.png';
import Card from './Card';

export default function InicioDoctor(){
    return(
        <section className="pt-10 pb-10 flex flex-col md:flex-row gap-10 md:gap-20 items-center justify-center px-6 md:px-12">
      <Card
        image={imagenAgendaCita}
        imageAlt="Ver mis citas"
        title="ver mis citas"
        description="Visualizar mis citas programadas."
        buttonText="Ver citas"
        redirectTo="/citasDoctor"
      />

    <Card
        image={imagenAgendaCita}
        imageAlt="Ver mis citas"
        title="ver mis citas"
        description="Visualizar mis citas programadas."
        buttonText="Ver citas"
        redirectTo="/formularioHistorial"
      />
     
    </section>
    );
}