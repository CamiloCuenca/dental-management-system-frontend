import "react";

// Componente Table: Muestra una tabla con datos dinámicos y opciones de edición y eliminación
// eslint-disable-next-line react/prop-types
const Table = ({ columns, data, onEdit, onDelete }) => {
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
              <tr key={row.id} className={`border-b border-grayLight ${rowIndex % 2 === 0 ? "bg-grayLight" : "bg-white"}`}>
                {columns.map((col) => (
                  <td key={`${row.id}-${col.key}`} className="px-6 py-4">
                    {col.key === "acciones" ? (
                      <div className="flex gap-2">
                        <button 
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition" 
                          onClick={() => onEdit(row)}
                        >
                          Editar
                        </button>
                        <button 
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition" 
                          onClick={() => onDelete(row)}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-6 text-secondary font-semibold">
                No hay citas disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
