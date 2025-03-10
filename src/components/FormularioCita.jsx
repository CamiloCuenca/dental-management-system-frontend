import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api'; // Cliente Axios configurado para realizar peticiones HTTP

const FormularioCita = () => {
    // Estados para manejar los datos del formulario
    const [pacienteId, setPacienteId] = useState(''); // Guarda el ID del paciente
    const [tipoCita, setTipoCita] = useState('CONSULTA_GENERAL'); // Guarda el tipo de cita seleccionada
    const [otroTipoCita, setOtroTipoCita] = useState(''); // Guarda el tipo de cita personalizada si el usuario elige "OTRO"

    // Función para extraer el ID del usuario desde el token almacenado en sessionStorage
    const obtenerIdUsuarioDesdeToken = () => {
        const token = sessionStorage.getItem('token'); // Obtener el token de sesión
        if (!token) return null; // Si no hay token, retornar null

        try {
            const payloadBase64 = token.split('.')[1]; // Extraer la parte del payload del token JWT
            const decodedPayload = JSON.parse(atob(payloadBase64)); // Decodificar la parte del payload de Base64 a JSON
            return decodedPayload.idUser || null; // Retornar el ID del usuario si existe, sino retornar null
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
    };

    // Hook useEffect para establecer el pacienteId cuando se monta el componente
    useEffect(() => {
        const idUsuario = obtenerIdUsuarioDesdeToken();
        if (idUsuario) {
            setPacienteId(idUsuario); // Si se obtiene el ID del usuario, se establece en el estado
        }
    }, []); // Se ejecuta solo una vez al montar el componente

    // Manejar el cambio en el tipo de cita seleccionada
    const handleTipoCitaChange = (e) => {
        setTipoCita(e.target.value);
        if (e.target.value !== 'OTRO') {
            setOtroTipoCita(''); // Si el usuario no elige "OTRO", limpiar el campo de otroTipoCita
        }
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evitar el comportamiento predeterminado del formulario

        // Validación: Todos los campos son obligatorios
        if (!pacienteId || (tipoCita === 'OTRO' && !otroTipoCita)) {
            toast.error("⚠️ Todos los campos son obligatorios.");
            return;
        }

        // Construcción del objeto con los datos de la cita
        const citaData = {
            idPaciente: parseInt(pacienteId, 10), // Convertir el ID del paciente a número entero
            estado: "PENDIENTE", // Estado inicial de la cita
            tipoCita: tipoCita === "OTRO" ? otroTipoCita.toUpperCase() : tipoCita // Si el tipo de cita es "OTRO", usar el valor personalizado
        };

        const toastId = toast.loading("⏳ Agendando cita..."); // Mostrar mensaje de carga mientras se procesa la solicitud

        try {
            await api.post("/citas/crear", citaData); // Enviar la solicitud POST al backend
            toast.dismiss(toastId); // Ocultar mensaje de carga
            toast.success("✅ Cita creada con éxito!"); // Mostrar mensaje de éxito

            // Limpiar el formulario después del envío exitoso (excepto el pacienteId)
            setTipoCita('CONSULTA_GENERAL');
            setOtroTipoCita('');
        } catch (error) {
            toast.dismiss(toastId); // Ocultar mensaje de carga en caso de error
            toast.error("❌ Error al agendar la cita. Inténtalo de nuevo."); // Mostrar mensaje de error
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-center text-secondary">🦷 Agendar Cita Odontológica</h2>

            <div className="grid gap-4">
                {/* Campo para el ID del paciente */}
                <div>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="pacienteId">
                        Documento de identidad del paciente:
                    </label>
                    <input
                        type="text"
                        id="pacienteId"
                        value={pacienteId}
                        onChange={(e) => setPacienteId(e.target.value)}
                        disabled={!!pacienteId} // Deshabilitar si el ID del paciente ya está prellenado
                        className="w-full p-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>

                {/* Selector del tipo de cita */}
                <div>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="tipoCita">Tipo de cita:</label>
                    <select
                        id="tipoCita"
                        value={tipoCita}
                        onChange={handleTipoCitaChange}
                        required
                        className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option value="CONSULTA_GENERAL">Consulta General</option>
                        <option value="LIMPIEZA_DENTAL">Limpieza Dental</option>
                        <option value="EXTRACCION_DIENTES">Extracción de Dientes</option>
                        <option value="TRATAMIENTO_DE_CONDUCTO">Tratamiento de Conducto</option>
                        <option value="ORTODONCIA">Ortodoncia (Brackets)</option>
                        <option value="IMPLANTES_DENTALES">Implantes Dentales</option>
                        <option value="BLANQUEAMIENTO_DENTAL">Blanqueamiento Dental</option>
                        <option value="OTRO">Otro</option>
                    </select>
                </div>

                {/* Campo adicional si el usuario elige "Otro" */}
                {tipoCita === 'OTRO' && (
                    <div>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="otroTipoCita">
                            Especificar otro tipo de cita:
                        </label>
                        <input
                            type="text"
                            id="otroTipoCita"
                            value={otroTipoCita}
                            onChange={(e) => setOtroTipoCita(e.target.value)}
                            required
                            className="w-full p-2 border rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                )}
            </div>

            {/* Botón de enviar */}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary transition transform hover:scale-105"
            >
                Agendar Cita
            </button>
        </form>
    );
};

export default FormularioCita;
