import Header from "../components/Header";
import ContenidoPerfilDoctor from "../components/ContenidoPerfilDoctor";
import Footer from "../components/footer";


// Componente que representa la página HOME
export default function Perfil() {
    return (
       <div>
        {/* Renderiza el los comoponentes heades, heroseccion, inicio y footer */}
      <Header />
      <ContenidoPerfilDoctor />
      <Footer />

       </div>
    );
}