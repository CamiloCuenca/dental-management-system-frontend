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
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-blue-50 via-blue-50/80 to-blue-50">
        <div className="w-full max-w-4xl">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-12 transform transition-all duration-300 hover:shadow-2xl border border-pink-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-pink-100">
                        <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--color-secondary)] mb-2">
                        Perfil de Usuario
                    </h2>
                    <p className="text-gray-600">Gestiona tu información personal</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-10">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-[var(--color-secondary)]">Número de Identificación</p>
                        <p className="text-lg text-gray-700">{formData.idNumber}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-[var(--color-secondary)]">Nombres</p>
                        <p className="text-lg text-gray-700">{formData.name}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-[var(--color-secondary)]">Apellidos</p>
                        <p className="text-lg text-gray-700">{formData.lastName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-[var(--color-secondary)]">Dirección</p>
                        <p className="text-lg text-gray-700">{formData.address || "No especificada"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-[var(--color-secondary)]">Fecha de Nacimiento</p>
                        <p className="text-lg text-gray-700">{formData.birthDate || "No especificada"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-[var(--color-secondary)]">Número de Teléfono</p>
                        <p className="text-lg text-gray-700">{formData.phoneNumber || "No especificado"}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-[var(--color-secondary)]">Correo Electrónico</p>
                        <p className="text-lg text-gray-700">{formData.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href="/actualizarUsuario" className="block">
                        <button className="w-full px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow-md bg-[var(--color-secondary)] hover:bg-[var(--color-primary)]">
                            Actualizar Información
                        </button>
                    </a>
                    <a href="/cambiarContraseñaActual" className="block">
                        <button className="w-full px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow-md bg-[var(--color-secondary)] hover:bg-[var(--color-primary)]">
                            Actualizar Contraseña
                        </button>
                    </a>
                    <a href="/historialMedicoUsuario" className="block">
                        <button className="w-full px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow-md bg-[var(--color-secondary)] hover:bg-[var(--color-primary)]">
                            Ver Historiales Médicos
                        </button>
                    </a>
                    <a href="/#" className="block">
                        <button className="w-full px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow-md bg-red-400 hover:bg-red-400">
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
