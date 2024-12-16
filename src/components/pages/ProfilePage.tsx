import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useAuthStore } from "../../store/authStore";
import { useUserStore } from "../../store/userStore";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "../LoadingSpinner"; 

export default function ProfilePage() {
    const { userID } = useAuthStore();
    const { getOneUser, selectedUser, updateUser, loading } = useUserStore(); 

    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // Estado local para manejar los valores editables
    const [formData, setFormData] = useState({
        fullName: "",
        dateOfBirth: "",
        phone: "",
        address: "",
    });

    // Cargar el usuario al inicio
    useEffect(() => {
        if (userID) {
            getOneUser(userID).catch((error) => console.error("Error al obtener el usuario:", error));
        }
    }, [userID, getOneUser]);

    useEffect(() => {
        if (selectedUser) {
            // Inicializar el estado local con los valores del usuario
            setFormData({
                fullName: selectedUser.fullName || "",
                dateOfBirth: selectedUser.dateOfBirth ? format(new Date(selectedUser.dateOfBirth), "yyyy-MM-dd") : "",
                phone: selectedUser.phone || "",
                address: selectedUser.address || "",
            });
        }
    }, [selectedUser]);

    // Habilitar/deshabilitar la edición
    const handleEnableEditing = () => {
        setIsEditing(true);
    };

    // Manejar los cambios en los campos editables
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Función para actualizar el perfil
    const handleUpdateUser = async () => {
        if (!selectedUser) return;

        const userData = {
            ...selectedUser,
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth,
            phone: formData.phone,
            address: formData.address,
        };

        // Actualizar usuario
        await updateUser(userID!, userData);

        // Recargar los datos del usuario actualizado
        await getOneUser(userID!);

        // Cambiar a modo de solo lectura y mostrar mensaje de éxito
        setIsEditing(false);
        setMessage({ text: "Perfil actualizado correctamente", type: "success" });
    };

    return (
        <div className="container mx-auto py-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4">Mi Perfil</h1>
            {message && (
                <div className={`mb-4 p-2 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {message.text}
                </div>
            )}
            {loading ? (
                <LoadingSpinner />
            ) : selectedUser ? (
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nombre de Usuario:</label>
                        <input
                            type="text"
                            value={selectedUser.username}
                            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico:</label>
                        <input
                            type="email"
                            value={selectedUser.email}
                            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nombre completo:</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            readOnly={!isEditing}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Fecha de Nacimiento:</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            readOnly={!isEditing}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono:</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            readOnly={!isEditing}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Dirección:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            readOnly={!isEditing}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end mb-4">
                        <button
                            type="button"
                            className="flex items-center text-blue-600"
                            onClick={handleEnableEditing} // Habilita la edición
                        >
                            <PencilSquareIcon className="w-5 h-5 mr-2" />
                            Editar Perfil
                        </button>
                    </div>

                    {/* Botón para guardar los cambios */}
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleUpdateUser}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Guardar Cambios
                        </button>
                    )}
                </div>
            ) : (
                <p>No se encontró información del usuario.</p>
            )}
        </div>
    );
}
