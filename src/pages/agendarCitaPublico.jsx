import React from 'react';
import FormularioCitaPublico from '../components/FormularioCitaPublico';
import Header from '../components/Header';
import Footer from '../components/footer';

const AgendarCitaPublico = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <section className="mt-20 min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-50 via-blue-50/80 to-blue-50">
                    <div className="w-full max-w-6xl mx-auto">
                        <div className="text-center mb-8">
                        <h1 className="text-4xl sm:text-4xl font-extrabold text-gray-800 tracking-tight bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                                Agenda tu cita con nosotros
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Completa el siguiente formulario para agendar tu cita. Te enviaremos un correo de confirmación con los detalles de tu cita.
                            </p>
                        </div>
                        <FormularioCitaPublico />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AgendarCitaPublico; 