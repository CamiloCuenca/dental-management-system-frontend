import React from "react";

// Componente Table: Muestra una tabla con datos dinámicos y opciones de edición y eliminación
const Table = ({ columns, data, onEdit, onDelete, editandoId, handleTipoCitaChange }) => {
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

  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-4">
      {/* Tabla con bordes y diseño responsivo */}
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        {/* Encabezado de la tabla */}
        <thead className="bg-primary text-white">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 text-left uppercase font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Cuerpo de la tabla */}
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={row.idCita} className={`border-b border-grayLight ${rowIndex % 2 === 0 ? "bg-grayLight" : "bg-white"}`}>
                {columns.map((col) => (
                  <td key={`${row.idCita}-${col.key}`} className="px-6 py-4">
                    {/* Si la columna es tipoCita y está en edición, se muestra un select */}
                    {col.key === "tipoCita" ? (
                      editandoId === row.idCita ? (
                        <select
                          className="p-2 border rounded-lg"
                          value={row.tipoCita}
                          onChange={(e) => handleTipoCitaChange(row.idCita, e.target.value)}
                        >
                          {opcionesTipoCita.map((opcion) => (
                            <option key={opcion} value={opcion}>
                              {opcion}
                            </option>
                          ))}
                        </select>
                      ) : (
                        row.tipoCita
                      )
                    ) : col.key === "acciones" ? (
                      // Botones de editar y eliminar para cada fila
                      <div className="flex gap-2">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition" onClick={() => onEdit(row)}>
                          Editar
                        </button>
                        <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition" onClick={() => onDelete(row)}>
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      // Para cualquier otra columna, muestra el valor correspondiente o un guion si está vacío
                      row[col.key] ?? "—"
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            // Si no hay datos, muestra un mensaje indicando que no hay información disponible
            <tr>
              <td colSpan={columns.length} className="text-center py-6 text-secondary font-semibold">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
