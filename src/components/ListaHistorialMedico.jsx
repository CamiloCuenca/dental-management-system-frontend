// src/components/ListaHistorialMedico.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import TokenService from '../services/tokenService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ListaHistorialMedico = () => {
  const [historialPorAnio, setHistorialPorAnio] = useState({});
  const [aniosVisibles, setAniosVisibles] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarHistoriales = async () => {
      try {
        setLoading(true);
        const pacienteId = TokenService.getUserId();
        
        if (!pacienteId) {
          toast.error("No se pudo obtener el ID del paciente. Por favor, inicie sesión nuevamente.");
          navigate('/login');
          return;
        }

        const response = await api.get(`/historiales/paciente/${pacienteId}/agrupado-por-anio`);
        setHistorialPorAnio(response.data);
        setAniosVisibles({});
      } catch (error) {
        console.error('Error al obtener historial:', error);
        toast.error("No se pudieron cargar los historiales médicos.");
      } finally {
        setLoading(false);
      }
    };

    cargarHistoriales();
  }, [navigate]);

  const toggleAnio = (anio) => {
    setAniosVisibles((prev) => ({
      ...prev,
      [anio]: !prev[anio]
    }));
  };

  const handleDescargar = async () => {
    const toastId = toast.loading("Preparando descarga...", {
      position: "bottom-right"
    });
  
    try {
      const id = TokenService.getUserId();
      if (!id) {
        toast.error("No se pudo obtener el ID del paciente. Por favor, inicie sesión nuevamente.");
        return;
      }
  
      const response = await api.post(
        `/historiales/paciente/pdf/${id}`,
        {},
        {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
          }
        }
      );
  
      if (!(response.data instanceof Blob) || response.data.size === 0) {
        throw new Error("El archivo recibido no es válido");
      }
  
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = downloadUrl;
      link.setAttribute('download', `historial_dental_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
  
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        toast.success("✅ Descarga completada", { 
          id: toastId,
          position: "bottom-right"
        });
      }, 100);
  
    } catch (error) {
      console.error('Error en la descarga:', error);
      
      let errorMessage = "Error al descargar el historial";
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = "Error en el servidor al generar el PDF";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      toast.error(`❌ ${errorMessage}`, { 
        id: toastId,
        position: "bottom-right"
      });
    }
  };

  const handleDescargarPorAnio = async (anio) => {
    const toastId = toast.loading(`Preparando descarga del año ${anio}...`, {
      position: "bottom-right"
    });

    try {
      const id = TokenService.getUserId();
      if (!id) {
        toast.error("No se pudo obtener el ID del paciente. Por favor, inicie sesión nuevamente.");
        return;
      }

      const response = await api.post(
        `/historiales/paciente/pdf/${id}/${anio}`,
        {},
        {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
          }
        }
      );

      if (!(response.data instanceof Blob) || response.data.size === 0) {
        throw new Error("El archivo recibido no es válido");
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = downloadUrl;
      link.setAttribute('download', `historial_dental_${id}_${anio}.pdf`);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        toast.success(`✅ Descarga del año ${anio} completada`, { 
          id: toastId,
          position: "bottom-right"
        });
      }, 100);

    } catch (error) {
      console.error('Error en la descarga:', error);
      
      let errorMessage = `Error al descargar el historial del año ${anio}`;
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = "Error en el servidor al generar el PDF";
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(`❌ ${errorMessage}`, { 
        id: toastId,
        position: "bottom-right"
      });
    }
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : Object.keys(historialPorAnio).length > 0 ? (
        <div className="space-y-6">
          {/* Botón para descargar todo */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleDescargar}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar todo el historial
            </button>
          </div>

          {Object.entries(historialPorAnio).map(([anio, historiales]) => (
            <div key={anio} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="flex justify-between items-center w-full px-6 py-4 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)] text-white hover:from-[var(--color-secondary)] hover:to-[var(--color-primary)] transition-all duration-300">
                <button
                  onClick={() => toggleAnio(anio)}
                  className="text-left text-xl font-semibold flex items-center justify-between w-full"
                >
                  <span>Historial año {anio}</span>
                  <span className="text-2xl">{aniosVisibles[anio] ? '▼' : '▶'}</span>
                </button>
                <button
                  onClick={() => handleDescargarPorAnio(anio)}
                  className="ml-4 bg-white text-[var(--color-primary)] hover:bg-gray-100 font-medium py-1 px-3 rounded-lg text-sm shadow transition-colors duration-300 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar
                </button>
              </div>

              {aniosVisibles[anio] && (
                <div className="p-6">
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-secondary)]">Paciente</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-secondary)]">Odontólogo</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-secondary)]">Fecha</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-secondary)]">Diagnóstico</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-secondary)]">Tratamiento</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-secondary)]">Tipo de cita</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-secondary)]">Observaciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {historiales.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 text-sm text-gray-700">{item.nombrePaciente}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{item.nombreOdontologo}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{item.fecha}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{item.diagnostico}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{item.tratamiento}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{item.tipoCita}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{item.observaciones}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron historiales médicos</h3>
          <p className="text-gray-500">No hay registros médicos disponibles para mostrar.</p>
        </div>
      )}
    </div>
  );
};

export default ListaHistorialMedico;