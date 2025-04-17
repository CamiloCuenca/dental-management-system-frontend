import ListaHistorialMedico from "../components/ListaHistorialMedico"; // NUEVO nombre
import Header from "../components/Header";
import Footer from "../components/footer";

export default function HistorialMedico() {
    return (
        <div>
            <Header />
            <div className="container mx-auto p-6 space-y-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold">Consulta y descarga tu historial médico</h1>
                    <p className="text-gray-600">Consulta y descarga tu historial médico de manera rápida y sencilla.</p>
                </div>
                <div className="border-t border-gray-300 my-6"></div>
            </div>

            {/* Renderiza el componente con la lógica de búsqueda */}
            <ListaHistorialMedico />
            <Footer />
        </div>
    );
}
