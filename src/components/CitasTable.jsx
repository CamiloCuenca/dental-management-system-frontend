import React from "react";
import { Tooltip } from "react-tooltip";

const CitasTable = ({ citas, onIniciar, puedeIniciar }) => {
  const getEstadoClass = (estado) => {
    switch (estado) {
      case "CANCELADA":
        return "text-red-500 font-semibold";
      case "CONFIRMADA":
        return "text-green-500 font-semibold";
      case "PENDIENTE":
        return "text-yellow-500 font-semibold";
      case "COMPLETADA":
        return "text-blue-500 font-semibold";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-4">
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-primary text-white">
          <tr>
            <th className="px-6 py-3 text-left uppercase font-semibold">ID Cita</th>
            <th className="px-6 py-3 text-left uppercase font-semibold">ID Paciente</th>
            <th className="px-6 py-3 text-left uppercase font-semibold">Fecha y Hora</th>
            <th className="px-6 py-3 text-left uppercase font-semibold">Estado</th>
            <th className="px-6 py-3 text-left uppercase font-semibold">Tipo de Cita</th>
            <th className="px-6 py-3 text-left uppercase font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {citas.length > 0 ? (
            citas.map((cita, index) => (
              <tr key={cita.id} className={`border-b border-grayLight ${index % 2 === 0 ? "bg-grayLight" : "bg-white"}`}>
                <td className="px-6 py-4">{cita.id}</td>
                <td className="px-6 py-4">{cita.pacienteId}</td>
                <td className="px-6 py-4">{cita.fechaHora}</td>
                <td className="px-6 py-4">
                  <span className={getEstadoClass(cita.estado)}>{cita.estado}</span>
                </td>
                <td className="px-6 py-4">{cita.tipoCitaNombre}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onIniciar(cita)}
                    disabled={!puedeIniciar(cita)}
                    className={`px-4 py-2 rounded-md shadow transition ${
                      puedeIniciar(cita) 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    data-tooltip-id={`tooltip-${cita.id}`}
                    data-tooltip-content={
                      !puedeIniciar(cita) 
                        ? cita.estado !== "CONFIRMADA" 
                          ? "Solo se pueden iniciar citas confirmadas" 
                          : "Solo se pueden iniciar citas programadas para hoy"
                        : "Iniciar cita"
                    }
                  >
                    Iniciar Cita
                  </button>
                  <Tooltip id={`tooltip-${cita.id}`} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-6 text-secondary font-semibold">
                No hay citas disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CitasTable;