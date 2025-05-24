import React, { useState } from "react";

const PacientesMock = [
  {
    id: 1,
    identificacion: "123456789",
    nombres: "Carlos",
    apellidos: "Pérez",
    direccion: "Calle 123 #45-67",
    fechaNacimiento: "1980-05-15",
    telefono: "3111234567",
    correoElectronico: "carlos.perez@example.com",
  },
  {
    id: 2,
    identificacion: "987654321",
    nombres: "Ana María",
    apellidos: "Rodríguez",
    direccion: "Carrera 10 #20-30",
    fechaNacimiento: "1975-10-08",
    telefono: "3207654321",
    correoElectronico: "ana.rodriguez@example.com",
  },
  {
    id: 3,
    identificacion: "456123789",
    nombres: "Juan",
    apellidos: "Gómez",
    direccion: "Av. Siempre Viva 742",
    fechaNacimiento: "1990-02-25",
    telefono: "3017896541",
    correoElectronico: "juan.gomez@example.com",
  },
];

const TablaGestionPacientes = () => {
  const [filtros, setFiltros] = useState({
    identificacion: "",
    nombres: "",
    apellidos: "",
  });

  const handleChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  const pacientesFiltrados = PacientesMock.filter((paciente) => {
    const matchIdentificacion = paciente.identificacion.toLowerCase().includes(filtros.identificacion.toLowerCase());
    const matchNombres = paciente.nombres.toLowerCase().includes(filtros.nombres.toLowerCase());
    const matchApellidos = paciente.apellidos.toLowerCase().includes(filtros.apellidos.toLowerCase());

    return (
      (!filtros.identificacion || matchIdentificacion) &&
      (!filtros.nombres || matchNombres) &&
      (!filtros.apellidos || matchApellidos)
    );
  });

  return (
    <div className="overflow-x-auto p-4 mt-16">
      <h2 className="text-2xl font-bold mb-6 text-primary text-center">Gestión de Pacientes</h2>

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
      </div>
    </div>
  );
};

export default TablaGestionPacientes;
