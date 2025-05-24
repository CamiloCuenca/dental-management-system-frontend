import Header from "../components/Header";
import TablaGestionInventario from "../components/TablaGestionInventario"

// Componente que representa la página HOME
export default function GestionPacientes() {
    return (
       <div>
        {/* Renderiza el los comoponentes headers, tabla del inventario */}
      <Header />
      <TablaGestionInventario />

       </div>
    );
}