import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

type RegisterFormData = {
    username: string;
    email: string;
    password?: string | null;
    fullName: string;
    role: "admin" | "user";
    status: "activo" | "inactivo";
    _id?: string;
    dateOfBirth?: string | null;
    phone?: string | null;
    address?: string | null;
    createdAt?: string;
};

type RegisterFormProps = {
    user?: RegisterFormData | null; // Permitir que sea null o undefined
    closeModal: () => void;
    onUserChange: () => void;
};

export default function RegisterForm({ user, closeModal, onUserChange }: RegisterFormProps): JSX.Element {
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormData>({
        defaultValues: user || {}, // Si hay un usuario, establecer los valores predeterminados
    });
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        if (user) {
            // Convertir la fecha a formato "yyyy/MM/dd"
            const userWithFormattedDate = {
                ...user,
                dateOfBirth: user.dateOfBirth
                    ? format(new Date(user.dateOfBirth), "yyyy-MM-dd")
                    : null,
            };
            reset(userWithFormattedDate); // Restablecer los valores del formulario con los datos del usuario
        }
    }, [user, reset]);

    const handleRegister = async (data: RegisterFormData) => {
        setMessage(null);

        // Eliminar campos que no deben ser enviados al backend
        const { ...processedData } = data;

        // Formatear la fecha a "yyyy/MM/dd"
        const formattedDate = data.dateOfBirth
        ? format(new Date(data.dateOfBirth), "yyyy/MM/dd")
        : null;


        // Construir el objeto final a enviar
        const finalData = {
            ...processedData,
            dateOfBirth: formattedDate, 
            phone: data.phone || null,
            address: data.address || null,
        };

        try {
            const response = await fetch(`${baseUrl}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setMessage({ text: errorData.message || "Error inesperado.", type: "error" });
                return;
            }

            const responseData = await response.json();
            setMessage({ text: "Usuario registrado con éxito. Por favor, inicia sesión.", type: "success" });

            reset();  // Resetear el formulario después de un registro exitoso
            onUserChange();
            closeModal();
            console.log(responseData);
        } catch (error) {
            console.error("Error en el registro:", error);
            setMessage({ text: "Hubo un problema con la conexión. Por favor, revisa tu red.", type: "error" });
        }
    };

    const handleEditUser = async (data: RegisterFormData) => {
        setMessage(null);
    
        const { ...processedData } = data;
    
        const formattedDate = data.dateOfBirth
        ? format(new Date(data.dateOfBirth), "yyyy/MM/dd")
        : null;

        const finalData = {
            ...processedData,
            dateOfBirth: formattedDate,
            phone: data.phone || null,
            address: data.address || null,
        };
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage({ text: "No se encontró el token de autorización. Por favor, inicia sesión.", type: "error" });
                return; // Detener la ejecución si no hay token
            }

            const response = await fetch(`${baseUrl}/users/update/${data._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(finalData),
            });
    
            if (!response.ok) {
                const contentType = response.headers.get("Content-Type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    setMessage({ text: errorData.message || "Error inesperado", type: "error" });
                } else {
                    const errorText = await response.text();
                    setMessage({ text: errorText || "Error inesperado", type: "error" });
                }
                return;
            }
            setMessage({ text: "Usuario actualizado con éxito.", type: "success" });
            onUserChange();
            closeModal();
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            setMessage({ text: "Hubo un problema con la conexión. Por favor, revisa tu red.", type: "error" });
        }
    };    

    const onSubmit = (data: RegisterFormData) => {
        if (user && user._id) {
            // Si el usuario tiene un _id, estamos editando un usuario existente
            handleEditUser(data);
        } else {
            // Si no, estamos registrando un nuevo usuario
            handleRegister(data);
        }
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

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Usuario
                    </label>
                    <input
                        id="username"
                        {...register("username", { required: "El nombre de usuario es obligatorio" })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                    />
                    {errors.username && (
                        <span className="text-red-500 text-sm">{errors.username.message}</span>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Nombre completo
                    </label>
                    <input
                        id="fullName"
                        {...register("fullName", { required: "El nombre completo es obligatorio" })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                    />
                    {errors.fullName && (
                        <span className="text-red-500 text-sm">{errors.fullName.message}</span>
                    )}
                </div>

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

                <div className="mb-4">
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                        Fecha de nacimiento (opcional)
                    </label>
                    <input
                        id="dateOfBirth"
                        type="date"
                        {...register("dateOfBirth")}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Teléfono (opcional)
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Dirección (opcional)
                    </label>
                    <input
                        id="address"
                        {...register("address")}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full text-lg text-white bg-orange-600 font-bold uppercase py-2 px-4 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300"
                >
                    {user ? "Actualizar Usuario" : "Registrarse"}
                </button>
            </form>
        </div>
    );
}
