import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api'; // Cliente Axios configurado

const FormularioCita = () => {
    const [pacienteId, setPacienteId] = useState('');
    const [tipoCita, setTipoCita] = useState('CONSULTA_GENERAL');
    const [otroTipoCita, setOtroTipoCita] = useState('');

    const handleTipoCitaChange = (e) => {
        setTipoCita(e.target.value);
        if (e.target.value !== 'OTRO') {
            setOtroTipoCita('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!pacienteId || (tipoCita === 'OTRO' && !otroTipoCita)) {
            toast.error("⚠️ Todos los campos son obligatorios.");
            return;
        }
    
        const citaData = {
            idPaciente: parseInt(pacienteId, 10),
            estado: "PENDIENTE",
            tipoCita: tipoCita === "OTRO" ? otroTipoCita.toUpperCase() : tipoCita
        };
    
        const toastId = toast.loading("⏳ Agendando cita...");
    
        try {
            await api.post("/citas/crear", citaData);
            toast.dismiss(toastId);
            toast.success("✅ Cita creada con éxito!");
    
            // Limpiar el formulario después del envío exitoso
            setPacienteId('');
            setTipoCita('CONSULTA_GENERAL');
            setOtroTipoCita('');
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("❌ Error al agendar la cita. Inténtalo de nuevo.");
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
            <h2 className="text-xl font-bold mb-4">🦷 Agendar Cita Odontológica</h2>

            {/* ID del paciente */}
            <div className="mb-4">
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="pacienteId">
                    Documento de identidad del paciente:
                </label>
                <input
                    type="text"
                    id="pacienteId"
                    value={pacienteId}
                    onChange={(e) => setPacienteId(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {/* Tipo de cita */}
            <div className="mb-4">
                <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="tipoCita">Tipo de cita:</label>
                <select
                    id="tipoCita"
                    value={tipoCita}
                    onChange={handleTipoCitaChange}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                <div className="mb-4">
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="otroTipoCita">
                        Especificar otro tipo de cita:
                    </label>
                    <input
                        type="text"
                        id="otroTipoCita"
                        value={otroTipoCita}
                        onChange={(e) => setOtroTipoCita(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            )}

            {/* Botón de enviar */}
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Agendar Cita
            </button>
        </form>
    );
};

export default FormularioCita;
