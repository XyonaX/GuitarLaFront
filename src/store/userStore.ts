import { create } from "zustand";
import axios from "axios";
import { UserType } from "../types/type"; 
import { UserSchema } from "../schema/userSchema"; 

// Define el estado del store de usuarios
type UserState = {
    allUsers: UserType[]; // Lista de todos los usuarios
    isModalOpen: boolean; // Estado del modal
    setIsModalOpen: (open: boolean) => void; // Función para abrir/cerrar el modal
    isEditMode: boolean; // Modo de edición
    setIsEditMode: (edit: boolean) => void; // Cambiar el modo de edición
    loading: boolean; // Estado de carga
    selectedUser: UserType | null; // Usuario seleccionado
    setSelectedUser: (user: UserType | null) => void; // Establecer usuario seleccionado
    fetchAllUsers: () => Promise<void>; // Obtener todos los usuarios
    getOneUser: (userID: UserType["_id"]) => Promise<void>; // Obtener un usuario por ID
    createUser: (userData: UserType) => Promise<void>; // Crear un usuario
    updateUser: (userID: string, userData: UserType) => Promise<void>; // Actualizar un usuario
    deleteUser: (userID: UserType["_id"]) => Promise<void>; // Eliminar un usuario
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useUserStore = create<UserState>((set) => ({
    allUsers: [],
    isModalOpen: false,
    setIsModalOpen: (open) => {set({ isModalOpen: open });
        if (!open) {
          set({ selectedUser: null }); // Limpia el usuario seleccionado al cerrar
        }
    },
    
    isEditMode: false,
    setIsEditMode: (mode) => set({ isEditMode: mode }),
    loading: false,
    selectedUser: null,
    setSelectedUser: (user) => set({ selectedUser: user }),

    // Obtener todos los usuarios
    fetchAllUsers: async () => {
        set({ loading: true });
        try {
            const response = await axios.get(`${BASE_URL}/users/`);
            // Acceder al arreglo de usuarios dentro de la propiedad `data`
            const usersData = response.data.data;
    
            if (Array.isArray(usersData)) {
                try {
                    const validatedUsers = usersData.map((user: UserType) =>
                        UserSchema.parse(user)
                    );
                    set({ allUsers: validatedUsers, loading: false });
                } catch (validationError) {
                    console.error("Error de validación:", validationError);
                    set({ loading: false });
                }
            } else {
                console.error("Los datos de usuarios no son un arreglo:", usersData);
                set({ loading: false });
            }
        } catch (error) {
            console.error("Error buscando usuarios:", error);
            set({ loading: false });
        }
    },    
    
    // Obtener un usuario por ID
    getOneUser: async (userID) => {
        const token = localStorage.getItem("token"); // Obtiene el token de localStorage
        if (!token) {
            console.error("No se encontró el token de autorización.");
            return;
        }
        try {
            const response = await axios.get(`${BASE_URL}/users/${userID}`);
            
            try {
                const validatedUser = UserSchema.parse(response.data);
                set({ selectedUser: validatedUser, loading: false });
            } catch (validationError) {
                console.error("Error de validación:", validationError);
                set({ selectedUser: null, loading: false });
            }
        } catch (error) {
            set({ selectedUser: null });
            console.error(`Error fetching user with ID ${userID}:`, error);
            set({ selectedUser: null, loading: false });
        }
    },    

    // Crear un usuario
    createUser: async (userData) => {
        try {
        const response = await axios.post(`${BASE_URL}/auth/register`, userData);
        const newUser = UserSchema.parse(response.data);
        set((state) => ({ allUsers: [...state.allUsers, newUser] }));
        } catch (error) {
        console.error("Error creating user:", error);
        }
    },

    // Actualizar un usuario
    updateUser: async (userID, userData) => {
        const token = localStorage.getItem("token"); // Obtener el token del localStorage
        
        if (!token) {
            console.error("No se encontró el token de autorización.");
            return; // Detener la ejecución si no hay token
        }

        try {
            const response = await axios.put(
                `${BASE_URL}/users/update/${userID}`,
                { userID, ...userData },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`, // Incluir el token
                    },
                }
            );    
            try {
                const updatedUser = UserSchema.parse(response.data);
                        
                set((state) => ({
                    allUsers: state.allUsers.map((user) =>
                        user._id === updatedUser._id ? updatedUser : user
                    ),
                    selectedUser: null,
                }));
            } catch (validationError) {
                console.error("Error de validación:", validationError);
            }
        } catch (error) {
            console.error(`Error al actualizar usuario con ID ${userID}:`, error);
        }
    },

    // Eliminar un usuario
    deleteUser: async (userID) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token de autorización ausente.");
            return;
        }
    
        try {
            await axios.delete(`${BASE_URL}/users/delete/${userID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set((state) => ({
                allUsers: state.allUsers.filter((user) => user._id !== userID),
            }));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(`Error eliminando usuario con ID ${userID}:`, error.response?.data || error.message);
            } else if (error instanceof Error) {
                console.error(`Error genérico eliminando usuario:`, error.message);
            } else {
                console.error(`Error desconocido:`, error);
            }
        }
    },
}));
