import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen lg:h-[600px]">
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
          <p className="text-white text-lg mb-6">
            Creemos que cada guitarra tiene una historia única que contar. En Guitar LA, te ofrecemos una experiencia completa, desde la compra de tu primer instrumento hasta el asesoramiento experto para mejorar tu técnica. Nos enorgullece ser un puente entre tu pasión y tu progreso musical.
          </p>
        </div>

        {/* Misión y Visión */}
        <div className="bg-white text-orange-600 p-6 rounded-lg mb-6">
          <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
          <p className="text-lg mb-4">
            Nuestra misión es ofrecer los mejores instrumentos y accesorios musicales, creando una comunidad donde todos los guitarristas puedan encontrar el equipo adecuado para crecer, aprender y disfrutar de su arte.
          </p>
          <h3 className="text-2xl font-bold mb-4">Nuestra Visión</h3>
          <p className="text-lg">
            Ser la tienda de guitarras preferida en nuestra región, ofreciendo no solo productos de calidad, sino también un servicio al cliente excepcional y una experiencia que inspire y acompañe a los músicos en cada etapa de su carrera.
          </p>
        </div>

        {/* Valores */}
        <div className="bg-white text-orange-600 p-6 rounded-lg mb-6">
          <h3 className="text-2xl font-bold mb-4">Nuestros Valores</h3>
          <ul className="list-disc pl-6">
            <li className="text-lg mb-2">Pasión por la música: Vivimos y respiramos música todos los días.</li>
            <li className="text-lg mb-2">Compromiso con la calidad: Solo trabajamos con marcas y productos de confianza.</li>
            <li className="text-lg mb-2">Atención al cliente personalizada: Nos importa cada uno de nuestros clientes.</li>
            <li className="text-lg mb-2">Innovación: Siempre estamos buscando las últimas tendencias y avances en el mundo de las guitarras.</li>
          </ul>
        </div>

        {/* Llamada a la acción */}
        <div className="flex justify-between items-center mt-auto">
          <Link to="/about_us" className="flex justify-end">
            <button
              type="button"
              className="uppercase font-bold bg-transparent border border-white text-white px-6 py-3 hover:bg-white hover:text-orange-600 transition duration-300 rounded-xl"
            >
              Más información
            </button>
          </Link>
          <Link to="/contact" className="flex justify-end">
            <button
              type="button"
              className="uppercase font-bold bg-transparent border border-white text-white px-6 py-3 hover:bg-white hover:text-orange-600 transition duration-300 rounded-xl"
            >
              Contáctanos
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
