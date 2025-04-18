import { useState, useEffect } from 'react';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import TokenService from '../services/tokenService';

const TableCitasNoAuthDoctor = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCita, setEditingCita] = useState(null);
    const [formData, setFormData] = useState({
        nombrePaciente: '',
        numeroIdentificacion: '',
        telefono: '',
        email: '',
        fecha: '',
        hora: '',
        tipoCitaId: ''
    });

    useEffect(() => {
        fetchCitas();
    }, []);

    const fetchCitas = async () => {
        try {
            const doctorId = TokenService.getIdNumber(); // Obtener el ID del doctor del token
            const response = await axios.get(`/citas-no-autenticadas/doctor/${doctorId}`, {
                headers: {
                    Authorization: `Bearer ${TokenService.getToken()}`
                }
            });
            setCitas(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar las citas');
            setLoading(false);
        }
    };

    const handleEdit = (cita) => {
        setEditingCita(cita);
        setFormData({
            nombrePaciente: cita.nombrePacienteNoAutenticado,
            numeroIdentificacion: cita.numeroIdentificacionNoAutenticado,
            telefono: cita.telefonoNoAutenticado,
            email: cita.emailNoAutenticado,
            fecha: new Date(cita.fechaHora).toISOString().split('T')[0],
            hora: new Date(cita.fechaHora).toTimeString().split(' ')[0].substring(0, 5),
            tipoCitaId: cita.tipoCita.id
        });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`/citas-no-autenticadas/${editingCita.id}/doctor`, formData, {
                headers: {
                    Authorization: `Bearer ${TokenService.getToken()}`
                }
            });
            fetchCitas();
            setEditingCita(null);
        } catch (err) {
            setError('Error al actualizar la cita');
        }
    };

    const handleChangeEstado = async (id, nuevoEstado) => {
        try {
            await axios.put(`/citas-no-autenticadas/${id}/estado/doctor`, { estado: nuevoEstado }, {
                headers: {
                    Authorization: `Bearer ${TokenService.getToken()}`
                }
            });
            fetchCitas();
        } catch (err) {
            setError('Error al cambiar el estado de la cita');
        }
    };

    if (loading) return <div className="text-center">Cargando...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Mis Citas No Autenticadas</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border">Paciente</th>
                            <th className="py-2 px-4 border">Identificación</th>
                            <th className="py-2 px-4 border">Teléfono</th>
                            <th className="py-2 px-4 border">Email</th>
                            <th className="py-2 px-4 border">Fecha y Hora</th>
                            <th className="py-2 px-4 border">Tipo</th>
                            <th className="py-2 px-4 border">Estado</th>
                            <th className="py-2 px-4 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {citas.map((cita) => (
                            <tr key={cita.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border">
                                    {editingCita?.id === cita.id ? (
                                        <input
                                            type="text"
                                            value={formData.nombrePaciente}
                                            onChange={(e) => setFormData({...formData, nombrePaciente: e.target.value})}
                                            className="border rounded px-2 py-1"
                                        />
                                    ) : (
                                        cita.nombrePacienteNoAutenticado
                                    )}
                                </td>
                                <td className="py-2 px-4 border">
                                    {editingCita?.id === cita.id ? (
                                        <input
                                            type="text"
                                            value={formData.numeroIdentificacion}
                                            onChange={(e) => setFormData({...formData, numeroIdentificacion: e.target.value})}
                                            className="border rounded px-2 py-1"
                                        />
                                    ) : (
                                        cita.numeroIdentificacionNoAutenticado
                                    )}
                                </td>
                                <td className="py-2 px-4 border">
                                    {editingCita?.id === cita.id ? (
                                        <input
                                            type="text"
                                            value={formData.telefono}
                                            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                                            className="border rounded px-2 py-1"
                                        />
                                    ) : (
                                        cita.telefonoNoAutenticado
                                    )}
                                </td>
                                <td className="py-2 px-4 border">
                                    {editingCita?.id === cita.id ? (
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="border rounded px-2 py-1"
                                        />
                                    ) : (
                                        cita.emailNoAutenticado
                                    )}
                                </td>
                                <td className="py-2 px-4 border">
                                    {editingCita?.id === cita.id ? (
                                        <div className="flex space-x-2">
                                            <input
                                                type="date"
                                                value={formData.fecha}
                                                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                                                className="border rounded px-2 py-1"
                                            />
                                            <input
                                                type="time"
                                                value={formData.hora}
                                                onChange={(e) => setFormData({...formData, hora: e.target.value})}
                                                className="border rounded px-2 py-1"
                                            />
                                        </div>
                                    ) : (
                                        new Date(cita.fechaHora).toLocaleString()
                                    )}
                                </td>
                                <td className="py-2 px-4 border">
                                    {editingCita?.id === cita.id ? (
                                        <input
                                            type="text"
                                            value={formData.tipoCitaId}
                                            onChange={(e) => setFormData({...formData, tipoCitaId: e.target.value})}
                                            className="border rounded px-2 py-1"
                                        />
                                    ) : (
                                        cita.tipoCita.nombre
                                    )}
                                </td>
                                <td className="py-2 px-4 border">
                                    <select
                                        value={cita.estado}
                                        onChange={(e) => handleChangeEstado(cita.id, e.target.value)}
                                        className="border rounded px-2 py-1"
                                    >
                                        <option value="PENDIENTE">Pendiente</option>
                                        <option value="CONFIRMADA">Confirmada</option>
                                        <option value="CANCELADA">Cancelada</option>
                                        <option value="COMPLETADA">Completada</option>
                                    </select>
                                </td>
                                <td className="py-2 px-4 border">
                                    {editingCita?.id === cita.id ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleUpdate}
                                                className="text-green-500 hover:text-green-700"
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={() => setEditingCita(null)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(cita)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableCitasNoAuthDoctor; 