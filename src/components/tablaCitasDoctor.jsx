import React, { useEffect, useState } from "react";
import CitasTable from "./CitasTable";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const CitasDoctor = () => {
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [idDoctor, setIdDoctor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedId = sessionStorage.getItem("idDoctor");
    if (storedId) {
      setIdDoctor(storedId);
      obtenerCitas(storedId);
    }
  }, []);

  const obtenerCitas = async (id) => {
    if (!id.trim()) {
      toast.error("Por favor, ingrese un ID de doctor válido.");
      return;
    }
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
      sessionStorage.setItem("idDoctor", id);
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
        odontologoId: idDoctor
      }
    });
  };
  

  return (
    <div className="p-6 bg-grayLight min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl h-[85vh] flex flex-col">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">🩺 Citas Asignadas al Doctor</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
          <input
            type="text"
            value={idDoctor}
            onChange={(e) => setIdDoctor(e.target.value)}
            placeholder="Ingrese su ID de doctor"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => obtenerCitas(idDoctor)}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold shadow-md transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-secondary"}`}
          >
            {loading ? "Cargando..." : "Buscar"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <CitasTable citas={citas} onIniciar={handleIniciarCita} />
        </div>
      </div>
    </div>
  );
};

export default CitasDoctor;
