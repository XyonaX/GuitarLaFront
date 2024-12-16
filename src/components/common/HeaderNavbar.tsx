import Navlink from "./HeaderNavlink";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Bars2Icon,
  ShoppingCartIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

const navlinks = [
  { path: "/", pageName: "Inicio" },
  { path: "/about_us", pageName: "Nosotros" },
  { path: "/products", pageName: "Tienda" },
  { path: "/blogs", pageName: "Blogs" },
  { path: "/contact", pageName: "Contacto" },
];

export default function HeaderNavbar() {
  const { role, setRole, setToken } = useAuthStore();
  const {
    cart,
    removeFromCart,
    clearCart,
    loadCart,
    increaseQuantity,
    decreaseQuantity,
    showWarning,
    setShowWarning,
  } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const hasItemsInCart = cart.length > 0;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLoginMenu = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  const toggleCartMenu = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setIsCartOpen(!isCartOpen);
  };

  const handlePurchase = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesion para realizar la compra");
      navigate("/login");
      return;
    }
    setIsCartOpen(false); // Cierra el carrito
    navigate("/checkout");
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false); // Cierra el modal
    setRole(null);
    setToken(null);
    clearCart();
    navigate("/login");
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadCart(); // Carga el carrito del usuario actual
    }
  }, [localStorage.getItem("token")]); // Reaccionar a cambios en el token

  useEffect(() => {
    setIsLoginOpen(false);
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !(event.target instanceof Element) || // Asegura que event.target sea un Elemento
        (!event.target.closest(".cart") &&
          !event.target.closest(".toggle-cart"))
      ) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isCartOpen]);

  return (
    <div>
      <header
        className={`relative bg-[url('/header.jpg')] bg-cover ${
          location.pathname === "/" ? "h-screen overflow-hidden" : "h-full"
        }  bg-no-repeat py-4 px-8 `}
      >
        <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
        {/* Navigation */}
        <div className="flex items-center justify-between container mx-auto py-4 z-10">
          <div className="z-10">
            <Link to="/">
              <img src="/logo.svg" alt="Logo Guitar LA" className="h-16" />
            </Link>
          </div>

          {/* Menu Toggle Button */}
          <div className="flex items-center">
            <div className="flex lg:hidden items-center justify-center">
              <button
                className="block lg:hidden text-white focus:outline-none z-40 cart"
                onClick={toggleMenu}
              >
                {isOpen ? (
                  <span className=" text-red-400">X</span>
                ) : (
                  <span className="">
                    <Bars2Icon className="h-8 w-8" />
                  </span>
                )}
              </button>
            </div>
            {/* Navigation Links */}
            <div className="flex gap-8">
              <nav className={`hidden lg:flex`}>
                <ul className="flex items-center justify-between gap-4">
                  {navlinks.map((navlink) => (
                    <Navlink
                      key={navlink.pageName}
                      path={navlink.path}
                      pageName={navlink.pageName}
                    />
                  ))}
                </ul>
              </nav>
              <div className={`${isOpen ? "hidden d-none" : "flex gap-4"}`}>
                <div className="flex relative">
                  <button
                    type="button"
                    className="z-10 cursor-pointer"
                    onClick={toggleCartMenu}
                  >
                    {hasItemsInCart ? (
                      <ShoppingCartIcon className=" h-8 w-8 text-green-500" />
                    ) : (
                      <ShoppingCartIcon className="h-8 w-8 text-white" />
                    )}
                  </button>
                  {isCartOpen && (
                    <div
                      className="cart absolute right-0 top-full bg-white shadow-lg w-96 rounded-lg p-4 z-20"
                      onClick={(e) => e.stopPropagation()} // Evitar cerrar al interactuar dentro
                    >
                      {/* Botón para cerrar el carrito */}
                      <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-black"
                        onClick={() => setIsCartOpen(false)}
                      >
                        ✕
                      </button>
                      {cart.length === 0 ? (
                        <div className="py-6 border-b-2 border-b-slate-300">
                          <p className="text-lg text-center">
                            No hay productos en el carrito.
                          </p>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg text-center font-bold">
                            Carrito de compras
                          </h3>
                          <table className="w-auto">
                            {/* <thead>
                              <tr className="flex items-center justify-between gap-6 border-b-2 border-b-slate-200 pb-3">
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th className="text-transparent">...</th>
                              </tr>
                            </thead> */}
                            <tbody className="">
                              {cart.map((item) => (
                                <tr
                                  className="flex items-center justify-between gap-4 px-2 border-b-2 border-b-slate-200 p-2"
                                  key={item._id}
                                >
                                  <td>
                                    <img
                                      src={`${item.imageUrl}`}
                                      alt=""
                                      className="w-6"
                                    />
                                  </td>
                                  <td className="text-sm font-bold text-nowrap">
                                    <p>{item.productName}</p>
                                  </td>
                                  <td>
                                    <p>${item.price * item.quantity}</p>
                                  </td>
                                  <td className="flex gap-2">
                                    <button
                                      onClick={() => decreaseQuantity(item._id)}
                                    >
                                      -
                                    </button>
                                    <p>{item.quantity}</p>
                                    <button
                                      onClick={() => increaseQuantity(item._id)}
                                    >
                                      +
                                    </button>
                                  </td>
                                  <td>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Evita cerrar el carrito
                                        handleRemoveFromCart(item._id);
                                      }}
                                    >
                                      <TrashIcon className="text-red-600 h-6 w-6" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {showWarning && (
                            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                              <div className="bg-white p-6 rounded shadow-lg">
                                <p className="text-lg">
                                  Has alcanzado el máximo permitido de 5
                                  unidades por guitarra.
                                </p>
                                <button
                                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                  onClick={() => setShowWarning(false)}
                                >
                                  Cerrar
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div className="mt-4">
                        <h4 className="mb-2">
                          Total: ${totalPrice.toFixed(2)}
                        </h4>
                        <div className="flex justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Evita cerrar el carrito
                              handlePurchase();
                            }}
                            className={`${
                              cart.length === 0
                                ? "bg-orange-500/50 "
                                : "bg-orange-600 hover:bg-orange-500/90"
                            } mt-2  text-white py-2 px-4 rounded-md text-sm transition-all duration-300`}
                            disabled={cart.length === 0}
                          >
                            Comprar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Evita cerrar el carrito
                              handleClearCart();
                            }}
                            className="mt-2 bg-red-600 text-white py-2 px-4 rounded-md text-sm transition-all duration-300 hover:bg-red-500/90"
                          >
                            Vaciar Carrito
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex relative">
                  <button
                    type="button"
                    className="z-10"
                    onClick={toggleLoginMenu}
                  >
                    <img
                      src="/login-register.png"
                      alt="Icono del login-register"
                      className="h-8 w-8cursor-pointer relative"
                    />
                  </button>
                  <div
                    className={`${
                      isLoginOpen ? "opacity-100 block" : "opacity-0 hidden"
                    } absolute top-10 right-0 bg-white py-1 px-6 transition-opacity duration-150 z-10`}
                  >
                    {role === "admin" ? (
                      <>
                        <Link
                          to="/dashboard/DashBoardUsers"
                          className="block text-black py-1 border-b-2 border-b-slate-300"
                        >
                          Administrar Usuarios
                        </Link>
                        <Link
                          to="/DashboardProducts"
                          className="block text-black py-1 border-b-2 border-b-slate-300"
                        >
                          Administrar Productos
                        </Link>
                        <Link
                          to="/DashboardBlogs"
                          className="block text-black py-1 border-b-2 border-b-slate-300"
                        >
                          Administrar Blogs
                        </Link>
                        <Link
                          to="#"
                          className="block text-black py-1"
                          onClick={() => setIsLogoutModalOpen(true)}
                        >
                          Logout
                        </Link>
                      </>
                    ) : role === "user" ? (
                      <>
                        <Link
                          to="/my_orders"
                          className="block text-black py-1 border-b-2 border-b-slate-300"
                        >
                          Mis Pedidos
                        </Link>
                        <Link
                          to="/profile"
                          className="block text-black py-1 border-b-2 border-b-slate-300"
                        >
                          Perfil
                        </Link>
                        <Link
                          to="#"
                          className="block text-black py-1"
                          onClick={() => setIsLogoutModalOpen(true)}
                        >
                          Logout
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block text-black py-1 border-b-2 border-b-slate-300"
                        >
                          Login
                        </Link>
                        <Link to="/register" className="block text-black py-1">
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden flex items-center justify-center absolute h-screen right-0 top-0 w-80 bg-white bg-opacity-90 p-4 z-20">
            <ul className="flex flex-col items-center gap-8 lg:gap-4">
              {navlinks.map((navlink) => (
                <Navlink
                  key={navlink.pageName}
                  path={navlink.path}
                  pageName={navlink.pageName}
                />
              ))}
            </ul>
          </div>
        )}
        {location.pathname === "/" && (
          <>
            <div>
              <div className="container mx-auto relative">
                <div className="xl:max-w-3xl 2xl:max-w-5xl mx-auto lg:mx-0 py-28 z-10 text-center lg:text-start">
                  <h2 className="text-5xl text-white font-bold mb-6">
                    Tu pasión por la música merece la guitarra perfecta para
                    brillar.
                  </h2>
                  <p className="text-xl text-white mb-8">
                    Explora nuestra colección y encuentra el sonido que te
                    define.
                  </p>
                  <Link to="/products">
                    <button
                      type="button"
                      className="text-lg text-white bg-orange-700 font-bold uppercase py-2 px-4 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300"
                    >
                      Compra ahora
                    </button>
                  </Link>
                </div>
              </div>
              <div className="hidden h-screen lg:flex">
                <img
                  src="/header-guitarra.png"
                  alt=""
                  className={`transition-opacity duration-300 ease-in-out ${
                    isVisible ? " opacity-100" : " opacity-0"
                  } absolute bottom-0 -right-10`}
                />
              </div>
            </div>
          </>
        )}
      </header>
      {/* Modal de confirmación */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">
              ¿Estás seguro de que deseas cerrar sesión?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-800 hover:text-white transition-all duration-300"
                onClick={handleLogout}
              >
                Sí
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
