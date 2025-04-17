import Header from "../components/Header";
import ContenidoPerfil from "../components/ContenidoPerfil";
import Footer from "../components/footer";


// Componente que representa la página HOME
export default function Perfil() {
    return (
       <div>
        {/* Renderiza el los comoponentes heades, heroseccion, inicio y footer */}
      <Header />
      <ContenidoPerfil />
      <Footer />

       </div>
    );
}