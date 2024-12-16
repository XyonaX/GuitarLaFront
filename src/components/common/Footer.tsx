import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaCcVisa, FaCcMastercard, FaPaypal } from "react-icons/fa";
import { SiMercadopago, SiGooglepay } from "react-icons/si";
import { MdLocalShipping } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-orange-600 text-white py-6 mt-auto w-full">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 justify-items-center">
        {/* Enlaces de Navegación */}
        <div className="text-left">
          <h4 className="text-lg font-semibold mb-2">Navegación</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/products" className="text-sm hover:underline">
                Productos
              </Link>
            </li>
            <li>
              <Link to="/blogs" className="text-sm hover:underline">
                Blogs
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm hover:underline">
                Contáctanos
              </Link>
            </li>
          </ul>
        </div>

        {/* Medios de Pago y Envío */}
        <div className="text-left">
          <h4 className="text-lg font-semibold mb-2">Medios de Pago y Envío</h4>
          <div className="flex space-x-4 items-center">
            <FaCcVisa size={24} />
            <FaCcMastercard size={24} />
            <SiMercadopago size={24} />
            <FaPaypal size={24} />
            <SiGooglepay size={24} />
          </div>
          <div className="mt-4">
            <h5 className="text-sm font-semibold">Formas de Envío:</h5>
            <div className="flex space-x-4 items-center mt-2">
              <MdLocalShipping size={24} />
              <span className="text-sm">Correo Argentino</span>
              <span className="text-sm">Andreani</span>
            </div>
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="text-left">
          <h4 className="text-lg font-semibold mb-2">Contacto</h4>
          <p className="text-sm">Email: soporte@example.com</p>
          <p className="text-sm">Teléfono: +1 (123) 456-7890</p>
          <div className="mt-3 flex space-x-4">
            <a href="https://www.facebook.com" target="_blank" className="hover:text-gray-300">
              <FaFacebook size={24} />
            </a>
            <a href="https://www.instagram.com" target="_blank" className="hover:text-gray-300">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>

        {/* Mi Cuenta */}
        <div className="text-left">
          <h4 className="text-lg font-semibold mb-2">Mi Cuenta</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/login" className="text-sm hover:underline">
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-sm hover:underline">
                Registrarse
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 border-t border-orange-500 pt-4 text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Guitar LA E-commerce. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
