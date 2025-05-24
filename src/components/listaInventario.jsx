import React, { useEffect, useState } from "react";
import api from "../services/api";

const ListaInventario = () => {
    const [inventario, setInventario] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cantidades, setCantidades] = useState({});
    const [pendientes, setPendientes] = useState({});
    const [enviando, setEnviando] = useState(false);

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

    const handleCantidad = (id, val) => {
        setCantidades((prev) => ({
            ...prev,
            [id]: Math.max(0, Number(val)),
        }));
    };

    const agregarPendiente = (id) => {
        const cant = cantidades[id] || 0;
        setPendientes((prev) => {
            const nuevo = { ...prev };
            if (cant > 0) nuevo[id] = cant;
            else delete nuevo[id];
            return nuevo;
        });
    };

    const quitarPendiente = (id) => {
        setPendientes((prev) => {
            const nuevo = { ...prev };
            delete nuevo[id];
            return nuevo;
        });
        setCantidades((prev) => ({ ...prev, [id]: 0 }));
    };

    const getUserId = () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) return null;
            return JSON.parse(atob(token.split(".")[1])).userId;
        } catch {
            return null;
        }
    };

    const aceptarGeneral = async () => {
        setEnviando(true);
        const userId = getUserId();
        if (!userId) {
            alert("No se pudo obtener el usuario.");
            setEnviando(false);
            return;
        }
        try {
            await Promise.all(
                Object.entries(pendientes).map(async ([id, cantidad]) => {
                    await api.put(`/inventario/${id}/usar?cantidad=${cantidad}`);
                })
            );
            alert("Productos usados correctamente.");
            setPendientes({});
            setCantidades({});
            cargarInventario();
        } catch {
            alert("Error al usar productos.");
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="overflow-x-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-primary">Inventario</h2>
            {loading ? (
                <div className="text-center text-secondary">Cargando...</div>
            ) : (
                <>
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-primary text-white">
                                <th className="py-2 px-4">ID</th>
                                <th className="py-2 px-4">Nombre</th>
                                <th className="py-2 px-4">Descripción</th>
                                <th className="py-2 px-4">Tipo</th>
                                <th className="py-2 px-4">Disponible</th>
                                <th className="py-2 px-4">Mínima</th>
                                <th className="py-2 px-4">Estado</th>
                                <th className="py-2 px-4">Usar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventario.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-4 text-secondary">
                                        No hay datos disponibles.
                                    </td>
                                </tr>
                            ) : (
                                inventario.map((item) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-100">
                                        <td className="py-2 px-4">{item.id}</td>
                                        <td className="py-2 px-4">{item.nombre}</td>
                                        <td className="py-2 px-4">{item.descripcion || "-"}</td>
                                        <td className="py-2 px-4">{item.tipoProducto}</td>
                                        <td className="py-2 px-4">{item.cantidadDisponible}</td>
                                        <td className="py-2 px-4">{item.cantidadMinima}</td>
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
                                        <td className="py-2 px-4 flex items-center gap-2">
                                            <input
                                                type="number"
                                                min={0}
                                                max={item.cantidadDisponible}
                                                value={cantidades[item.id] || ""}
                                                onChange={(e) => handleCantidad(item.id, e.target.value)}
                                                className="w-16 border rounded px-2 py-1"
                                                disabled={enviando}
                                            />
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                onClick={() => agregarPendiente(item.id)}
                                                disabled={enviando || (cantidades[item.id] || 0) === 0}
                                            >
                                                Aceptar
                                            </button>
                                            {pendientes[item.id] && (
                                                <>
                                                    <button
                                                        className="ml-1 text-xs text-red-500 underline"
                                                        onClick={() => quitarPendiente(item.id)}
                                                        disabled={enviando}
                                                    >
                                                        Quitar
                                                    </button>
                                                    <span className="ml-2 text-green-600 font-semibold">
                                                        Usar: {pendientes[item.id]}
                                                    </span>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-end">
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={aceptarGeneral}
                            disabled={enviando || Object.keys(pendientes).length === 0}
                        >
                            {enviando ? "Procesando..." : "Aceptar General"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ListaInventario;
