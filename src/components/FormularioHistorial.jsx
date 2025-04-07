import React, { useState } from 'react';

const FormularioHistorial = ({ onSubmit }) => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Puedes hacer validación aquí si deseas antes de enviar
        if (onSubmit) {
            onSubmit(formulario);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Crear Historial Médico</h2>

            <input
                type="text"
                name="pacienteId"
                placeholder="ID del Paciente"
                value={formulario.pacienteId}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />

            <input
                type="text"
                name="odontologoId"
                placeholder="ID del Odontólogo"
                value={formulario.odontologoId}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />

            <input
                type="number"
                name="citaId"
                placeholder="ID de la Cita"
                value={formulario.citaId}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />

            <input
                type="date"
                name="fecha"
                value={formulario.fecha}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />

            <textarea
                name="diagnostico"
                placeholder="Diagnóstico"
                value={formulario.diagnostico}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />

            <textarea
                name="tratamiento"
                placeholder="Tratamiento"
                value={formulario.tratamiento}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />

            <textarea
                name="observaciones"
                placeholder="Observaciones"
                value={formulario.observaciones}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />

            <input
                type="date"
                name="proximaCita"
                value={formulario.proximaCita}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Guardar Historial
            </button>
        </form>
    );
};

export default FormularioHistorial;
