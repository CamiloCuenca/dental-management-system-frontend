import React, { useState } from "react";

const FormularioActualizarPerfil = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: ""
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";

    if (name === "name" || name === "lastName") {
      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
      error = nameRegex.test(value) ? "" : "Solo se permiten letras y espacios";
    }

    if (name === "phoneNumber") {
      const phoneRegex = /^\d{10}$/;
      error = phoneRegex.test(value) ? "" : "Debe contener 10 dígitos";
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      error = emailRegex.test(value) ? "" : "Correo electrónico inválido";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (!hasErrors) {
      console.log("Datos actualizados", formData);
    }
  };

  return (
    <section className="flex items-center justify-center py-10">
      <div className="flex shadow-2xl bg-white w-full max-w-4xl rounded-2xl p-10">
        <div className="flex flex-col text-left gap-6 w-full">
          <h2 className="text-3xl font-bold text-[var(--color-secondary)] mb-6">
            Editar Información
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-lg text-gray-700">
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
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Apellidos:</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 rounded-md border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingresa tus apellidos"
                  required
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Número de Teléfono</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 rounded-md border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingresa tu teléfono"
                  required
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 rounded-md border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingresa tu correo"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 rounded-md border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingresa tu dirección"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <a href="#" onClick={() => window.history.back()} className="w-full sm:w-auto">
                <button
                  type="button"
                  className="px-6 py-3 text-xl sm:text-2xl rounded-md text-white bg-gray-400 hover:bg-gray-500 transition-all duration-300"
                >
                  Cancelar
                </button>
              </a>
              
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