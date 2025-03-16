import React, { useState } from "react";
import Table from "./Table";
import api from "../services/api"; // Cliente Axios configurado para realizar peticiones HTTP

// Definición de las columnas de la tabla
const columns = [
  { key: "idCita", label: "ID Cita" },
  { key: "idPaciente", label: "ID Paciente" },
  { key: "idDoctor", label: "ID Doctor" },
  { key: "fechaHora", label: "Fecha" },
  { key: "estado", label: "Estado Cita" },
  { key: "tipoCita", label: "Tipo de Cita" },
  { key: "acciones", label: "Acciones" },
];

// Opciones disponibles para el tipo de cita
const opcionesTipoCita = [
  "CONSULTA_GENERAL",
  "LIMPIEZA_DENTAL",
  "EXTRACCION_DIENTES",
  "TRATAMIENTO_DE_CONDUCTO",
  "ORTODONCIA",
  "IMPLANTES_DENTALES",
  "BLANQUEAMIENTO_DENTAL",
  "OTRO",
];

export default function TableCitas() {
  // Estado para almacenar las citas obtenidas
  const [citas, setCitas] = useState([]);
  // Estado para controlar si la búsqueda está en curso
  const [loading, setLoading] = useState(false);
  // Estado para almacenar el ID del paciente ingresado
  const [idPaciente, setIdPaciente] = useState(sessionStorage.getItem("idPaciente") || "");
  // Estado para manejar la edición de una cita específica
  const [editandoId, setEditandoId] = useState(null);

  // Función para buscar las citas de un paciente por su ID
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

  // Función para iniciar la edición de una cita
  const handleEdit = (cita) => {
    console.log("Editar cita:", cita);
    setEditandoId(cita.idCita);
  };

  // Función para actualizar el tipo de cita
  const handleTipoCitaChange = async (idCita, nuevoTipoCita) => {
    try {
      await api.put(`/citas/editar/${idCita}`, null, {
        params: { nuevoTipoCita },
      });

      // Actualizar el estado local con la nueva información
      setCitas((prevCitas) =>
        prevCitas.map((c) =>
          c.idCita === idCita ? { ...c, tipoCita: nuevoTipoCita } : c
        )
      );

      setEditandoId(null);
      alert("Cita actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
      alert("Ocurrió un error al actualizar la cita.");
    }
  };

  // Función para cancelar una cita
  const handleDelete = async (cita) => {
    if (window.confirm("¿Seguro que quieres cancelar esta cita?")) {
      try {
        console.log("ID de la cita a cancelar:", cita.idCita);
        await api.put(`/citas/cancelar/${cita.idCita}`);

        // Actualizar el estado de la cita en la lista de citas
        setCitas((prevCitas) =>
          prevCitas.map((c) =>
            c.idCita === cita.idCita ? { ...c, estado: "CANCELADA" } : c
          )
        );

        alert("Cita cancelada correctamente.");
      } catch (error) {
        console.error("Error al cancelar la cita:", error);
        alert("Ocurrió un error al cancelar la cita.");
      }
    }
  };

  return (
    <div className="p-6 bg-grayLight min-h-screen flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl h-[85vh] flex flex-col">
        <h2 className="text-2xl font-bold text-secondary mb-4 text-center">
          🦷 Consulta tus Citas 🦷
        </h2>

        {/* Campo de entrada para ingresar el ID del paciente y botón de búsqueda */}
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

        {/* Tabla de citas o mensaje de carga */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-secondary text-center">Cargando citas...</p>
          ) : (
            <Table
              columns={columns}
              data={citas}
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
