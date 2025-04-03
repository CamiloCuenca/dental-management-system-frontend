import React, { useState, useEffect } from "react";
import Table from "./Table"; // Asegúrate de que la ruta sea correcta

const CitasDoctor = () => {
  const [citas, setCitas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  // Simulando la carga de citas desde una API
  useEffect(() => {

    // Aquí puedes hacer una petición a la API para obtener las citas del doctor

    const citasEjemplo = [
      { idCita: 1, idPaciente: 101, fecha: "2025-04-02 09:00", estado: "Confirmada", tipoCita: "CONSULTA_GENERAL" },
      { idCita: 2, idPaciente: 102, fecha: "2025-04-05 10:30", estado: "Pendiente", tipoCita: "LIMPIEZA_DENTAL" },
      { idCita: 3, idPaciente: 103, fecha: "2025-04-10 11:00", estado: "Cancelada", tipoCita: "ORTODONCIA" },
    ];
    setCitas(citasEjemplo);
  }, []);

  const handleEdit = (cita) => {
    setEditandoId(cita.idCita);
  };

  const handleDelete = (cita) => {
    setCitas(citas.filter((c) => c.idCita !== cita.idCita));
  };

  const handleTipoCitaChange = (idCita, nuevoTipo) => {
    setCitas(citas.map((cita) => (cita.idCita === idCita ? { ...cita, tipoCita: nuevoTipo } : cita)));
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case "Confirmada":
        return "text-green-500 font-semibold";
      case "Pendiente":
        return "text-yellow-500 font-semibold";
      case "Cancelada":
        return "text-red-500 font-semibold";
      default:
        return "text-gray-500";
    }
  };

  const columns = [
    { key: "idCita", label: "ID Cita" },
    { key: "idPaciente", label: "ID Paciente" },
    { key: "fecha", label: "Fecha y Hora" },
    { key: "estado", label: "Estado" },
    { key: "tipoCita", label: "Tipo de Cita" },
    { key: "acciones", label: "Acciones" },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-primary mb-4">Citas Asignadas</h2>
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
    </div>
  );
};

export default CitasDoctor;
