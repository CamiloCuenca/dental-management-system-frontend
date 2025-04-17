import React, { useState, useEffect } from "react";
import TokenService from '../services/tokenService';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

const ContenidoPerfil = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idNumber: "",
    name: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    birthDate: "",
    email: ""
  });

  useEffect(() => {
    // Verificar autenticación
    if (!TokenService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Obtener ID de la cuenta desde el token
    const accountId = TokenService.getAccountId();
    if (!accountId) {
      navigate('/login');
      return;
    }

    // Obtener información del perfil
    const obtenerPerfil = async () => {
      try {
        const response = await api.get(`/cuenta/perfil/${accountId}`);
        const perfilData = response.data;
        
        setFormData({
          idNumber: perfilData.idNumber || "",
          name: perfilData.name || "",
          lastName: perfilData.lastName || "",
          phoneNumber: perfilData.phoneNumber || "",
          address: perfilData.address || "",
          birthDate: perfilData.birthDate ? new Date(perfilData.birthDate).toLocaleDateString() : "",
          email: perfilData.email || ""
        });
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo cargar la información del perfil',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    };

    obtenerPerfil();
  }, [navigate]);

  const handleUpdate = () => {
    console.log("Actualizar información", formData);
  };

  const handlePasswordUpdate = () => {
    console.log("Actualizar contraseña");
  };

  const handleDeleteAccount = () => {
    console.log("Eliminar cuenta");
  };

  const handleViewHistory = () => {
    console.log("Ver historiales médicos");
  };

  return (
    <section className="flex items-center justify-center py-10">
      <div className="flex shadow-2xl bg-white w-full max-w-4xl rounded-2xl p-10">
        <div className="flex flex-col text-left gap-6 w-full">
          <h2 className="text-3xl font-bold text-[var(--color-secondary)] mb-6">
            Perfil de Usuario
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-lg text-gray-700">
            <p><strong>Número de Identificación:</strong> {formData.idNumber}</p>
            <p><strong>Nombres:</strong> {formData.name}</p>
            <p><strong>Apellidos:</strong> {formData.lastName}</p>
            <p><strong>Dirección:</strong> {formData.address || "No especificada"}</p>
            <p><strong>Fecha de Nacimiento:</strong> {formData.birthDate || "No especificada"}</p>
            <p><strong>Número de Teléfono:</strong> {formData.phoneNumber || "No especificado"}</p>
            <p><strong>Correo Electrónico:</strong> {formData.email}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6">
            <a href="/actualizarUsuario">
              <button className="w-full px-6 py-3 text-xl sm:text-2xl rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                Actualizar Información
              </button>
            </a>
            <a href="/cambiarContraseñaActual">
              <button className="w-full px-6 py-3 text-xl sm:text-2xl rounded-md text-white bg-yellow-500 hover:bg-yellow-600 transition-all duration-300">
                Actualizar Contraseña
              </button>
            </a>
            <a href="/historialMedicoUsuario">
              <button className="w-full px-6 py-3 text-xl sm:text-2xl rounded-md text-white bg-green-500 hover:bg-green-600 transition-all duration-300">
                Ver Historiales Médicos
              </button>
            </a>
            <a href="/#">
              <button className="w-full px-6 py-3 text-xl sm:text-2xl rounded-md text-white bg-red-500 hover:bg-red-600 transition-all duration-300">
                Eliminar Cuenta
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContenidoPerfil;
