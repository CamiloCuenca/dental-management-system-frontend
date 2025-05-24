import React, { useState, useEffect } from "react";
import api from "../services/api";

const TablaGestionPacientes = () => {
  const [filtros, setFiltros] = useState({
    identificacion: "",
    nombres: "",
    apellidos: "",
  });
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacientes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/cuenta/pacientes");
        setPacientes(res.data || []);
      } catch (err) {
        setError("Error al cargar pacientes");
        setPacientes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPacientes();
  }, []);

  const handleChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const matchIdentificacion = paciente.identificacion?.toLowerCase().includes(filtros.identificacion.toLowerCase());
    const matchNombres = paciente.nombres?.toLowerCase().includes(filtros.nombres.toLowerCase());
    const matchApellidos = paciente.apellidos?.toLowerCase().includes(filtros.apellidos.toLowerCase());

    return (
      (!filtros.identificacion || matchIdentificacion) &&
      (!filtros.nombres || matchNombres) &&
      (!filtros.apellidos || matchApellidos)
    );
  });

  return (
    <div className="overflow-x-auto p-4 mt-20">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-4xl font-extrabold text-gray-800 tracking-tight bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
          Gestión de pacientes
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Consulta y administra la información personal de los pacientes de forma rápida y segura para brindar una atención médica organizada y eficiente.        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <input
          type="text"
          name="identificacion"
          value={filtros.identificacion}
          onChange={handleChange}
          placeholder="Identificación"
          className="border border-gray-300 px-4 py-2 rounded-lg w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          name="nombres"
          value={filtros.nombres}
          onChange={handleChange}
          placeholder="Nombres"
          className="border border-gray-300 px-4 py-2 rounded-lg w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          name="apellidos"
          value={filtros.apellidos}
          onChange={handleChange}
          placeholder="Apellidos"
          className="border border-gray-300 px-4 py-2 rounded-lg w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Tabla */}
      <div className="rounded-lg overflow-hidden shadow-lg">
        {loading ? (
          <div className="text-center py-8 text-secondary">Cargando pacientes...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-primary text-white text-sm uppercase text-center">
                <th className="py-3 px-4">Identificación</th>
                <th className="py-3 px-4">Nombres</th>
                <th className="py-3 px-4">Apellidos</th>
                <th className="py-3 px-4">Dirección</th>
                <th className="py-3 px-4">Fecha de Nacimiento</th>
                <th className="py-3 px-4">Teléfono</th>
                <th className="py-3 px-4">Correo Electrónico</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.length > 0 ? (
                pacientesFiltrados.map((paciente, index) => (
                  <tr
                    key={paciente.id}
                    className={`text-center text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                  >
                    <td className="py-2 px-4">{paciente.identificacion}</td>
                    <td className="py-2 px-4">{paciente.nombres}</td>
                    <td className="py-2 px-4">{paciente.apellidos}</td>
                    <td className="py-2 px-4">{paciente.direccion}</td>
                    <td className="py-2 px-4">{paciente.fechaNacimiento}</td>
                    <td className="py-2 px-4">{paciente.telefono}</td>
                    <td className="py-2 px-4">{paciente.correoElectronico}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-secondary">
                    No hay pacientes para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TablaGestionPacientes;
