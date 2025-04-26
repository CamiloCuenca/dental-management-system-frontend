import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaCaretDown } from "react-icons/fa";
import api from '../services/api';
import TokenService from '../services/tokenService';
import Swal from 'sweetalert2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/FormularioCita.css';

const FormularioCita = () => {
    const navigate = useNavigate();
    const [formularioVisible, setFormularioVisible] = useState(true);
    const [formData, setFormData] = useState({
        pacienteId: "",
        odontologoId: "",
        fecha: "",
        hora: "",
        tipoCitaId: ""
    });
    const [cargando, setCargando] = useState(false);
    const [doctores, setDoctores] = useState([]);
    const [fechasDisponibles, setFechasDisponibles] = useState([]);
    const [tiposCita, setTiposCita] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    useEffect(() => {
        if (!TokenService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        const id = TokenService.getAccountId();
        if (!id) {
            navigate('/login');
            return;
        }

        const obtenerDatosUsuario = async () => {
            try {
                const response = await api.get(`/cuenta/perfil/${id}`);
                setFormData(prev => ({
                    ...prev,
                    pacienteId: response.data.idNumber
                }));
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los datos del usuario',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        };

        const obtenerTiposCita = async () => {
            try {
                const response = await api.get('/citas/tipos');
                setTiposCita(response.data);
            } catch (error) {
                console.error('Error al obtener tipos de cita:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los tipos de cita',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        };

        obtenerDatosUsuario();
        obtenerTiposCita();
    }, [navigate]);

    const obtenerDoctoresPorEspecialidad = async (tipoCitaId) => {
        try {
            setCargando(true);
            const response = await api.get(`/citas/doctores/${tipoCitaId}`);
            setDoctores(response.data);
        } catch (error) {
            console.error('Error al obtener doctores:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar los doctores',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            setDoctores([]);
        } finally {
            setCargando(false);
        }
    };

    const obtenerFechasDisponibles = async (doctorId) => {
        try {
            const fechaInicio = new Date();
            const fechaFin = new Date();
            fechaFin.setDate(fechaFin.getDate() + 30);

            const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
            const fechaFinStr = fechaFin.toISOString().split('T')[0];

            const response = await api.get(`/citas/disponibilidad/fechas/${doctorId}`, {
                params: {
                    fechaInicio: fechaInicioStr,
                    fechaFin: fechaFinStr
                }
            });

            if (response.data && Array.isArray(response.data)) {
                const fechasProcesadas = response.data.map(fechaDTO => {
                    const fecha = new Date(fechaDTO.fecha);
                    const horarios = fechaDTO.horarios.map(horarioDTO => ({
                        hora: horarioDTO.hora,
                        disponible: horarioDTO.disponible
                    }));

                    return {
                        fecha: fecha,
                        horarios: horarios,
                        fechaFormateada: fecha.toLocaleDateString('es-ES', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })
                    };
                });

                setFechasDisponibles(fechasProcesadas);
            } else {
                setFechasDisponibles([]);
            }
        } catch (error) {
            console.error('Error al obtener fechas disponibles:', error);
            setFechasDisponibles([]);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron obtener las fechas disponibles. Por favor, intente nuevamente.'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: value
            };

            if (name === 'tipoCitaId') {
                newData.odontologoId = "";
                newData.fecha = "";
                newData.hora = "";
                setFechaSeleccionada(null);
                setFechasDisponibles([]);
                if (value) {
                    obtenerDoctoresPorEspecialidad(value);
                }
            }

            if (name === 'odontologoId') {
                newData.fecha = "";
                newData.hora = "";
                setFechaSeleccionada(null);
                setFechasDisponibles([]);
                if (value) {
                    obtenerFechasDisponibles(value);
                }
            }

            if (name === 'fecha') {
                newData.hora = "";
            }

            return newData;
        });
    };

    const handleFechaSeleccionada = (fecha) => {
        if (!fecha) return;

        const fechaStr = fecha.toISOString().split('T')[0];
        const fechaDisponible = fechasDisponibles.find(f =>
            f.fecha.toISOString().split('T')[0] === fechaStr
        );

        if (fechaDisponible) {
            setFechaSeleccionada(fecha);
            setFormData(prev => ({
                ...prev,
                fecha: fechaStr,
                hora: ""
            }));
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Fecha no disponible',
                text: 'Por favor, seleccione una fecha disponible del calendario.'
            });
        }
    };

    const handleHoraSeleccionada = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            hora: value
        }));
    };

    const resetearFormulario = () => {
        setFormData({
            pacienteId: "",
            odontologoId: "",
            fecha: "",
            hora: "",
            tipoCitaId: ""
        });
        setFechaSeleccionada(null);
        setFechasDisponibles([]);
        setDoctores([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cargando) return;

        setCargando(true);

        try {
            if (!formData.pacienteId || !formData.odontologoId || !formData.fecha || !formData.hora || !formData.tipoCitaId) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor, complete todos los campos requeridos.'
                });
                return;
            }

            const fechaSeleccionada = new Date(`${formData.fecha}T${formData.hora}:00`);
            if (fechaSeleccionada < new Date()) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Fecha inválida',
                    text: 'No se pueden crear citas en fechas pasadas.'
                });
                return;
            }

            const horaSeleccionada = parseInt(formData.hora.split(':')[0]);
            if (horaSeleccionada < 8 || horaSeleccionada >= 17) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Hora inválida',
                    text: 'Las citas deben ser entre las 8:00 y las 17:00.'
                });
                return;
            }

            const citaDTO = {
                pacienteId: formData.pacienteId,
                doctorId: formData.odontologoId,
                fecha: formData.fecha,
                hora: formData.hora,
                tipoCitaId: parseInt(formData.tipoCitaId)
            };

            const response = await api.post('/citas/crear', citaDTO, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                if (response.data && response.data.id) {
                    TokenService.setAppointmentId(response.data.id);
                }

                window.dispatchEvent(new Event("cita-creada"));

                // Resetear el formulario
                resetearFormulario();
                
                // Ocultar el formulario
                setFormularioVisible(false);

                await Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Cita creada correctamente',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Redirigir después de un breve retraso
                setTimeout(() => {
                    navigate('/citas');
                }, 2000);
            }
        } catch (error) {
            console.error('Error al crear cita:', error);
            let mensajeError = 'Error al crear la cita';

            if (error.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    mensajeError = errorData;
                } else if (errorData.message) {
                    mensajeError = errorData.message;
                } else if (errorData.error) {
                    mensajeError = errorData.error;
                }
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensajeError,
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-blanco-100">
            {formularioVisible ? (
                <div className="bg-white border-2 border-blue-200 rounded-3xl shadow-lg shadow-blue-100/30 p-6 sm:p-10 w-full max-w-3xl transition-all duration-300">
                    <div className="flex flex-col items-center text-center gap-6">
                        <h1 className="text-4xl sm:text-4xl font-extrabold text-gray-800 tracking-tight bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] bg-clip-text text-transparent">
                            Crear Nueva Cita
                        </h1>
                        <hr className="w-16 border-t-4 border-gray-300 rounded-full mb-2" />

                        <form onSubmit={handleSubmit} className="flex flex-col text-base gap-6 w-full max-w-2xl">
                            {/* Tipo de Cita */}
                            <div className="flex flex-col text-left gap-2">
                                <label className="text-gray-700 font-medium">Tipo de Cita</label>
                                <select
                                    name="tipoCitaId"
                                    value={formData.tipoCitaId}
                                    onChange={handleChange}
                                    className="bg-white rounded-xl px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all"
                                    required
                                    disabled={cargando}
                                >
                                    <option value="">Seleccione el tipo de cita</option>
                                    {tiposCita.map(tipo => (
                                        <option key={tipo.id} value={tipo.id}>
                                            {tipo.nombre} - {tipo.duracionMinutos} min
                                        </option>
                                    ))}
                                </select>
                                {formData.tipoCitaId && (
                                    <p className="text-sm text-gray-600">
                                        {tiposCita.find(t => t.id === parseInt(formData.tipoCitaId))?.descripcion}
                                    </p>
                                )}
                            </div>

                            {/* Doctor */}
                            <div className="flex flex-col text-left gap-2">
                                <label className="text-gray-700 font-medium">Doctor</label>
                                <select
                                    name="odontologoId"
                                    value={formData.odontologoId}
                                    onChange={handleChange}
                                    className="bg-white rounded-xl px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
                                    required
                                    disabled={cargando}
                                >
                                    <option value="">Seleccione un doctor</option>
                                    {doctores.map(doctor => (
                                        <option key={doctor.id} value={doctor.id}>
                                            Dr. {doctor.nombre} {doctor.apellido} - {doctor.especialidad}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Fecha */}
                            <div className="text-left">
                                <label className="block text-gray-700 font-medium mb-2">Fecha</label>
                                <div className="bg-white p-2 rounded-xl border border-gray-300">
                                    <Calendar
                                        onChange={handleFechaSeleccionada}
                                        value={fechaSeleccionada}
                                        minDate={new Date()}
                                        maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
                                        tileClassName={({ date }) => {
                                            const fechaStr = date.toISOString().split('T')[0];
                                            const fechaDisponible = fechasDisponibles.find(f =>
                                                f.fecha.toISOString().split('T')[0] === fechaStr
                                            );
                                            return fechaDisponible ? 'fecha-disponible' : 'fecha-no-disponible';
                                        }}
                                        tileDisabled={({ date }) => {
                                            const fechaStr = date.toISOString().split('T')[0];
                                            return !fechasDisponibles.some(f =>
                                                f.fecha.toISOString().split('T')[0] === fechaStr
                                            );
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Hora */}
                            {fechaSeleccionada && (
                                <div className="flex flex-col text-left gap-2">
                                    <label className="text-gray-700 font-medium">Hora</label>
                                    <select
                                        name="hora"
                                        value={formData.hora}
                                        onChange={handleHoraSeleccionada}
                                        className="bg-white rounded-xl px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
                                        required
                                    >
                                        <option value="">Seleccione una hora</option>
                                        {fechasDisponibles
                                            .find(f =>
                                                f.fecha.toISOString().split('T')[0] ===
                                                fechaSeleccionada.toISOString().split('T')[0]
                                            )?.horarios
                                            .filter(h => h.disponible)
                                            .map(hora => (
                                                <option key={hora.hora} value={hora.hora}>
                                                    {hora.hora}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            )}

                            {/* Botones */}
                            <div className="flex flex-col sm:flex-row justify-end gap-4 w-full mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/citas')}
                                    className="px-6 py-2 text-lg rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
                                    disabled={cargando}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        cargando ||
                                        !formData.odontologoId ||
                                        !formData.fecha ||
                                        !formData.hora ||
                                        !formData.tipoCitaId
                                    }
                                    className="px-6 py-2 text-lg rounded-xl text-white bg-[var(--color-primary)] hover:bg-[var(--color-accent)] transition-all disabled:bg-gray-400"
                                >
                                    {cargando ? "Creando..." : "Crear Cita"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        ¡Cita creada exitosamente!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Serás redirigido a la página de citas en unos momentos...
                    </p>
                    <button
                        onClick={() => navigate('/citas')}
                        className="px-6 py-2 text-lg rounded-xl text-white bg-[var(--color-primary)] hover:bg-[var(--color-accent)] transition-all"
                    >
                        Ver mis citas
                    </button>
                </div>
            )}
        </section>
    );
};

export default FormularioCita;