import { useState, useEffect } from 'react';

const HistorialMedico = () => {
    const [cedula, setCedula] = useState('');
    const [historial, setHistorial] = useState([]);
    const [formValido, setFormValido] = useState(false);

    // Validar el formulario cada vez que el campo cedula cambie
    useEffect(() => {
        setFormValido(cedula.trim() !== '');  // Deshabilitar el botón si la cédula está vacía
    }, [cedula]);  // Dependencia para actualizar cuando el valor de cedula cambie

    // Maneja el cambio en el campo de cédula
    const handleChange = (e) => {
        setCedula(e.target.value);
    };

    const handleBuscar = () => {
        // Simulación de datos (deberías reemplazarlo con una petición real)
        setHistorial([
            { id: cedula, fecha: new Date().toLocaleDateString(), enlace: '#' }
        ]);
    };

    return (
        <section className="pt-0 pb-10 flex flex-col items-center justify-center gap-10 px-6 md:px-12">
            {/* Formulario de búsqueda */}
            <div className="shadow-2xl w-full max-w-4xl p-10 bg-white rounded-2xl flex flex-col items-center gap-6">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)]">Consulta tu Historial Médico</h1>
                <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                    <input
                        type="number"
                        value={cedula}
                        onChange={handleChange}
                        placeholder="Ingrese su número de identificación"
                        className="px-4 py-2 w-full md:w-96 border rounded-md text-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-[#D72F8B] hover:border-[#D72F8B] transition-all duration-300"
                    />

                    <button
                        onClick={handleBuscar}
                        disabled={!formValido}  // Deshabilita el botón si el formulario no es válido
                        className={`px-6 py-2 text-lg rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white transition duration-300 ${!formValido ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        Buscar
                    </button>
                </div>
            </div>

            {/* Tabla de resultados */}
            {historial.length > 0 && (
                <div className="shadow-2xl w-full max-w-4xl p-10 bg-white rounded-2xl">
                    <h2 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">Resultados</h2>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200 text-lg">
                                <th className="border border-gray-300 px-4 py-2">Número de Identificación</th>
                                <th className="border border-gray-300 px-4 py-2">Fecha</th>
                                <th className="border border-gray-300 px-4 py-2">Descargar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historial.map((item, index) => (
                                <tr key={index} className="text-center text-lg">
                                    <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.fecha}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <a
                                            href={item.enlace}
                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                                            Descargar
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default HistorialMedico;
