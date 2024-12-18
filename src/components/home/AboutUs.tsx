// src/components/home/AboutUs.tsx
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="w-10/12 mx-auto my-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen lg:h-[500px]">
        {/* Sección de Imagen */}
        <div className="h-full">
          <img
            src="/nosotros.jpg"
            alt="Sobre nosotros"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Sección de Texto */}
        <div className="flex flex-col justify-between bg-orange-600 py-12 px-6 sm:px-8 lg:px-16 h-full overflow-y-auto">
          <div>
            <h2 className="text-4xl text-white font-bold italic mb-6">¿Quiénes Somos?</h2>
            <p className="text-white text-lg mb-6">
              En Guitar LA, somos un equipo de músicos apasionados por la guitarra y la música. Desde nuestra fundación, nos hemos dedicado a ofrecer guitarras y accesorios de alta calidad para todos aquellos que, como nosotros, viven la música. Ya sea que estés comenzando tu viaje musical o seas un profesional experimentado, nuestra misión es brindarte las herramientas para llevar tu música al siguiente nivel.
            </p>
          </div>

          {/* Llamada a la acción */}
          <div className="flex flex-col lg:flex-row justify-between items-center mt-auto space-y-4 lg:space-y-0 lg:space-x-4">
            <Link to="/about_us_page" className="flex justify-end w-full lg:w-auto">
              <button
                type="button"
                className="uppercase font-bold bg-transparent border border-white text-white px-6 py-3 hover:bg-white hover:text-orange-600 transition duration-300 rounded-xl w-full lg:w-auto"
              >
                Más información
              </button>
            </Link>
            <Link to="/contact" className="flex justify-end w-full lg:w-auto">
              <button
                type="button"
                className="uppercase font-bold bg-transparent border border-white text-white px-6 py-3 hover:bg-white hover:text-orange-600 transition duration-300 rounded-xl w-full lg:w-auto"
              >
                Contáctanos
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
