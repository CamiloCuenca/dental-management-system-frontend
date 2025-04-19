import ListaHistorialMedico from "../components/ListaHistorialMedico";
import Header from "../components/Header";
import Footer from "../components/footer";

export default function HistorialMedico() {
    return (
        <div className="min-h-screen flex flex-col transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-50 via-blue-50/80 to-blue-50">
            <Header />
            
            <main className="container mx-auto px-6 py-10 space-y-16 flex-grow">
                <section className="text-center space-y-2 animate-fade-in">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)]">
                        Historial Médico
                    </h1>
                    <p className="text-gray-600 text-lg sm:text-xl">
                        Consulta y descarga tu historial médico de manera segura y organizada.
                    </p>
                </section>

                <section className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-3xl shadow-md p-8 transition-all duration-300 hover:shadow-lg animate-fade-in-up">
                    <ListaHistorialMedico />
                </section>
            </main>

            <Footer />
        </div>
    );
}
