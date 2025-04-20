import React, { useState, useEffect } from "react";

const FormularioActualizarPerfil = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: ""
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Validar todo el formulario cuando cambien los errores
  useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error !== "");
    const allFieldsFilled = Object.values(formData).every(field => field.trim() !== "");
    setIsFormValid(!hasErrors && allFieldsFilled);
  }, [errors, formData]);

  const validateField = (name, value) => {
    let error = "";

    if (name === "name" || name === "lastName") {
      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s']+$/;
      if (!value.trim()) {
        error = "Este campo es requerido";
      } else if (!nameRegex.test(value)) {
        error = "Solo se permiten letras y espacios";
      }
    }

    if (name === "phoneNumber") {
      const phoneRegex = /^[0-9]{10}$/;
      if (!value.trim()) {
        error = "Este campo es requerido";
      } else if (!phoneRegex.test(value)) {
        error = "Debe contener exactamente 10 dígitos";
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        error = "Este campo es requerido";
      } else if (!emailRegex.test(value)) {
        error = "Correo electrónico inválido";
      }
    }

    if (name === "address" && !value.trim()) {
      error = "Este campo es requerido";
    }

    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Filtro especial para el campo de teléfono
    let processedValue = value;
    if (name === "phoneNumber") {
      // Eliminar cualquier caracter que no sea número
      processedValue = value.replace(/\D/g, '');
      // Limitar a 10 caracteres
      processedValue = processedValue.slice(0, 10);
    }
    
    setFormData(prevData => ({
      ...prevData,
      [name]: processedValue
    }));
    
    validateField(name, processedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Datos actualizados", formData);
      // Aquí iría la llamada a tu API
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
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Número de Teléfono</label>
                <input
                  type="tel"  // Cambiado a type="tel" para mejor soporte en móviles
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-6 py-3 rounded-md border border-gray-300 text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ingresa tu teléfono"
                  inputMode="numeric"  // Muestra teclado numérico en móviles
                  pattern="[0-9]{10}"  // Ayuda a la validación nativa
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
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
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 text-xl sm:text-2xl rounded-md text-white bg-gray-400 hover:bg-gray-500 transition-all duration-300"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className={`px-6 py-3 text-xl sm:text-2xl rounded-md text-white transition-all duration-300 ${
                  isFormValid 
                    ? "bg-blue-500 hover:bg-blue-600" 
                    : "bg-blue-300 cursor-not-allowed"
                }`}
                disabled={!isFormValid}
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