import FormularioCita from "../components/FormularioCita";
import TableCitas from "../components/TableCitas";
import Header from "../components/Header";
import Footer from "../components/footer";

export default function Citas() {
    return (
        
        <div>
        <Header />
        <div className="container mx-auto p-6 space-y-10">
          



            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold">Gestión de Citas</h1>
                <p className="text-gray-600">Administra y visualiza las citas de manera eficiente.</p>
            </div>

            <div className="border-t border-gray-300 my-6"></div>

            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Agendar Nueva Cita</h2>
                <FormularioCita />
            </section>

            <div className="border-t border-gray-300 my-6"></div>

            <section className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Listado de Citas</h2>
                <TableCitas />
            </section>

            <div className="border-t border-gray-300 my-6"></div>
            
           
        </div>
         <Footer />
         </div>
    );
}
