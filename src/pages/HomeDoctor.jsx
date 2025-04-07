import Header from "../components/Header";
import HeroSeccion from "../components/HeroSeccion";
import InicioDoctor from "../components/InicioDoctor";
import Footer from "../components/footer";

const HomeDoctor = () => {
    return (

        <div>
                {/* Renderiza el los comoponentes heades, heroseccion, inicio y footer */}
              <Header />
              <InicioDoctor />
              <Footer />
        
        </div>
               
         
            
    );
};

export default HomeDoctor;
