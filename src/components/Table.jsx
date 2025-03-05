import React from "react";

const Table = ({ columns, data, onRowClick }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-lg p-4">
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        {/* Encabezado con Tailwind normal */}
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
              <tr
                key={rowIndex}
                className={`border-b border-grayLight ${
                  onRowClick
                    ? "cursor-pointer hover:bg-accent hover:text-white transition"
                    : ""
                } ${rowIndex % 2 === 0 ? "bg-grayLight" : "bg-white"}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-secondary font-semibold"
              >
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
