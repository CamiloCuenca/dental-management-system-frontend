// Importación de React y el hook useState
import React, { useState } from "react";

const FormularioActualizarPerfil = () => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: ""
  });

  // Estado para manejar los errores de validación
  const [errors, setErrors] = useState({});

  // Función para validar campos individuales
  const validateField = (name, value) => {
    let error = "";

    // Validación para nombres y apellidos (solo letras y espacios)
    if (name === "name" || name === "lastName") {
      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
      error = nameRegex.test(value) ? "" : "Solo se permiten letras y espacios";
    }

    // Validación para número de teléfono (10 dígitos)
    if (name === "phoneNumber") {
      const phoneRegex = /^\d{10}$/;
      error = phoneRegex.test(value) ? "" : "Debe contener 10 dígitos";
    }

    // Validación para email (formato estándar)
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      error = emailRegex.test(value) ? "" : "Correo electrónico inválido";
    }

    // Actualizar estado de errores
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  // Manejador de cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Actualizar formData
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    // Validar el campo modificado
    validateField(name, value);
  };

  // Manejador de envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Verificar si hay errores antes de enviar
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (!hasErrors) {
      console.log("Datos actualizados", formData);
    }
  };

  // Renderizado del componente
  return (
    // Contenedor principal con centrado
    <section className="flex items-center justify-center py-10">
      {/* Contenedor del formulario con sombra y fondo blanco */}
      <div className="flex shadow-2xl bg-white w-full max-w-4xl rounded-2xl p-10">
        <div className="flex flex-col text-left gap-6 w-full">
          {/* Título del formulario */}
          <h2 className="text-3xl font-bold text-[var(--color-secondary)] mb-6">
            Editar Información
          </h2>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {/* Grid de campos del formulario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-lg text-gray-700">
              {/* Campo Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Nombres:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 rounded-md border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingresa tu nombre"
                  required
                />
                {/* Mensaje de error para nombre */}
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Campos similares para lastName, phoneNumber, email y address */}
              {/* ... */}

            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex justify-end gap-4">
              {/* Botón Cancelar */}
              <a href="#" onClick={() => window.history.back()} className="w-full sm:w-auto">
                <button
                  type="button"
                  className="px-6 py-3 text-xl sm:text-2xl rounded-md text-white bg-gray-400 hover:bg-gray-500 transition-all duration-300"
                >
                  Cancelar
                </button>
              </a>
              
              {/* Botón Guardar Cambios */}
              <button
                type="submit"
                className="px-6 py-3 text-xl sm:text-2xl rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300"
                disabled={Object.values(errors).some(error => error !== "")}
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FormularioActualizarPerfil;