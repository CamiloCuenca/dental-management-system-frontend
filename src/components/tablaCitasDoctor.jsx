import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TokenService from "../services/tokenService";
import { FaPhone, FaEnvelope, FaUser, FaCalendarAlt, FaClock, FaStethoscope, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

const CitasDoctor = () => {
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    const id = TokenService.getUserId();
    if (id) {
      setDoctorId(id);
      obtenerCitas(id);
    } else {
      const errorMsg = "No se pudo obtener el ID del doctor. Por favor, inicie sesión nuevamente.";
      setError(errorMsg);
      toast.error(errorMsg);
    }

    const handleCitaCreada = () => {
      const currentDoctorId = TokenService.getUserId();
      if (currentDoctorId) {
        obtenerCitas(currentDoctorId);
      }
    };

    window.addEventListener("cita-creada", handleCitaCreada);

    return () => {
      window.removeEventListener("cita-creada", handleCitaCreada);
    };
  }, []);

  const obtenerCitas = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/citas/doctor/${id}`);
      if (response.data && Array.isArray(response.data)) {
        const citasFormateadas = response.data.map((cita) => ({
          ...cita,
          fechaHora: new Date(cita.fechaHora).toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setCitas(citasFormateadas);
      } else {
        throw new Error("Formato de datos inválido recibido del servidor");
      }
    } catch (error) {
      console.error("Error al obtener citas:", error);
      let errorMessage = "Error al cargar las citas";
      
      if (error.response) {
        switch (error.response.status) {
          case 500:
            errorMessage = "Error en el servidor. Por favor, intente nuevamente más tarde.";
            break;
          case 404:
            errorMessage = "No se encontraron citas para este doctor.";
            break;
          case 401:
            errorMessage = "No autorizado. Por favor, inicie sesión nuevamente.";
            break;
          case 403:
            errorMessage = "No tiene permisos para ver estas citas.";
            break;
          default:
            errorMessage = error.response.data?.message || "Error al cargar las citas";
        }
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor. Verifique su conexión a internet.";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarCita = (cita) => {
    if (!cita.pacienteId || !cita.id) {
      toast.error("Datos de la cita incompletos");
      return;
    }
    
    toast.success(`Iniciando cita con ${cita.pacienteNombre}...`);
    navigate("/formularioHistorial", {
      state: {
        pacienteId: cita.pacienteId,
        citaId: cita.id,
        odontologoId: TokenService.getUserId()
      }
    });
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case "CANCELADA":
        return "bg-red-500 text-white px-3 py-1 rounded-lg";
      case "CONFIRMADA":
        return "bg-green-500 text-white px-3 py-1 rounded-lg";
      case "PENDIENTE":
        return "bg-yellow-500 text-black px-3 py-1 rounded-lg";
      case "COMPLETADA":
        return "bg-blue-500 text-white px-3 py-1 rounded-lg";
      default:
        return "bg-gray-300 text-black px-3 py-1 rounded-lg";
    }
  };

  return (
    <div className="p-6 bg-grayLight min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl h-[85vh] flex flex-col">
        <h2 className="text-2xl font-bold text-secondary mb-4 text-center">🩺 Citas Asignadas al Doctor</h2>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={() => obtenerCitas(doctorId)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : citas.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <FaInfoCircle className="text-gray-400 text-4xl" />
              </div>
              <p className="text-gray-500 text-lg">No hay citas asignadas</p>
              <p className="text-gray-400 text-sm mt-2">Las citas aparecerán aquí cuando sean asignadas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {citas.map((cita) => (
                <div key={cita.id} className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Información del Paciente */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-primary" />
                        <span className="font-semibold">{cita.pacienteNombre}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-primary" />
                        <span>{cita.email || "No especificado"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-primary" />
                        <span>{cita.telefono || "No especificado"}</span>
                      </div>
                    </div>

                    {/* Información de la Cita */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-primary" />
                        <span>{cita.fechaHora}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-primary" />
                        <span>{cita.duracionMinutos} minutos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaStethoscope className="text-primary" />
                        <span>{cita.tipoCitaNombre}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estado y Acciones */}
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`${getEstadoClass(cita.estado)} font-medium shadow px-3 py-1 inline-block`}>
                      {cita.estado}
                    </span>
                    {cita.estado !== "CANCELADA" && cita.estado !== "COMPLETADA" && (
                      <button
                        onClick={() => handleIniciarCita(cita)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Iniciar Cita
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitasDoctor;
