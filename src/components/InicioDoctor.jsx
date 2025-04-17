import imagenAgendaCita from '../assets/imagenAgendaCita.png';
import Historial from '../assets/historial.png';
import Card from './Card';

export default function InicioDoctor(){
    return(
        <section className="pt-10 pb-10 flex flex-col md:flex-row gap-10 md:gap-20 items-center justify-center px-6 md:px-12">
      <Card
        redirectTo="/citasDoctor"
      />

    
     
    </section>
    );
}