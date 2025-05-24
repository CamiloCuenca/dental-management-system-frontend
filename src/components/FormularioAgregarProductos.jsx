import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const FormularioAgregarProducto = () => {
    const navigate = useNavigate();

    const hoy = new Date().toISOString().slice(0, 10);

    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        cantidad_disponible: '',
        cantidad_minima: '',
        es_esterilizable: false,
        estado: '',
        fecha_registro: hoy,
        fecha_ultimo_abastecimiento: '',
        fecha_vencimiento: '',
        precio_unitario: '',
        tipo_producto: '',
        vida_util_esterilizacion: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProducto({
            ...producto,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Producto enviado:", producto);
        // Aquí enviar datos al backend
    };

    return (
        <section className="pt-12 pb-12 flex flex-col items-center justify-center px-6 md:px-12">
            <div className="shadow-2xl w-full max-w-5xl p-10 bg-white rounded-2xl border border-gray-200">
                <div className="mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[var(--color-secondary)] hover:underline text-lg mb-4"
                        type="button"
                    >
                        <FaArrowLeft /> Volver
                    </button>
                    <h2 className="text-3xl font-extrabold text-[var(--color-secondary)] text-center">
                        Agregar Nuevo Producto
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[ 
                        { name: "nombre", label: "Nombre", type: "text" },
                        { name: "descripcion", label: "Descripción", type: "text" },
                        { name: "cantidad_disponible", label: "Cantidad Disponible", type: "number" },
                        { name: "cantidad_minima", label: "Cantidad Mínima", type: "number" },
                        { name: "precio_unitario", label: "Precio Unitario", type: "number" },
                        { name: "vida_util_esterilizacion", label: "Vida Útil Esterilización (días)", type: "number" },
                    ].map(({ name, label, type }) => (
                        <div key={name} className="flex flex-col">
                            <label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
                            <input
                                id={name}
                                name={name}
                                type={type}
                                value={producto[name]}
                                onChange={handleChange}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
                            />
                        </div>
                    ))}

                    {/* Select para tipo_producto */}
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

                    {/* Select para estado */}
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

                    {[ 
                        { name: "fecha_registro", label: "Fecha de Registro", readOnly: true },
                        { name: "fecha_ultimo_abastecimiento", label: "Fecha Último Abastecimiento" },
                        { name: "fecha_vencimiento", label: "Fecha de Vencimiento" },
                    ].map(({ name, label, readOnly }) => (
                        <div key={name} className="flex flex-col">
                            <label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
                            <input
                                id={name}
                                name={name}
                                type="date"
                                value={producto[name]}
                                onChange={handleChange}
                                readOnly={readOnly}
                                className={`px-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    ))}

                    <div className="md:col-span-2 flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="es_esterilizable"
                            id="es_esterilizable"
                            checked={producto.es_esterilizable}
                            onChange={handleChange}
                            className="h-5 w-5 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
                        />
                        <label htmlFor="es_esterilizable" className="text-sm font-medium text-gray-800">
                            ¿Es Esterilizable?
                        </label>
                    </div>

                    <div className="md:col-span-2 flex justify-center">
                        <button
                            type="submit"
                            className="w-[200px] py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white font-semibold text-base rounded-xl transition-all"
                        >
                            + Guardar Producto
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default FormularioAgregarProducto;
