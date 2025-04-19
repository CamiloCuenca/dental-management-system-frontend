import React, { useEffect, useState } from "react";
import CitasTable from "./CitasTable";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TokenService from "../services/tokenService";

const CitasDoctor = () => {
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoy, setHoy] = useState("");

  useEffect(() => {
    // Obtener fecha actual en formato YYYY-MM-DD para comparación
    const fechaActual = new Date();
    const fechaHoy = fechaActual.toISOString().split('T')[0];
    setHoy(fechaHoy);

    const doctorId = TokenService.getUserId();
    if (doctorId) {
      obtenerCitas(doctorId);
    } else {
      toast.error("No se pudo obtener el ID del doctor. Por favor, inicie sesión nuevamente.");
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
    try {
      const response = await api.get(`/citas/doctor/${id}`);
      const citasFormateadas = response.data.map((cita) => ({
        ...cita,
        fechaHora: new Date(cita.fechaHora).toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        fechaParaComparacion: new Date(cita.fechaHora).toISOString().split('T')[0], // Para comparación
        fecha: new Date(cita.fechaHora).toLocaleDateString("es-ES") // Formato visual
      }));
      setCitas(citasFormateadas);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      toast.error("No se pudieron cargar las citas.");
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarCita = (cita) => {
    if (cita.fechaParaComparacion !== hoy) {
      toast.error("Solo se pueden iniciar citas programadas para hoy");
      return;
    }
    
    if (cita.estado !== "CONFIRMADA") {
      toast.error("Solo se pueden iniciar citas confirmadas");
      return;
    }
    
    toast.success(`Iniciando cita ${cita.id}...`);
    
    navigate("/formularioHistorial", {
      state: {
        pacienteId: cita.pacienteId,
        citaId: cita.id,
        odontologoId: TokenService.getUserId()
      }
    });
  };

  const puedeIniciarCita = (cita) => {
    return cita.fechaParaComparacion === hoy && cita.estado === "CONFIRMADA";
  };

  return (
    <div className="p-6 bg-grayLight min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl h-[85vh] flex flex-col">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">🩺 Citas Asignadas al Doctor</h2>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-center text-secondary py-4">Cargando citas...</p>
          ) : citas.length === 0 ? (
            <p className="text-center text-secondary py-4">No hay citas asignadas</p>
          ) : (
            <CitasTable 
              citas={citas} 
              onIniciar={handleIniciarCita} 
              puedeIniciar={puedeIniciarCita}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CitasDoctor;