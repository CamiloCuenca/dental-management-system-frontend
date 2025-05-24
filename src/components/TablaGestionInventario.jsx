import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import api from "../services/api";

const GestionInventario = () => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const [productoAEliminar, setProductoAEliminar] = useState(null);

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    setLoading(true);
    try {
      const res = await api.get("/inventario");
      setInventario(res.data.content || []);
    } catch {
      setInventario([]);
    } finally {
      setLoading(false);
    }
  };

  const inventarioFiltrado = inventario.filter((item) => {
    const nombreMatch = item.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const tipoMatch = item.tipoProducto.toLowerCase().includes(filtroTipo.toLowerCase());
    const estadoMatch = filtroEstado ? item.estado === filtroEstado : true;
    return nombreMatch && tipoMatch && estadoMatch;
  });

  const abrirModalEliminar = (producto) => {
    setProductoAEliminar(producto);
  };

  const cerrarModalEliminar = () => {
    setProductoAEliminar(null);
  };

  return (
    <div className="overflow-x-auto p-4 mt-16">
      <h2 className="text-3xl font-bold mb-6 text-primary text-center">Gestión de Inventario</h2>

      {/* Filtros */}
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
        <input
          type="text"
          placeholder="Tipo"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm text-gray-700"
        >
          <option value="">Todos</option>
          <option value="DISPONIBLE">DISPONIBLE</option>
          <option value="NO_DISPONIBLE">NO DISPONIBLE</option>
        </select>
      </div>

      {/* Botón Agregar Producto */}
      <div className="flex justify-end mb-8">
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
          <span className="text-xl font-bold leading-none">+</span>
          Agregar Producto
        </button>
      </div>

      {loading ? (
        <div className="text-center text-secondary">Cargando...</div>
      ) : (
        <div className="rounded-lg overflow-hidden shadow-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-primary text-white text-sm uppercase text-center">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Disponible</th>
                <th className="py-3 px-4">Mínima</th>
                <th className="py-3 px-4">Fecha vencimiento</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventarioFiltrado.length > 0 ? (
                inventarioFiltrado.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`text-center text-sm ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                  >
                    <td className="py-2 px-4">{item.id}</td>
                    <td className="py-2 px-4">{item.nombre}</td>
                    <td className="py-2 px-4">{item.descripcion || "-"}</td>
                    <td className="py-2 px-4">{item.tipoProducto}</td>
                    <td className="py-2 px-4">{item.cantidadDisponible}</td>
                    <td className="py-2 px-4">{item.cantidadMinima}</td>
                    <td className="py-2 px-4">{item.fechaVencimiento}</td>
                    <td className="py-2 px-4">
                      <span
                        className={
                          item.estado === "DISPONIBLE"
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {item.estado}
                      </span>
                    </td>
                    <td className="py-2 px-4 flex justify-center gap-2">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition flex items-center gap-1">
                        <Edit size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => abrirModalEliminar(item)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-secondary italic">
                    No hay datos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de confirmación */}
      {productoAEliminar && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
            <p className="mb-6">
              ¿Está seguro que desea eliminar el producto{" "}
              <span className="font-bold">{productoAEliminar.nombre}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
                // NO tiene onClick, no hace nada
              >
                Sí, eliminar
              </button>
              <button
                onClick={cerrarModalEliminar}
                className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionInventario;
