import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/FormularioCita.css';

const FormularioCitaPublico = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombrePaciente: "",
        pacienteId: "",
        email: "",
        telefono: "",
        doctorId: "",
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

        obtenerTiposCita();
    }, []);

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
                const fechasProcesadas = response.data.map(fechaDTO => ({
                    fecha: new Date(fechaDTO.fecha),
                    horarios: fechaDTO.horarios.map(horarioDTO => ({
                        hora: horarioDTO.hora,
                        disponible: horarioDTO.disponible
                    })),
                    fechaFormateada: new Date(fechaDTO.fecha).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })
                }));

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
                newData.doctorId = "";
                newData.fecha = "";
                newData.hora = "";
                setFechaSeleccionada(null);
                setFechasDisponibles([]);
                if (value) {
                    obtenerDoctoresPorEspecialidad(value);
                }
            }

            if (name === 'doctorId') {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cargando) return;

        setCargando(true);

        try {
            if (!formData.nombrePaciente || !formData.pacienteId || !formData.email || 
                !formData.telefono || !formData.doctorId || !formData.fecha || 
                !formData.hora || !formData.tipoCitaId) {
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
                nombrePaciente: formData.nombrePaciente,
                pacienteId: formData.pacienteId,
                email: formData.email,
                telefono: formData.telefono,
                doctorId: formData.doctorId,
                fecha: formData.fecha,
                hora: formData.hora,
                tipoCitaId: parseInt(formData.tipoCitaId)
            };

            console.log('Enviando datos al servidor:', JSON.stringify(citaDTO, null, 2));

            try {
                const response = await api.post('/citas-no-autenticadas', citaDTO, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (response.status === 200) {
                    await Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'Cita creada correctamente. Te enviaremos un correo de confirmación.',
                        timer: 2000,
                        showConfirmButton: false
                    });

                    navigate('/');
                }
            } catch (error) {
                console.error('Error al crear cita:', error);
                console.error('Detalles del error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message,
                    requestData: citaDTO
                });

                let mensajeError = 'Error al crear la cita';
                let detallesError = '';

                if (error.response?.status === 400) {
                    mensajeError = 'No se pudo crear la cita';
                    detallesError = 'Por favor, verifica que todos los datos sean correctos y que el horario esté disponible.';
                } else if (error.response?.status === 500) {
                    mensajeError = 'Error en el servidor';
                    detallesError = 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente más tarde.';
                    if (error.response?.data?.message) {
                        detallesError = error.response.data.message;
                    }
                }

                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    html: `
                        <div class="text-left">
                            <p class="mb-2">${mensajeError}</p>
                            ${detallesError ? `<p class="text-sm text-gray-600">${detallesError}</p>` : ''}
                        </div>
                    `,
                    confirmButtonText: 'Aceptar'
                });
            } finally {
                setCargando(false);
            }
        } catch (error) {
            console.error('Error al crear cita:', error);
            console.error('Detalles del error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            let mensajeError = 'Error al crear la cita';
            let detallesError = '';

            if (error.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    mensajeError = errorData;
                } else if (errorData.message) {
                    mensajeError = errorData.message;
                } else if (errorData.error) {
                    mensajeError = errorData.error;
                }

                if (errorData.details) {
                    detallesError = errorData.details;
                }
            }

            await Swal.fire({
                icon: 'error',
                title: 'Error',
                html: `
                    <div class="text-left">
                        <p class="mb-2">${mensajeError}</p>
                        ${detallesError ? `<p class="text-sm text-gray-600">${detallesError}</p>` : ''}
                    </div>
                `,
                confirmButtonText: 'Aceptar'
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[var(--color-gray-light)] via-white to-[var(--color-gray-light)]">
            <div className="bg-white/80 backdrop-blur-sm border-2 border-[var(--color-secondary)]/20 rounded-3xl shadow-xl shadow-[var(--color-secondary)]/10 p-6 sm:p-10 w-full max-w-4xl transition-all duration-300">
                <div className="flex flex-col items-center text-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)]/20">
                            <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl sm:text-4xl font-extrabold text-[var(--color-primary)] tracking-tight">
                            Agendar Cita
                        </h1>
                    </div>
                    <p className="text-[var(--color-secondary)]/80 text-lg">Complete el formulario para agendar su cita médica</p>

                    <form onSubmit={handleSubmit} className="flex flex-col text-base gap-6 w-full max-w-2xl">
                        {/* Información Personal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col text-left gap-2">
                                <label className="text-[var(--color-secondary)] font-medium">Nombre</label>
                                <input
                                    type="text"
                                    name="nombrePaciente"
                                    value={formData.nombrePaciente}
                                    onChange={handleChange}
                                    className="bg-white/50 rounded-xl px-4 py-3 border-2 border-[var(--color-primary)]/20 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                                    required
                                    disabled={cargando}
                                />
                            </div>

                            <div className="flex flex-col text-left gap-2">
                                <label className="text-[var(--color-secondary)] font-medium">Número de Identificación</label>
                                <input
                                    type="text"
                                    name="pacienteId"
                                    value={formData.pacienteId}
                                    onChange={handleChange}
                                    className="bg-white/50 rounded-xl px-4 py-3 border-2 border-[var(--color-primary)]/20 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                                    required
                                    disabled={cargando}
                                />
                            </div>

                            <div className="flex flex-col text-left gap-2">
                                <label className="text-[var(--color-secondary)] font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-white/50 rounded-xl px-4 py-3 border-2 border-[var(--color-primary)]/20 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                                    required
                                    disabled={cargando}
                                />
                            </div>

                            <div className="flex flex-col text-left gap-2">
                                <label className="text-[var(--color-secondary)] font-medium">Teléfono</label>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    className="bg-white/50 rounded-xl px-4 py-3 border-2 border-[var(--color-primary)]/20 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
                                    required
                                    disabled={cargando}
                                />
                            </div>
                        </div>

                        {/* Tipo de Cita */}
                        <div className="flex flex-col text-left gap-2">
                            <label className="text-[var(--color-secondary)] font-medium">Tipo de Cita</label>
                            <select
                                name="tipoCitaId"
                                value={formData.tipoCitaId}
                                onChange={handleChange}
                                className="bg-white/50 rounded-xl px-4 py-3 border-2 border-[var(--color-primary)]/20 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
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
                                <p className="text-sm text-[var(--color-secondary)]/70">
                                    {tiposCita.find(t => t.id === parseInt(formData.tipoCitaId))?.descripcion}
                                </p>
                            )}
                        </div>

                        {/* Doctor */}
                        <div className="flex flex-col text-left gap-2">
                            <label className="text-[var(--color-secondary)] font-medium">Doctor</label>
                            <select
                                name="doctorId"
                                value={formData.doctorId}
                                onChange={handleChange}
                                className="bg-white/50 rounded-xl px-4 py-3 border-2 border-[var(--color-primary)]/20 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
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
                            <label className="block text-[var(--color-secondary)] font-medium mb-2">Fecha</label>
                            <div className="bg-white/50 p-4 rounded-xl border-2 border-[var(--color-primary)]/20">
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
                                <label className="text-[var(--color-secondary)] font-medium">Hora</label>
                                <select
                                    name="hora"
                                    value={formData.hora}
                                    onChange={handleHoraSeleccionada}
                                    className="bg-white/50 rounded-xl px-4 py-3 border-2 border-[var(--color-primary)]/20 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
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
                                onClick={() => navigate('/')}
                                className="px-6 py-3 text-lg rounded-xl bg-[var(--color-gray-light)] text-[var(--color-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-all"
                                disabled={cargando}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={
                                    cargando ||
                                    !formData.nombrePaciente ||
                                    !formData.pacienteId ||
                                    !formData.email ||
                                    !formData.telefono ||
                                    !formData.doctorId ||
                                    !formData.fecha ||
                                    !formData.hora ||
                                    !formData.tipoCitaId
                                }
                                className="px-6 py-3 text-lg rounded-xl text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 transition-all disabled:bg-[var(--color-gray-light)] disabled:text-[var(--color-secondary)]/50"
                            >
                                {cargando ? "Agendando..." : "Agendar Cita"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormularioCitaPublico; 