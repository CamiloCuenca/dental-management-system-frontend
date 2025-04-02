import React, { useState } from "react";

const ContenidoPerfilDoctor = () => {
    const [formData, setFormData] = useState({
        idNumber: "",
        name: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        birthDate: "",
        email: ""
    });

    const handleUpdate = () => {
        console.log("Actualizar información", formData);
    };

    const handlePasswordUpdate = () => {
        console.log("Actualizar contraseña");
    };

    const handleViewHistory = () => {
        console.log("Ver historiales médicos");
    };

    return (
        <section className="flex items-center justify-center py-10">
            <div className="flex shadow-2xl bg-white w-full max-w-4xl rounded-2xl p-10">
                <div className="flex flex-col text-left gap-6 w-full">
                    <h2 className="text-3xl font-bold text-[var(--color-secondary)] mb-6">
                        Perfil del Doctor
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-lg text-gray-700">
                        <p><strong>Número de identificación:</strong> {formData.idNumber}</p>
                        <p><strong>Nombres:</strong> {formData.name}</p>
                        <p><strong>Apellidos:</strong> {formData.lastName}</p>
                        <p><strong>Número de Teléfono:</strong> {formData.phoneNumber}</p>
                        <p><strong>Dirección:</strong> {formData.address}</p>
                        <p><strong>Fecha de nacimiento:</strong> {formData.birthDate}</p>
                        <p><strong>Correo electrónico:</strong> {formData.email}</p>
                    </div>

                    {/* Botones con distribución optimizada y sin contenido en dos líneas */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 w-full">
                        <button
                            onClick={handleUpdate}
                            className="w-full px-6 py-3 text-lg sm:text-xl rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 whitespace-nowrap"
                        >
                            Actualizar Información
                        </button>
                        
                        <a href="/cambiarContraseña">
                        <button
                            onClick={handlePasswordUpdate}
                            className="w-full px-6 py-3 text-lg sm:text-xl rounded-md text-white bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 whitespace-nowrap"
                        >
                            Actualizar Contraseña
                        </button>
                        </a>

                        <a href="/citasDoctor">
                            <button
                                onClick={handleViewHistory}
                                className="w-full px-6 py-3 text-lg sm:text-xl rounded-md text-white bg-green-500 hover:bg-green-600 transition-all duration-300 whitespace-nowrap"
                            >
                                Ver citas asignadas
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContenidoPerfilDoctor;
