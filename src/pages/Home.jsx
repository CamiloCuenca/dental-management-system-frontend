import Header from "../components/Header";
import HeroSeccion from "../components/HeroSeccion";
import Footer from "../components/footer";
import Inicio from "../components/Inicio"

// Componente que representa la página HOME
export default function Home() {
    return (
       <div>
        {/* Renderiza el los comoponentes heades, heroseccion, inicio y footer */}
      <Header />
      <HeroSeccion />
      <Inicio />
      <Footer />

       </div>
    );
}