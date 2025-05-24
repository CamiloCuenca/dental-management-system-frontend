import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Edit } from "lucide-react";

const FormularioEditarProducto = () => {
    const navigate = useNavigate();

    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        cantidad_disponible: '',
        tipo_producto: '',
        estado: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({
            ...producto,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Producto enviado:", producto);
        // Aquí enviar datos al backend
    };

    return (
        <section className="pt-12 pb-12 flex flex-col items-center justify-center px-6 md:px-12">
            <div className="shadow-2xl w-full max-w-3xl p-10 bg-white rounded-2xl border border-gray-200">
                <div className="mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[var(--color-secondary)] hover:underline text-lg mb-4"
                        type="button"
                    >
                        <FaArrowLeft /> Volver
                    </button>
                    <h2 className="text-3xl font-extrabold text-[var(--color-secondary)] text-center">
                        Editar Producto
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Nombre */}
                    <div className="flex flex-col">
                        <label htmlFor="nombre" className="text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            value={producto.nombre}
                            onChange={handleChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                        />
                    </div>

                    {/* Descripción */}
                    <div className="flex flex-col">
                        <label htmlFor="descripcion" className="text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                        <input
                            id="descripcion"
                            name="descripcion"
                            type="text"
                            value={producto.descripcion}
                            onChange={handleChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                        />
                    </div>

                    {/* Cantidad Disponible */}
                    <div className="flex flex-col">
                        <label htmlFor="cantidad_disponible" className="text-sm font-semibold text-gray-700 mb-1">Cantidad Disponible</label>
                        <input
                            id="cantidad_disponible"
                            name="cantidad_disponible"
                            type="number"
                            value={producto.cantidad_disponible}
                            onChange={handleChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                        />
                    </div>

                    {/* Tipo de Producto */}
                    <div className="flex flex-col">
                        <label htmlFor="tipo_producto" className="text-sm font-semibold text-gray-700 mb-1">Tipo de Producto</label>
                        <select
                            id="tipo_producto"
                            name="tipo_producto"
                            value={producto.tipo_producto}
                            onChange={handleChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                        >
                            <option value="">-- Seleccione Tipo de Producto --</option>
                            <option value="MATERIAL_DESECHABLE">MATERIAL DESECHABLE</option>
                            <option value="INSTRUMENTAL_QUIRURGICO">INSTRUMENTAL QUIRÚRGICO</option>
                            <option value="FARMACO">FÁRMACO</option>
                            <option value="EQUIPO_MEDICO">EQUIPO MÉDICO</option>
                            <option value="MATERIAL_RADIOLOGICO">MATERIAL RADIOLÓGICO</option>
                            <option value="MATERIAL_ORTODONCICO">MATERIAL ORTODÓNCICO</option>
                            <option value="MATERIAL_PROTESICO">MATERIAL PROTÉSICO</option>
                            <option value="MATERIAL_ENDODONCICO">MATERIAL ENDODÓNCICO</option>
                            <option value="PRODUCTO_LIMPIEZA">PRODUCTO DE LIMPIEZA</option>
                            <option value="CONSUMIBLE_ADMINISTRATIVO">CONSUMIBLE ADMINISTRATIVO</option>
                        </select>
                    </div>

                    {/* Estado */}
                    <div className="flex flex-col">
                        <label htmlFor="estado" className="text-sm font-semibold text-gray-700 mb-1">Estado</label>
                        <select
                            id="estado"
                            name="estado"
                            value={producto.estado}
                            onChange={handleChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                        >
                            <option value="">-- Seleccione Estado --</option>
                            <option value="DISPONIBLE">DISPONIBLE</option>
                            <option value="AGOTADO">AGOTADO</option>
                            <option value="RESERVADO">RESERVADO</option>
                            <option value="VENCIDO">VENCIDO</option>
                            <option value="DAÑADO">DAÑADO</option>
                            <option value="ELIMINADO">ELIMINADO</option>
                            <option value="EN_REPOSICION">EN REPOSICIÓN</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 flex justify-center">
                        <button
                            type="submit"
                            className="w-[200px] py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Edit size={16} />
                            Editar Producto
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default FormularioEditarProducto;
