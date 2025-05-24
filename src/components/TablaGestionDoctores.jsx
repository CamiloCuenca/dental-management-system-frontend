import React, { useState } from "react";
import { Trash2 } from "lucide-react";

const doctoresMock = [
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

const TablaGestionDoctores = () => {
  const [filtros, setFiltros] = useState({
    identificacion: "",
    nombres: "",
    apellidos: "",
  });

  const [doctores, setDoctores] = useState(doctoresMock);
  const [doctorAEliminar, setDoctorAEliminar] = useState(null);

  const handleChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  const doctoresFiltrados = doctores.filter((doc) => {
    const matchIdentificacion = doc.identificacion.toLowerCase().includes(filtros.identificacion.toLowerCase());
    const matchNombres = doc.nombres.toLowerCase().includes(filtros.nombres.toLowerCase());
    const matchApellidos = doc.apellidos.toLowerCase().includes(filtros.apellidos.toLowerCase());

    return (
      (!filtros.identificacion || matchIdentificacion) &&
      (!filtros.nombres || matchNombres) &&
      (!filtros.apellidos || matchApellidos)
    );
  });

  const abrirModalEliminar = (doctor) => {
    setDoctorAEliminar(doctor);
  };

  const cerrarModalEliminar = () => {
    setDoctorAEliminar(null);
  };

  return (
    <div className="overflow-x-auto p-4 mt-20">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-4xl font-extrabold text-gray-800 tracking-tight bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
          Gestión de Doctores
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Consulta, administra y elimina la información de los doctores registrados en el sistema de forma rápida y sencilla.
        </p>
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
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {doctoresFiltrados.length > 0 ? (
              doctoresFiltrados.map((doctor, index) => (
                <tr
                  key={doctor.id}
                  className={`text-center text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100`}
                >
                  <td className="py-2 px-4">{doctor.identificacion}</td>
                  <td className="py-2 px-4">{doctor.nombres}</td>
                  <td className="py-2 px-4">{doctor.apellidos}</td>
                  <td className="py-2 px-4">{doctor.direccion}</td>
                  <td className="py-2 px-4">{doctor.fechaNacimiento}</td>
                  <td className="py-2 px-4">{doctor.telefono}</td>
                  <td className="py-2 px-4">{doctor.correoElectronico}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => abrirModalEliminar(doctor)}
                      className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200 mx-auto"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-secondary">
                  No hay doctores para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
      {doctorAEliminar && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
            <p className="mb-6">
              ¿Está seguro que desea eliminar al doctor{" "}
              <span className="font-bold">{doctorAEliminar.nombres} {doctorAEliminar.apellidos}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
              >
                Sí, eliminar
              </button>
              <button
                onClick={cerrarModalEliminar}
                className="bg-gray-300 px-5 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaGestionDoctores;