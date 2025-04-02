import FormularioHistorialMedico from "../components/FormularioHistorialemedico";
import Header from "../components/Header";
import Footer from "../components/footer";

// Componente que representa la página de login
export default function HistorialMedico() {
    return (
        <div>

            {/* Renderiza el formulario de historial médico */}
            <Header />
            <div className="container mx-auto p-6 space-y-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold">Consulta y descarga tu historial médico</h1>
                    <p className="text-gray-600">Consulta y descarga tu historial médico de manera rápida y sencilla.</p>
                </div>


                {/* Separador visual */}
                <div className="border-t border-gray-300 my-6"></div>
            </div>
            <FormularioHistorialMedico />
            <Footer />
        </div>
    )
}