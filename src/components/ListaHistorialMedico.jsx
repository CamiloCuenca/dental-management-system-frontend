// src/components/ListaHistorialMedico.jsx
import { useState } from 'react';
import api from '../services/api'; // cliente Axios ya configurado

const ListaHistorialMedico = () => {
  const [cedula, setCedula] = useState('');
  const [historialPorAnio, setHistorialPorAnio] = useState({});
  const [aniosVisibles, setAniosVisibles] = useState({});

  const handleBuscar = async () => {
    try {
      const response = await api.get(`/historiales/paciente/${cedula}/agrupado-por-anio`);
      setHistorialPorAnio(response.data);
      setAniosVisibles({});
    } catch (error) {
      console.error('Error al obtener historial:', error);
    }
  };

  const toggleAnio = (anio) => {
    setAniosVisibles((prev) => ({
      ...prev,
      [anio]: !prev[anio]
    }));
  };

  return (
    <section className="flex flex-col items-center justify-center gap-10 px-6 md:px-12">
      {/* Formulario */}
      <div className="shadow-2xl w-full max-w-4xl p-10 bg-white rounded-2xl flex flex-col items-center gap-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)]">Consulta tu Historial Médico</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          <input
            type="number"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Ingrese su número de identificación"
            className="px-4 py-2 w-full md:w-96 border rounded-md text-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-[#D72F8B] hover:border-[#D72F8B] transition-all duration-300"
          />
          <button
            onClick={handleBuscar}
            disabled={!cedula.trim()}
            className={`px-6 py-2 text-lg rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white transition duration-300 ${!cedula.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>
            Buscar
          </button>
        </div>
      </div>

      {/* Resultados agrupados por año */}
      <div className="w-full max-w-4xl">
        {Object.entries(historialPorAnio).map(([anio, historiales]) => (
          <div key={anio} className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleAnio(anio)}
              className="w-full text-left px-6 py-4 bg-[var(--color-primary)] text-white text-xl font-semibold hover:bg-[var(--color-secondary)] transition">
              {aniosVisibles[anio] ? '▼' : '▶'} Historial año {anio}
            </button>

            {aniosVisibles[anio] && (
              <div className="p-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Paciente</th>
                      <th className="border px-4 py-2">Odontólogo</th>
                      <th className="border px-4 py-2">Fecha</th>
                      <th className="border px-4 py-2">Diagnóstico</th>
                      <th className="border px-4 py-2">Tratamiento</th>
                      <th className="border px-4 py-2">Tipo de cita</th>
                      <th className="border px-4 py-2">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historiales.map((item, idx) => (
                      <tr key={idx} className="text-center">
                        <td className="border px-4 py-2">{item.nombrePaciente}</td>
                        <td className="border px-4 py-2">{item.nombreOdontologo}</td>
                        <td className="border px-4 py-2">{item.fecha}</td>
                        <td className="border px-4 py-2">{item.diagnostico}</td>
                        <td className="border px-4 py-2">{item.tratamiento}</td>
                        <td className="border px-4 py-2">{item.tipoCita}</td>
                        <td className="border px-4 py-2">{item.observaciones}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ListaHistorialMedico;
