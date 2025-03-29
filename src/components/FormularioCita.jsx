import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const FormularioCita = () => {
    const [pacienteId, setPacienteId] = useState('');
    const [tipoCita, setTipoCita] = useState('CONSULTA_GENERAL');
    const [otroTipoCita, setOtroTipoCita] = useState('');

    useEffect(() => {
        const obtenerIdUsuarioDesdeToken = () => {
            const token = sessionStorage.getItem('token');
            if (!token) return null;

            try {
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                return decodedPayload.idUser || null;
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                return null;
            }
        };

        const idUsuario = obtenerIdUsuarioDesdeToken();
        if (idUsuario) {
            setPacienteId(idUsuario);
        }
    }, []);

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
            setTipoCita('CONSULTA_GENERAL');
            setOtroTipoCita('');
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("❌ Error al agendar la cita. Inténtalo de nuevo.");
        }
    };

    const isButtonEnabled = pacienteId.trim() !== '';

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-center text-secondary">🦷 Agendar Cita Odontológica</h2>

            <div className="grid gap-4">
                <div>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="pacienteId">
                        Documento de identidad del paciente:
                    </label>
                    <input
                        type="text"
                        id="pacienteId"
                        value={pacienteId}
                        onChange={(e) => setPacienteId(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>

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

            <button
                type="submit"
                className={`w-full py-2 px-4 rounded-lg font-bold transition transform hover:scale-105 ${isButtonEnabled ? 'bg-blue-500 text-white hover:bg-pink-600' : 'bg-gray-400 cursor-not-allowed'}`}
                disabled={!isButtonEnabled}
            >
                Agendar Cita
            </button>
        </form>
    );
};

export default FormularioCita;
