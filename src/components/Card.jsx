const Card = ({ image, title, description, buttonText, redirectTo, imageAlt }) => {
    return (
      <div className="flex flex-col md:flex-row shadow-2xl w-full max-w-4xl">
        <img
          src={image}
          alt={imageAlt}
          className="w-full md:w-[450px] object-cover rounded-t-2xl md:rounded-tr-none md:rounded-bl-2xl hidden md:block"
        />
        <div className="flex flex-col items-center justify-center text-center p-10 md:p-20 gap-6 bg-white rounded-2xl md:rounded-tr-2xl md:rounded-br-2xl w-full">
          <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-secondary)]">{title}</h1>
          <p className="text-lg md:text-2xl text-gray-700">{description}</p>
          <button
            onClick={() => window.location.href = redirectTo}
            className="px-6 md:px-10 py-2 text-lg md:text-2xl rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white transition duration-300">
            {buttonText}
          </button>
        </div>
      </div>
    );
  };
  
  export default Card;
  