import { useState, useEffect } from 'react';
import api from '../services/api';
import TokenService from '../services/tokenService';
import { toast } from 'react-hot-toast';
import { FaPhone, FaEnvelope, FaUser, FaCalendarAlt, FaClock, FaStethoscope, FaExclamationTriangle, FaInfoCircle, FaIdCard, FaCheckCircle, FaTimesCircle, FaCheck, FaBell } from 'react-icons/fa';

const TableCitasNoAuthDoctor = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoy, setHoy] = useState("");
    const [estadisticas, setEstadisticas] = useState({
        total: 0,
        canceladas: 0,
        completadas: 0,
        confirmadas: 0,
        pendientes: 0
    });

    useEffect(() => {
        // Obtener fecha actual en formato YYYY-MM-DD para comparación (sin hora)
        const fechaActual = new Date();
        const fechaHoy = formatDateToYYYYMMDD(fechaActual);
        setHoy(fechaHoy);

        fetchCitas();
    }, []);

    // Función para formatear fecha a YYYY-MM-DD (sin hora)
    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Función para validar si una cita tiene los datos mínimos requeridos
    const esCitaValida = (cita) => {
        return cita && 
               cita.pacienteNombre && 
               cita.pacienteNombre.trim() !== '' && 
               cita.pacienteNombre !== 'null' &&
               cita.email && 
               cita.email.trim() !== '' && 
               cita.email !== 'null' &&
               cita.telefono && 
               cita.telefono.trim() !== '' && 
               cita.telefono !== 'null';
    };

    const fetchCitas = async () => {
        setLoading(true);
        setError(null);

        try {
            const doctorId = TokenService.getUserId();
            const response = await api.get(`/citas/doctor-no-autenticadas/${doctorId}`, {
                headers: {
                    Authorization: `Bearer ${TokenService.getToken()}`
                }
            });
            
            if (response.data && Array.isArray(response.data)) {
                const citasFormateadas = response.data
                    .map((cita) => {
                        const fechaCita = new Date(cita.fechaHora);
                        return {
                            ...cita,
                            fechaHora: fechaCita.toLocaleString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                            fechaParaComparacion: formatDateToYYYYMMDD(fechaCita),
                            fecha: fechaCita.toLocaleDateString("es-ES")
                        };
                    })
                    .filter(esCitaValida);

                // Calcular estadísticas
                const estadisticasCalculadas = {
                    total: citasFormateadas.length,
                    canceladas: citasFormateadas.filter(cita => cita.estado === "CANCELADA").length,
                    completadas: citasFormateadas.filter(cita => cita.estado === "COMPLETADA").length,
                    confirmadas: citasFormateadas.filter(cita => cita.estado === "CONFIRMADA").length,
                    pendientes: citasFormateadas.filter(cita => cita.estado === "PENDIENTE").length
                };

                setEstadisticas(estadisticasCalculadas);
                setCitas(citasFormateadas);

                if (citasFormateadas.length === 0) {
                    toast.info('No hay citas no autenticadas disponibles');
                }
            } else {
                setCitas([]);
                setError('No se encontraron citas');
            }
        } catch (err) {
            if (err.response) {
                const statusCode = err.response.status;
                const errorMessage = err.response.data?.message || 'Error al cargar las citas';
                
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

    return (
        <div className="p-6 bg-grayLight min-h-screen flex flex-col items-center">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl h-[85vh] flex flex-col">
                <h2 className="text-2xl font-bold text-secondary mb-4 text-center">🩺 Citas No Autenticadas</h2>
                
                {/* Tarjetas de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
                        <div className="bg-primary/10 p-4 rounded-full mr-4">
                            <FaCalendarAlt className="text-secondary text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">Total Citas</h3>
                            <p className="text-2xl font-bold text-secondary">{estadisticas.total}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
                        <div className="bg-red-500/10 p-4 rounded-full mr-4">
                            <FaTimesCircle className="text-red-500 text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">Canceladas</h3>
                            <p className="text-2xl font-bold text-red-500">{estadisticas.canceladas}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
                        <div className="bg-blue-500/10 p-4 rounded-full mr-4">
                            <FaCheckCircle className="text-blue-500 text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">Completadas</h3>
                            <p className="text-2xl font-bold text-blue-500">{estadisticas.completadas}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
                        <div className="bg-green-500/10 p-4 rounded-full mr-4">
                            <FaCheck className="text-green-500 text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">Confirmadas</h3>
                            <p className="text-2xl font-bold text-green-500">{estadisticas.confirmadas}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
                        <div className="bg-yellow-500/10 p-4 rounded-full mr-4">
                            <FaBell className="text-yellow-500 text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">Pendientes</h3>
                            <p className="text-2xl font-bold text-yellow-500">{estadisticas.pendientes}</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <div className="flex items-center">
                            <FaExclamationTriangle className="text-red-500 mr-2" />
                            <p className="text-red-700">{error}</p>
                        </div>
                        <button
                            onClick={fetchCitas}
                            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                        >
                            Intentar nuevamente
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : citas.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="flex justify-center mb-4">
                                <FaInfoCircle className="text-gray-400 text-4xl" />
                            </div>
                            <p className="text-gray-500 text-lg">No hay citas no autenticadas asignadas</p>
                            <p className="text-gray-400 text-sm mt-2">Las citas no autenticadas aparecerán aquí cuando sean asignadas</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {citas.map((cita) => (
                                <div key={cita.id} className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Información del Paciente */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <FaUser className="text-primary" />
                                                <span className="font-semibold">{cita.pacienteNombre}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaIdCard className="text-primary" />
                                                <span>{cita.numeroIdentificacionNoAutenticado || "No especificado"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaEnvelope className="text-primary" />
                                                <span>{cita.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaPhone className="text-primary" />
                                                <span>{cita.telefono}</span>
                                            </div>
                                        </div>

                                        {/* Información de la Cita */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-primary" />
                                                <span>{cita.fechaHora}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-primary" />
                                                <span>{cita.duracionMinutos || "No especificado"} minutos</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaStethoscope className="text-primary" />
                                                <span>{cita.tipoCitaNombre || "No especificado"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Estado */}
                                    <div className="mt-4">
                                        <span className={`${getEstadoClass(cita.estado)} font-medium shadow px-3 py-1 inline-block`}>
                                            {cita.estado || "No especificado"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TableCitasNoAuthDoctor; 