import FormularioActualizarPerfil from "../components/FormularioActualizarPerfil";
import Header from "../components/Header";
import Footer from "../components/footer";

// Componente que representa la página de login
export default function actualizarPerfil(){
    return(
        <div>
           
           {/* Renderiza el formulario de actualizar perfil */}
                 <Header />
                 <FormularioActualizarPerfil />
                 <Footer />
        </div>
    )
}