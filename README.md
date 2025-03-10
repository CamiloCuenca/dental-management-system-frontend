# 🦷 Dental Management System


Sistema de gestión para clínicas odontológicas que permite la digitalización de historiales médicos, control de inventario y agendamiento automatizado de citas.

## Pagina 
https://dental-management-system-frontend.vercel.app/
## 🚀 Tecnologías Utilizadas
- **Frontend:** React, JavaScript, Tailwind CSS
- **Librerías:** Axios, React Router, React Icons, SweetAlert2, React Google Recaptcha, React Slick
- **Herramientas de Desarrollo:** Vite, ESLint, Tailwind CSS

## 📦 Instalación y Configuración
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/CamiloCuenca/dental-management-system-frontend.git
   cd dental-management-system-frontend
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Ejecutar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
4. Para construir el proyecto para producción:
   ```bash
   npm run build
   ```

## 📂 Estructura del Proyecto
```
📦 dental-management-system-frontend
├── 📂 Public        
│   ├── 📂 assets        # Imágenes y estilos
├── 📂 src
│   ├── 📂 components    # Componentes reutilizables
│   ├── 📂 pages         # Páginas principales
│   ├── 📂 hooks         # Hooks personalizados
│   ├── 📂 context       # Context API
│   ├── 📂 services      # Llamadas a la API
│   ├── 📂 styles        # Archivos CSS y Tailwind
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Punto de entrada
│   ├── router.jsx      # Configuración de rutas
├── package.json        # Dependencias y scripts
├── tailwind.config.js  # Configuración de Tailwind
├── vite.config.js      # Configuración de Vite
└── README.md           # Documentación del proyecto
```

## ✨ Características Principales
✅ Gestión de historiales médicos digitales
✅ Control de inventario odontológico
✅ Agendamiento automatizado de citas
✅ Interfaz moderna y responsiva con Tailwind CSS
✅ Integración con Google Recaptcha para seguridad
✅ Notificaciones interactivas con SweetAlert2 y React Hot Toast

## 📌 Dependencias
```json
{
  "dependencies": {
    "@shadcn/ui": "^0.0.4",
    "@tailwindcss/vite": "^4.0.1",
    "axios": "^1.8.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-google-recaptcha": "^3.1.0",
    "react-hot-toast": "^2.5.2",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.2.0",
    "react-scroll": "^1.9.3",
    "react-slick": "^0.30.3",
    "sweetalert2": "^11.17.2"
  }
}
```

## 🛠 Contribuciones
Si deseas contribuir al proyecto:
1. Haz un fork del repositorio.
2. Crea una rama con tu nueva funcionalidad: `git checkout -b feature/nueva-funcionalidad`
3. Realiza cambios y haz commit siguiendo la convención de mensajes: `feat: added new appointment system`
4. Sube tu rama y crea un Pull Request.


