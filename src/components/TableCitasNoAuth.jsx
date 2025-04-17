import { useState, useEffect } from "react";
import Table from "./Table";
import api from "../services/api";
import { toast } from "react-hot-toast";
import EditarCitaModal from "./EditarCitaModal";

const columns = [
  { key: "id", label: "ID Cita" },
  { key: "nombrePaciente", label: "Nombre Paciente" },
  { key: "pacienteId", label: "ID Paciente" },
  { key: "doctorId", label: "ID Doctor" },
  { key: "doctorNombre", label: "Doctor" },
  { key: "fechaHora", label: "Fecha" },
  { key: "estado", label: "Estado Cita" },
  { key: "tipoCitaNombre", label: "Tipo de Cita" },
  { key: "acciones", label: "Acciones" },
];

export default function TableCitasNoAuth() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [citaEditando, setCitaEditando] = useState(null);

  useEffect(() => {
    buscarCitasNoAuth();
  }, []);

  const buscarCitasNoAuth = async () => {
    setLoading(true);
    try {
      const response = await api.get('/citas-no-autenticadas');
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
    } catch (error) {
      console.error("Error al obtener citas no autenticadas:", error);
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
    if (cita.estado === "CANCELADA" || cita.estado === "COMPLETADA") {
      toast.error("No se puede editar una cita cancelada o completada");
      return;
    }
    setCitaEditando(cita);
  };

  const handleEditSuccess = () => {
    buscarCitasNoAuth();
  };

  const handleDelete = async (cita) => {
    if (window.confirm("¿Seguro que quieres cancelar esta cita?")) {
      try {
        await api.put(`/citas-no-autenticadas/cancelar/${cita.id}`);
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
    <div className="min-h-screen bg-white p-8 flex flex-col items-center">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-7xl h-[85vh] flex flex-col transition-all duration-300 ease-in-out">
        <h2 className="text-3xl font-extrabold text-primary text-center mb-6 tracking-wide">
          🦷 Citas No Autenticadas 🦷
        </h2>

        <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 shadow-inner">
          {loading ? (
            <p className="text-secondary text-center py-6">Cargando citas...</p>
          ) : (
            <Table
              columns={columns}
              data={citas.map((row) => ({
                ...row,
                estado: (
                  <span className={`${getEstadoClass(row.estado)} font-medium shadow px-3 py-1 inline-block`}>
                    {row.estado}
                  </span>
                ),
              }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
              editandoId={editandoId}
            />
          )}
        </div>
      </div>

      {citaEditando && (
        <EditarCitaModal
          cita={citaEditando}
          onClose={() => setCitaEditando(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
} 