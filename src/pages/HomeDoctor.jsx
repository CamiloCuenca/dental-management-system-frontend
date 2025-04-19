import Header from "../components/Header";
import TablaCitasDoctor from "../components/tablaCitasDoctor";
import Footer from "../components/footer";
import { FaCalendarAlt, FaUserInjured, FaChartLine, FaBell } from "react-icons/fa";
import { useState, useEffect } from "react";
import api from "../services/api";
import TokenService from "../services/tokenService";

const HomeDoctor = () => {
    const [estadisticas, setEstadisticas] = useState({
        citasHoy: 0,
        pacientesAtendidos: 0,
        citasPendientes: 0
    });

    const [proximasCitas, setProximasCitas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const doctorId = TokenService.getUserId();
                const response = await api.get(`/citas/doctor/${doctorId}`);
                const citas = response.data;

                // Calcular estadísticas
                const hoy = new Date().toISOString().split('T')[0];
                const citasHoy = citas.filter(cita => 
                    new Date(cita.fechaHora).toISOString().split('T')[0] === hoy
                ).length;

                const pacientesAtendidos = new Set(citas
                    .filter(cita => cita.estado === "COMPLETADA")
                    .map(cita => cita.pacienteId)
                ).size;

                const citasPendientes = citas.filter(cita => 
                    cita.estado === "PENDIENTE" || cita.estado === "CONFIRMADA"
                ).length;

                setEstadisticas({
                    citasHoy,
                    pacientesAtendidos,
                    citasPendientes
                });

                // Obtener próximas citas (las 3 más próximas)
                const citasOrdenadas = [...citas]
                    .filter(cita => new Date(cita.fechaHora) > new Date())
                    .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
                    .slice(0, 3);

                setProximasCitas(citasOrdenadas);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="container mx-auto px-4 py-8">
                {/* Sección de Bienvenida */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold text-secondary mb-2">
                        ¡Bienvenido, Doctor!
                    </h1>
                    <p className="text-gray-600">
                        Aquí tienes un resumen de tu día y las próximas citas programadas.
                    </p>
                </div>

                {/* Tarjetas de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
                        <div className="bg-primary/10 p-4 rounded-full mr-4">
                            <FaCalendarAlt className="text-secondary text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">Citas Hoy</h3>
                            <p className="text-2xl font-bold text-secondary">{estadisticas.citasHoy}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
                        <div className="bg-green-500/10 p-4 rounded-full mr-4">
                            <FaUserInjured className="text-green-500 text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">Pacientes Atendidos</h3>
                            <p className="text-2xl font-bold text-green-500">{estadisticas.pacientesAtendidos}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
                        <div className="bg-yellow-500/10 p-4 rounded-full mr-4">
                            <FaBell className="text-yellow-500 text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-gray-500 text-sm">Citas Pendientes</h3>
                            <p className="text-2xl font-bold text-yellow-500">{estadisticas.citasPendientes}</p>
                        </div>
                    </div>
                </div>

                {/* Próximas Citas */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-secondary mb-4">Próximas Citas</h2>
                    <div className="space-y-4">
                        {proximasCitas.length > 0 ? (
                            proximasCitas.map((cita) => (
                                <div key={cita.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold">{cita.pacienteNombre}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(cita.fechaHora).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        cita.estado === "CONFIRMADA" ? "bg-green-100 text-green-800" :
                                        cita.estado === "PENDIENTE" ? "bg-yellow-100 text-yellow-800" :
                                        "bg-gray-100 text-gray-800"
                                    }`}>
                                        {cita.estado}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No hay citas próximas programadas</p>
                        )}
                    </div>
                </div>

                {/* Tabla de Citas */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-secondary mb-4">Todas las Citas</h2>
                    <TablaCitasDoctor />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default HomeDoctor;