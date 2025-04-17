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

  useEffect(() => {
    const doctorId = TokenService.getUserId();
    if (doctorId) {
      obtenerCitas(doctorId);
    } else {
      toast.error("No se pudo obtener el ID del doctor. Por favor, inicie sesión nuevamente.");
    }
  }, []);

  const obtenerCitas = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/citas/doctor/${id}`);
      const citasFormateadas = response.data.map((cita) => ({
        ...cita,
        fecha: new Date(cita.fechaHora).toLocaleString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setCitas(citasFormateadas);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      toast.error("No se pudieron cargar las citas.");
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarCita = (cita) => {
    toast.success(`Iniciando cita ${cita.id}...`);
    console.log("Iniciar cita con ID:", cita.id);
  
    navigate("/formularioHistorial", {
      state: {
        pacienteId: cita.pacienteId,
        citaId: cita.id,
        odontologoId: TokenService.getUserId()
      }
    });
  };

  return (
    <div className="p-6 bg-grayLight min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl h-[85vh] flex flex-col">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">🩺 Citas Asignadas al Doctor</h2>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-center text-secondary py-4">Cargando citas...</p>
          ) : (
            <CitasTable citas={citas} onIniciar={handleIniciarCita} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CitasDoctor;
