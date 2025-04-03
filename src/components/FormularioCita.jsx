import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TokenService from '../services/tokenService';
import Swal from 'sweetalert2';
import axios from 'axios';

const FormularioCita = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        idPaciente: "",
        idDoctor: "",
        fechaHora: "",
        tipoCita: "",
        estado: "PENDIENTE"
    });
    const [cargando, setCargando] = useState(false);
    const [accountId, setAccountId] = useState(null);
    const [doctores, setDoctores] = useState([]);
    const [fechasDisponibles, setFechasDisponibles] = useState([]);
    const [doctoresFiltrados, setDoctoresFiltrados] = useState([]);

    // Tipos de cita y sus doctores correspondientes
    const tiposCita = {
        CONSULTA_GENERAL: "ODONTOLOGO_GENERAL",
        LIMPIEZA_DENTAL: "HIGIENISTA_DENTAL",
        EXTRACCION_DIENTES: "CIRUJANO_ORAL_Y_MAXILOFACIAL",
        TRATAMIENTO_DE_CONDUCTO: "ENDODONCISTA",
        ORTODONCIA: "ORTODONCISTA",
        IMPLANTES_DENTALES: "PERIODONCISTA",
        BLANQUEAMIENTO_DENTAL: "ODONTOLOGO_ESTETICO",
        OTRO: "OTRO"
    };

    // Etiquetas para mostrar en el select
    const etiquetasTiposCita = {
        CONSULTA_GENERAL: "Consulta General",
        LIMPIEZA_DENTAL: "Limpieza Dental",
        EXTRACCION_DIENTES: "Extracción de Dientes",
        TRATAMIENTO_DE_CONDUCTO: "Tratamiento de Conducto",
        ORTODONCIA: "Ortodoncia",
        IMPLANTES_DENTALES: "Implantes Dentales",
        BLANQUEAMIENTO_DENTAL: "Blanqueamiento Dental",
        OTRO: "Otro"
    };

    useEffect(() => {
        // Verificar autenticación
        if (!TokenService.isAuthenticated()) {
            navigate('/login');
            return;
        }

        // Obtener ID de la cuenta desde el token
        const id = TokenService.getAccountId();
        if (!id) {
            navigate('/login');
            return;
        }
        setAccountId(id);

        // Obtener datos del usuario para el idPaciente
        const obtenerDatosUsuario = async () => {
            try {
                const response = await api.get(`/cuenta/perfil/${id}`);
                const perfilData = response.data;
                setFormData(prev => ({
                    ...prev,
                    idPaciente: perfilData.idNumber
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

        // Obtener lista de doctores
        const obtenerDoctores = async () => {
            try {
                const response = await api.get('/cuenta/doctores');
                if (response.data && Array.isArray(response.data)) {
                    setDoctores(response.data);
                } else {
                    throw new Error('Formato de respuesta inválido');
                }
            } catch (error) {
                console.error('Error al obtener doctores:', error);
                await Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los doctores. Por favor, intente nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                // Redirigir a la página anterior en caso de error
                navigate(-1);
            }
        };

        obtenerDatosUsuario();
        obtenerDoctores();
    }, [navigate]);

    const obtenerFechasDisponibles = async (doctorId) => {
        try {
            setCargando(true);
            const response = await api.get(`/citas/disponibilidad/doctor/${doctorId}`);
            
            if (response.data) {
                // Ordenar las fechas
                const fechasOrdenadas = response.data.fechasDisponibles
                    .map(fecha => new Date(fecha))
                    .sort((a, b) => a - b);
                
                setFechasDisponibles(fechasOrdenadas);
            } else {
                throw new Error('No se recibieron fechas disponibles');
            }
        } catch (error) {
            console.error('Error al obtener fechas disponibles:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'No se pudieron cargar las fechas disponibles. Por favor, intente nuevamente.',
                confirmButtonText: 'Aceptar'
            });
            setFechasDisponibles([]);
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'tipoCita') {
            // Filtrar doctores según el tipo de cita
            const doctoresFiltrados = doctores.filter(doctor => {
                if (value === 'OTRO') return true;
                const tipoDoctorRequerido = tiposCita[value];
                return doctor.tipoDoctor === tipoDoctorRequerido;
            });
            setDoctoresFiltrados(doctoresFiltrados);
            // Limpiar la selección de doctor y fecha al cambiar el tipo de cita
            setFormData(prev => ({
                ...prev,
                idDoctor: "",
                fechaHora: ""
            }));
            setFechasDisponibles([]);
        }

        // Si se selecciona un doctor, obtener sus fechas disponibles
        if (name === 'idDoctor' && value) {
            setFormData(prev => ({
                ...prev,
                fechaHora: "" // Limpiar la fecha seleccionada al cambiar de doctor
            }));
            obtenerFechasDisponibles(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cargando) return;

        setCargando(true);

        try {
            // Validar que todos los campos requeridos estén llenos
            if (!formData.idPaciente || !formData.idDoctor || !formData.fechaHora || !formData.tipoCita) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor, complete todos los campos requeridos.'
                });
                return;
            }

            // Validar que la fecha no sea en el pasado
            const fechaSeleccionada = new Date(formData.fechaHora);
            const fechaActual = new Date();
            if (fechaSeleccionada < fechaActual) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Fecha inválida',
                    text: 'La fecha de la cita no puede ser en el pasado.'
                });
                return;
            }

            // Validar horario de atención (8:00 - 18:00)
            const hora = fechaSeleccionada.getHours();
            if (hora < 8 || hora >= 18) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Horario inválido',
                    text: 'La cita debe estar dentro del horario de atención (8:00 - 18:00).'
                });
                return;
            }

            // Crear el DTO de la cita
            const citaDTO = {
                idPaciente: parseInt(formData.idPaciente),
                idDoctor: parseInt(formData.idDoctor),
                fechaHora: formData.fechaHora,
                tipoCita: formData.tipoCita,
                estado: "PENDIENTE"
            };

            // Realizar la petición al backend
            const response = await api.post('/citas/crear', citaDTO);

            if (response.status === 200) {
                await Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Cita creada correctamente',
                    timer: 2000,
                    showConfirmButton: false
                });

                // Redirigir a la lista de citas
                navigate('/citas');
            }
        } catch (error) {
            console.error('Error al crear cita:', error);
            const mensajeError = error.response?.data?.message || 'Error al crear la cita';
            
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: mensajeError,
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setCargando(false);
        }
    };

    if (!accountId) return null;

    return (
        <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-r from-[var(--color-primary)] from-10% via-[var(--color-secondary)] via-50% to-[var(--color-accent)] to-100%">
            <div className="flex shadow-2xl w-full max-w-2xl">
                <div className="flex flex-col items-center justify-center text-center p-10 sm:p-16 gap-6 sm:gap-8 bg-white rounded-2xl xl:rounded-tr-2xl xl:rounded-br-2xl w-full">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-secondary)]">
                        Crear Nueva Cita
                        <hr className="border-t border-gray-600 my-4" />
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col text-lg gap-3 w-full max-w-md">
                        <div className="mb-4">
                            <label className="font-medium block mb-1">Tipo de Cita:</label>
                            <select
                                name="tipoCita"
                                value={formData.tipoCita}
                                onChange={handleChange}
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                                required
                                disabled={cargando}
                            >
                                <option value="">Seleccione el tipo de cita</option>
                                {Object.entries(etiquetasTiposCita).map(([valor, etiqueta]) => (
                                    <option key={valor} value={valor}>
                                        {etiqueta}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="font-medium block mb-1">Doctor:</label>
                            <select
                                name="idDoctor"
                                value={formData.idDoctor}
                                onChange={handleChange}
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                                required
                                disabled={!formData.tipoCita || cargando}
                            >
                                <option value="">Seleccione un doctor</option>
                                {(formData.tipoCita ? doctoresFiltrados : doctores).map(doctor => (
                                    <option key={doctor.idNumber} value={doctor.idNumber}>
                                        Dr. {doctor.name} {doctor.lastName} - {doctor.tipoDoctor}
                                    </option>
                                ))}
                            </select>
                            {!formData.tipoCita && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Por favor, seleccione el tipo de cita primero
                                </p>
                            )}
                            {formData.tipoCita && doctoresFiltrados.length === 0 && (
                                <p className="text-sm text-red-500 mt-1">
                                    No hay doctores disponibles para este tipo de cita
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="font-medium block mb-1">Fecha y Hora:</label>
                            <select
                                name="fechaHora"
                                value={formData.fechaHora}
                                onChange={handleChange}
                                className="text-base w-full rounded-md p-2 border-2 outline-none focus:border-[var(--color-secondary)] focus:bg-[var(--color-gray-light)]"
                                required
                                disabled={!formData.idDoctor || cargando}
                            >
                                <option value="">Seleccione una fecha y hora</option>
                                {fechasDisponibles.map((fecha, index) => (
                                    <option key={index} value={fecha.toISOString()}>
                                        {fecha.toLocaleString('es-ES', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </option>
                                ))}
                            </select>
                            {!formData.idDoctor && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Por favor, seleccione un doctor primero
                                </p>
                            )}
                            {cargando && (
                                <p className="text-sm text-blue-500 mt-1">
                                    Cargando fechas disponibles...
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-4 w-full max-w-md mt-4">
                            <button 
                                type="button" 
                                onClick={() => navigate('/citas')}
                                className="w-full sm:w-auto px-6 py-2 text-lg sm:text-xl rounded-md bg-gray-400 hover:bg-gray-500 text-white transition-colors"
                                disabled={cargando}
                            >
                                Cancelar
                            </button>
                            
                            <button
                                type="submit"
                                disabled={cargando || !formData.idDoctor || !formData.fechaHora || !formData.tipoCita}
                                className="w-full sm:w-auto px-6 py-2 text-lg sm:text-xl rounded-md text-white bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-colors disabled:bg-gray-400"
                            >
                                {cargando ? "Creando..." : "Crear Cita"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FormularioCita;
