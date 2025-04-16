import  { useState, useEffect } from "react";
import Table from "./Table";
import api from "../services/api";
import { toast } from "react-hot-toast";

const columns = [
  { key: "id", label: "ID Cita" },
  { key: "pacienteId", label: "ID Paciente" },
  { key: "doctorId", label: "ID Doctor" },
  { key: "doctorNombre", label: "Doctor" },
  { key: "fechaHora", label: "Fecha" },
  { key: "estado", label: "Estado Cita" },
  { key: "tipoCitaNombre", label: "Tipo de Cita" },
  { key: "acciones", label: "Acciones" },
];





export default function TableCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idPaciente, setIdPaciente] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    const storedId = sessionStorage.getItem("idPaciente");
    if (storedId) setIdPaciente(storedId);
  }, []);

  const buscarCitas = async () => {
    if (!idPaciente.trim()) {
      toast.error("Por favor, ingrese un ID de paciente válido.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/citas/paciente/${idPaciente}`);
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
      sessionStorage.setItem("idPaciente", idPaciente);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      toast.error("No se pudieron cargar las citas.");
      setCitas([]);
    } finally {
      setLoading(false);
    }
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

  const handleEdit = (cita) => {
    setEditandoId(cita.id);
  };
  
  const handleTipoCitaChange = async (idCita, nuevoTipoCita) => {
    try {
      await api.put(`/citas/editar/${idCita}`, null, {
        params: { nuevoTipoCita },
      });
      setCitas((prevCitas) =>
        prevCitas.map((c) => (c.id === idCita ? { ...c, tipoCitaNombre: nuevoTipoCita } : c))
      );
      setEditandoId(null);
      toast.success("Cita actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
      toast.error("Ocurrió un error al actualizar la cita.");
    }
  };
  
  const handleDelete = async (cita) => {
    if (window.confirm("¿Seguro que quieres cancelar esta cita?")) {
      try {
        await api.put(`/citas/cancelar/${cita.id}`);
        setCitas((prevCitas) =>
          prevCitas.map((c) =>
            c.id === cita.id ? { ...c, estado: "CANCELADA" } : c
          )
        );
        toast.success("Cita cancelada correctamente.");
      } catch (error) {
        console.error("Error al cancelar la cita:", error);
        toast.error("Ocurrió un error al cancelar la cita.");
      }
    }
  };
  

  return (
    <div className="p-6 bg-grayLight min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl h-[85vh] flex flex-col">
        <h2 className="text-2xl font-bold text-secondary mb-4 text-center">
          🦷 Consulta tus Citas 🦷
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
          <input
            type="text"
            value={idPaciente}
            onChange={(e) => setIdPaciente(e.target.value)}
            placeholder="Ingrese su ID"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={buscarCitas}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold shadow-md transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-secondary"}`}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-secondary text-center">Cargando citas...</p>
          ) : (
            <Table
              columns={columns}
              data={citas.map((row) => ({
                ...row,
                estado: <span className={getEstadoClass(row.estado)}>{row.estado}</span>,
              }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
              editandoId={editandoId}
              handleTipoCitaChange={handleTipoCitaChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
