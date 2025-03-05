import React, { useState } from "react";
import Table from "./Table";
import api from "../services/api"; // Cliente Axios configurado

const columns = [
  { key: "idPaciente", label: "ID Paciente" },
  { key: "idDoctor", label: "Id Doctor" },
  { key: "fechaHora", label: "Fecha" },
  { key: "estado", label: "Estado Cita" },
  { key: "tipoCita", label: "Tipo de Cita" },
];

export default function TableCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idPaciente, setIdPaciente] = useState(
    sessionStorage.getItem("idPaciente") || ""
  );

  const buscarCitas = async () => {
    if (!idPaciente.trim()) {
      alert("Por favor, ingrese un ID de paciente.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/citas/paciente/${idPaciente}`);
      setCitas(response.data);
      sessionStorage.setItem("idPaciente", idPaciente);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-grayLight min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl h-[85vh] flex flex-col">
        <h2 className="text-2xl font-bold text-secondary mb-4 text-center">
        🦷 Consulta tus Citas 🦷
        </h2>

        {/* Campo de entrada y botón */}
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
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-secondary transition"
          >
            Buscar
          </button>
        </div>

        {/* Contenido de la tabla */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-secondary text-center">Cargando citas...</p>
          ) : (
            <Table columns={columns} data={citas} />
          )}
        </div>
      </div>
    </div>
  );
}
