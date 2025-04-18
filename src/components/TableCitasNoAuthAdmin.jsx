import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import api from '../services/api';
import TokenService from '../services/tokenService';
import Table from './Table';
import { toast } from 'react-hot-toast';

const columns = [
  { key: "id", label: "ID Cita" },
  { key: "pacienteId", label: "ID Paciente" },
  { key: "pacienteNombre", label: "Nombre Paciente" },
  { key: "email", label: "Email" },
  { key: "telefono", label: "Teléfono" },
  { key: "doctorId", label: "ID Doctor" },
  { key: "doctorNombre", label: "Doctor" },
  { key: "fechaHora", label: "Fecha" },
  { key: "estado", label: "Estado Cita" },
  { key: "tipoCitaId", label: "ID Tipo Cita" },
  { key: "tipoCitaNombre", label: "Tipo de Cita" },
  { key: "duracionMinutos", label: "Duración (min)" },
  { key: "acciones", label: "Acciones" },
];

const TableCitasNoAuthAdmin = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchId, setSearchId] = useState('');

    const handleSearchByIdentificacion = async () => {
        if (!searchId.trim()) {
            setError('Por favor ingrese un número de identificación');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/citas/paciente-no-autenticadas/${searchId}`, {
                headers: {
                    Authorization: `Bearer ${TokenService.getToken()}`
                }
            });
            
            if (response.data && Array.isArray(response.data)) {
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
                if (response.data.length === 0) {
                    setError('No se encontraron citas para este paciente');
                }
            } else {
                setCitas([]);
                setError('No se encontraron citas para este paciente');
            }
        } catch (err) {
            if (err.response) {
                const statusCode = err.response.status;
                const errorMessage = err.response.data?.message || 'Error al buscar citas';
                
                if (statusCode === 500) {
                    setError('Error interno del servidor. Contacte al administrador.');
                } else {
                    setError(`Error ${statusCode}: ${errorMessage}`);
                }
            } else if (err.request) {
                setError('No se recibió respuesta del servidor. Verifique que el backend esté corriendo en http://localhost:8081');
            } else {
                setError('Error al realizar la petición: ' + err.message);
            }
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
        // Implementar lógica de edición
    };

    const handleDelete = async (cita) => {
        if (window.confirm("¿Seguro que quieres cancelar esta cita?")) {
            try {
                await api.put(`/citas/cancelar/${cita.id}`);
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
            <div className="bg-white border-2 border-[var(--color-secondary)]/20 rounded-3xl shadow-xl shadow-[var(--color-secondary)]/10 p-8 w-full max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-[85vw] h-[85vh] flex flex-col transition-all duration-300 ease-in-out">
                <h2 className="text-3xl font-extrabold text-primary text-center mb-6 tracking-wide">
                    🦷 Búsqueda de Citas No Autenticadas 🦷
                </h2>

                {/* Barra de búsqueda */}
                <div className="mb-6 flex gap-4">
                    <input
                        type="text"
                        placeholder="Ingrese el número de identificación del paciente"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="flex-grow border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                        onClick={handleSearchByIdentificacion}
                        className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <FaSearch />
                        Buscar
                    </button>
                </div>
                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="flex-1 overflow-x-auto overflow-y-auto rounded-xl border border-gray-200 shadow-inner">
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
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TableCitasNoAuthAdmin;
