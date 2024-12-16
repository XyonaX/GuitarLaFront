import { create } from "zustand";
import axios from "axios";

const BASE_EMAIL_URL = import.meta.env.VITE_BASE_EMAIL_URL;

type EmailState = {
  userEmail: string;
  setUserEmail: (email: string) => void;
  sendEmail: (data: {
    userEmail: string;
    subject: string;
    text: string;
  }) => Promise<void>;
};

const useEmailStore = create<EmailState>((set) => ({
  userEmail: "",
  setUserEmail: (email) => set({ userEmail: email }),
  sendEmail: async (data) => {
    try {
      const response = await axios.post(`${BASE_EMAIL_URL}`, data);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Si el error es un error de Axios, puedes acceder a sus propiedades
        throw new Error(
          error.response?.data?.message || "Error al enviar el email"
        );
      } else {
        // Si no es un error de Axios, lanza un error genérico
        throw new Error("Error desconocido");
      }
    }
  },
}));

export default useEmailStore;
