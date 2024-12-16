import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Desplaza la ventana hacia la parte superior al cambiar de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation(); // Obtiene el pathname actual de la URL

  // Efecto que se ejecuta cada vez que cambia el pathname
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
