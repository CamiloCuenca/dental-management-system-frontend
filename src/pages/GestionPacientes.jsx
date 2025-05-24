import Header from "../components/Header";
import TablaGestionPacientes from "../components/TablaGestionPacientes"

// Componente que representa la página HOME
export default function GestionPacientes() {
    return (
       <div>
        {/* Renderiza el los comoponentes heades, tabla de los pacientes */}
      <Header />
      <TablaGestionPacientes />

       </div>
    );
}