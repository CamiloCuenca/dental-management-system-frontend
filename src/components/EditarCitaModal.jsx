import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const EditarCitaModal = ({ cita, onClose, onSuccess }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [loading, setLoading] = useState(false);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  useEffect(() => {
    if (cita.fechaHora) {
      const [datePart, timePart] = cita.fechaHora.split(', ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');
      
      const parsedDate = new Date(year, month - 1, day, hours, minutes);
      setFechaSeleccionada(parsedDate);
      setHoraSeleccionada(`${hours}:${minutes}`);
    }

    obtenerFechasDisponibles(cita.doctorId);
  }, [cita.fechaHora, cita.doctorId]);

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
          }))
        }));
        setFechasDisponibles(fechasProcesadas);
      }
    } catch (error) {
      console.error('Error al obtener fechas disponibles:', error);
      toast.error('No se pudieron obtener las fechas disponibles');
    }
  };

  const handleFechaSeleccionada = (fecha) => {
    setFechaSeleccionada(fecha);
    setHoraSeleccionada('');

    const fechaSeleccionadaStr = fecha.toISOString().split('T')[0];
    const fechaDisponible = fechasDisponibles.find(f =>
      f.fecha.toISOString().split('T')[0] === fechaSeleccionadaStr
    );

    if (fechaDisponible) {
      setHorariosDisponibles(fechaDisponible.horarios);
    } else {
      setHorariosDisponibles([]);
      toast.error('No hay horarios disponibles para esta fecha');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!fechaSeleccionada || !horaSeleccionada) {
      toast.error('Por favor seleccione una fecha y hora');
      return;
    }

    const fecha = fechaSeleccionada.toISOString().split('T')[0];
    const hora = horaSeleccionada;

    setLoading(true);
    try {
      await api.put(`/citas/paciente/editar/${cita.id}`, {
        citaId: cita.id,
        fecha: fecha,
        hora: hora
      });

      toast.success('Cita actualizada correctamente');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al actualizar la cita:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl transform transition-all duration-300 ease-in-out">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-primary mb-2">Editar Cita</h2>
          <p className="text-gray-600">Selecciona una nueva fecha y hora para tu cita</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <label className="block text-gray-700 font-medium mb-3">Fecha</label>
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
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
                className="border-0"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <label className="block text-gray-700 font-medium mb-3">Hora</label>
            <select
              value={horaSeleccionada}
              onChange={(e) => setHoraSeleccionada(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
              disabled={!fechaSeleccionada}
            >
              <option value="">Seleccione una hora</option>
              {horariosDisponibles
                .filter(h => h.disponible)
                .map(hora => (
                  <option key={hora.hora} value={hora.hora}>
                    {hora.hora}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:bg-gray-400 font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarCitaModal; 