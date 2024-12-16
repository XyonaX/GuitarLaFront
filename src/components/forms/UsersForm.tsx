import { useForm } from "react-hook-form"; 
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import { FaGoogle } from 'react-icons/fa';
import { useCartStore } from "../../store/cartStore";
import Swal from "sweetalert2";

type LoginFormData = {
  email: string;
  password: string;
};

export default function UsersForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const { setRole, setToken } = useAuthStore();
  const { loadCart } = useCartStore();

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleLogin = async (data: LoginFormData) => {
    setMessage(null); // Reinicia el mensaje al intentar iniciar sesión

    try {
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            // Usa el mensaje del servidor si está disponible
            const errorMessage = responseData.message || "Ocurrió un error inesperado. Intenta más tarde.";
            setMessage({ text: errorMessage, type: "error" });
            return;
        }
        
        // Almacena el token y el rol en el store
        setToken(responseData.token);
        setRole(responseData.user.role);

        // Carga el carrito si el usuario está autenticado
        loadCart();

        // Muestra mensaje de éxito y redirige al inicio luego de un inicio de sesión exitoso
        setMessage({ text: "Inicio de sesión exitoso.", type: "success" });
        navigate('/');
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Login exitoso"
        });
    } catch (error) {
        console.error(error);
        setMessage({ text: "Hubo un problema con la conexión. Revisa tu red e intenta nuevamente.", type: "error" });
    }
  };

  const handleGoogleLogin = async () => {
    // Redirigir al usuario al endpoint de Google
    window.location.href = `${baseUrl}/auth/google`;
  };
    
    return (
    <div className="p-4 border rounded-md shadow-md bg-white max-w-md mx-auto">
      {message && (
        <div
          className={`p-2 mb-4 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "El correo es obligatorio" })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "La contraseña es obligatoria" })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full text-lg text-white bg-orange-600 font-bold uppercase py-2 px-4 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300"
        >
          Iniciar sesión
        </button>
      </form>
      <div className="text-center mt-4">
        <p className="text-gray-600 mb-4">O inicia sesión con:</p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300"
        >
          <FaGoogle className="w-6 h-6 mr-2" />
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}
