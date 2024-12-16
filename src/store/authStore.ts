import { create } from "zustand";
import axios from "axios";

interface AuthState {
  role: string | null;
  token: string | null;
  userID: string | null;
  setRole: (role: string | null) => void;
  setToken: (token: string | null) => void;
  setUserID: (userID: string | null) => void;
  logout: () => void;
}

const decodeJWT = (token: string): any | null => {
  try {
    const payload = token.split(".")[1]; // Obtiene la parte del payload
    const decodedPayload = atob(payload); // Decodifica de Base64 a texto
    return JSON.parse(decodedPayload); // Convierte el texto JSON a un objeto
  } catch (error) {
    console.error("Error al decodificar el JWT:", error);
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el token
    const expirationTime = payload.exp * 1000; // El campo `exp` está en segundos, convierte a milisegundos
    return Date.now() > expirationTime; // Verifica si ya pasó la expiración
  } catch {
    return true; // Si algo falla, se asume que el token ha expirado
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  role: localStorage.getItem("role"),
  setRole: (role) => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
    set({ role });
  },
  token: localStorage.getItem("token"),
  userID: (() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJWT(token);
      return decoded?.id || null; // Asegúrate de que "userID" exista en el payload
    }
    return null;
  })(),
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
      const decoded = decodeJWT(token);
      set({ userID: decoded?.id || null }); // Actualiza userID con el valor del token
    } else {
      localStorage.removeItem("token");
      set({ userID: null });
    }
    set({ token });
  },
  setUserID: (userID) => {
    if (userID) {
      localStorage.setItem("userID", userID);
    } else {
      localStorage.removeItem("userID");
    }
    set({ userID });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    set({ token: null, role: null, userID: null });
  },
}));

// Interceptores de Axios
axios.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();

  if (token) {
    if (isTokenExpired(token)) {
      console.warn("Token expirado. Cerrando sesión.");
      useAuthStore.getState().logout();
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});
