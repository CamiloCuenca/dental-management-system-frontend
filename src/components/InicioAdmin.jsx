import imagenGestionarPacientes from '../assets/GestionarPacientes.jpg';
import imagenGestionarDoctores from '../assets/GestionarDoctores.jpg';
import imagenGestionarInventario from '../assets/GestionarInventario.jpg';
import Card from './Card';

const InicioAdmin = () => {
  return (
    <section className="mt-24 pt-10 pb-10 px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
        <Card
          image={imagenGestionarDoctores}
          imageAlt="Gestionar Doctores"
          title="Gestionar Doctores"
          description="Administra la información de los doctores del sistema."
          buttonText="Gestionar Doctores"
          redirectTo="/gestionDoctores"
        />
        <Card
          image={imagenGestionarPacientes}
          imageAlt="Gestionar Pacientes"
          title="Gestionar Pacientes"
          description="Consulta registros de pacientes."
          buttonText="Gestionar Pacientes"
          redirectTo="/gestionPacientes"
        />
        <div className="md:col-span-2 flex justify-center">
          <Card
            image={imagenGestionarInventario}
            imageAlt="Gestionar Inventario"
            title="Gestionar Inventario"
            description="Controla los insumos y materiales odontológicos disponibles."
            buttonText="Gestionar Inventario"
            redirectTo="/gestionInventario"
          />
        </div>
      </div>
    </section>
  );
};

export default InicioAdmin;
