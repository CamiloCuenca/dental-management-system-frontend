import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TokenService from '../services/TokenService'; // Asegúrate que esté bien importado

const FormularioHistorial = ({ onSubmit }) => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    const [formulario, setFormulario] = useState({
        pacienteId: '',
        odontologoId: '',
        citaId: '',
        fecha: '',
        diagnostico: '',
        tratamiento: '',
        observaciones: '',
        proximaCita: ''
    });

    useEffect(() => {
        if (!TokenService.isAuthenticated()) {
            navigate('/login');
            return;
        }
        const id = TokenService.getUserId();
        if (!id) {
            navigate('/login');
            return;
        }
        setUserId(id);
    }, [navigate]);

    if (!userId) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario({ ...formulario, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(formulario);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6"
        >
            <h2 className="text-2xl font-bold text-secondary text-center">📝 Historial Médico</h2>

            {/* Sección 1: Datos del Paciente y Odontólogo */}
            <fieldset className="border border-gray-200 p-4 rounded">
                <legend className="text-lg font-semibold text-gray-700">👤 Información Básica</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">ID del Paciente</label>
                        <input
                            type="text"
                            name="pacienteId"
                            value={formulario.pacienteId}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">ID del Odontólogo</label>
                        <input
                            type="text"
                            name="odontologoId"
                            value={formulario.odontologoId}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </fieldset>

            {/* Sección 2: Información de la Cita */}
            <fieldset className="border border-gray-200 p-4 rounded">
                <legend className="text-lg font-semibold text-gray-700">📅 Información de la Cita</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">ID de la Cita</label>
                        <input
                            type="number"
                            name="citaId"
                            value={formulario.citaId}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Fecha</label>
                        <input
                            type="date"
                            name="fecha"
                            value={formulario.fecha}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </fieldset>

            {/* Sección 3: Detalles Médicos */}
            <fieldset className="border border-gray-200 p-4 rounded">
                <legend className="text-lg font-semibold text-gray-700">🩺 Detalles Médicos</legend>
                <div className="mt-2 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Diagnóstico</label>
                        <textarea
                            name="diagnostico"
                            rows="3"
                            value={formulario.diagnostico}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Tratamiento</label>
                        <textarea
                            name="tratamiento"
                            rows="3"
                            value={formulario.tratamiento}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Observaciones</label>
                        <textarea
                            name="observaciones"
                            rows="2"
                            value={formulario.observaciones}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Próxima Cita</label>
                        <input
                            type="date"
                            name="proximaCita"
                            value={formulario.proximaCita}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </fieldset>

            <div className="text-center">
                <button
                    type="submit"
                    className="bg-secondary text-white px-6 py-2 rounded hover:bg-primary transition"
                >
                    💾 Guardar Historial
                </button>
            </div>
        </form>
    );
};

export default FormularioHistorial;
