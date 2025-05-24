import Header from "../components/Header";
import TablaGestionDoctores from "../components/TablaGestionDoctores"

// Componente que representa la página HOME
export default function GestionDoctores() {
    return (
       <div>
        {/* Renderiza el los comoponentes heades, tabla de los doctores */}
      <Header />
      <TablaGestionDoctores />

       </div>
    );
}