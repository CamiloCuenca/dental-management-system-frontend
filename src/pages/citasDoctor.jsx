import FormularioCita from "../components/FormularioCita";
import TablaCitasDoctor from "../components/tablaCitasDoctor";
import Header from "../components/Header";
import Footer from "../components/footer";

// Componente principal de la página de gestión de citas
export default function Citas() {
    return (
        <div>
            {/* Renderiza el encabezado de la página */}
            <Header />

            <div className="container mx-auto p-6 space-y-10">
                {/* Sección de título y descripción */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold">Citas médicas asignadas</h1>
                    <p className="text-gray-600">Administra y visualiza las citas asignadas a tu consultorio de manera eficiente.</p>
                </div>

                {/* Separador visual */}
                <div className="border-t border-gray-300 my-6"></div>

                {/* Sección para mostrar la lista de citas existentes */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Listado de Citas</h2>
                    <TablaCitasDoctor /> {/* Renderiza la tabla con las citas registradas */}
                </section>

                {/* Separador visual */}
                <div className="border-t border-gray-300 my-6"></div>
            </div>

            {/* Renderiza el pie de página */}
            <Footer />
        </div>
    );
}
