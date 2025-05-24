import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TokenService from '../services/tokenService';
import api from '../services/api';
import ListaInventario from './listaInventario';

const FormularioHistorial = ({ onSubmit }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState(null);
  const [formulario, setFormulario] = useState({
    pacienteId: '',
    odontologoId: '',
    citaId: '',
    fecha: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    proximaCita: '',
  });

  useEffect(() => {
    const id = TokenService.getUserId();
    if (!TokenService.isAuthenticated() || !id) {
      navigate('/login');
      return;
    }
    setUserId(id);

    if (location.state) {
      const { pacienteId, odontologoId, citaId } = location.state;
      setFormulario((prev) => ({
        ...prev,
        pacienteId: pacienteId || '',
        odontologoId: odontologoId || '',
        citaId: citaId || '',
        fecha: new Date().toISOString().split('T')[0],
      }));
    }
  }, [navigate, location]);

  if (!userId) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/historiales/crear', formulario);
      alert('Historial médico guardado con éxito');
      navigate('/historiales');
    } catch (error) {
      alert('Error al guardar el historial');
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 py-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-secondary text-center">📝 Historial Médico</h2>

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

      <div className="w-full max-w-4lg">
        <h3 className="text-lg font-semibold text-secondary mb-2 text-center">Inventario utilizado</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <ListaInventario />
        </div>
      </div>
    </div>
  );
};

export default FormularioHistorial;
