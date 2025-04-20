const Card = ({ image, title, description, buttonText, redirectTo, imageAlt }) => {
  return (
    <div className="flex flex-col md:flex-row shadow-2xl w-full max-w-4xl rounded-2xl overflow-hidden bg-white">
      {/* Imagen - siempre visible en desktop, oculta en móvil */}
      <div className="hidden md:block md:w-2/5">
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Contenido */}
      <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 gap-6 w-full md:w-3/5">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-secondary)]">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-700">
          {description}
        </p>
        <button
          onClick={() => (window.location.href = redirectTo)}
          className="px-8 py-3 text-xl md:text-2xl rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white transition duration-300 mt-4"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Card;