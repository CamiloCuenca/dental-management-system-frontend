import React from 'react';

const HeroSeccion = () => {
    return (
        <div className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] 
                        h-[350px] md:h-[450px] flex flex-col md:flex-row items-center px-6 md:px-12 py-10 md:py-20">

            {/* Imagen oculta en pantallas pequeñas, visible en mayores */}
            <div className="hidden md:block w-[30%] md:w-[25%] lg:w-[33.5%] flex justify-start md:ml-[-20px]">
                <img 
                    src="/assets/personasHero.png" 
                    alt="Personas Hero" 
                    className="w-full h-auto object-cover"
                />
            </div>

            {/* Contenido ajustado a la izquierda */}
            <div className="w-full md:w-[50%] lg:w-[65%] text-center md:text-left text-white px-6 md:px-12">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                    Bienvenido a Nuestra Plataforma
                </h1>
                <p className="mt-3 text-lg md:text-2xl">
                    Encuentra las mejores oportunidades y servicios aquí.
                </p>

                {/* Botones de acción alineados a la izquierda */}
                <div className="mt-5 flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 items-center md:items-start">
                    <a 
                        href="/citas"
                        className="px-5 py-2.5 bg-white text-[var(--color-primary)] hover:bg-gray-200 text-lg font-semibold rounded shadow-md transition duration-300"
                    >
                        Agenda una Cita
                    </a>
                    <a 
                        href="/consultas"
                        className="px-5 py-2.5 bg-[var(--color-accent)] hover:bg-pink-600 text-white text-lg font-semibold rounded shadow-md transition duration-300"
                    >
                        Consulta tus citas
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HeroSeccion;
