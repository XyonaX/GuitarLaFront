import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import { useUserStore } from "../../store/userStore"; 
import { useAuthStore } from "../../store/authStore"; 
import { useState, useEffect, Fragment } from "react";
import { UserType } from "../../types/type";
import { 
  Dialog, 
  Transition, 
  DialogPanel, 
  DialogTitle, 
  TransitionChild } from "@headlessui/react";
import UserModal from "../modals/UserModal"; // Modal para crear/editar usuarios
import Pagination from "../../utilities/Pagination";
import LoadingSpinner from "../LoadingSpinner";

export default function DashboardUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const fetchAllUsers = useUserStore((state) => state.fetchAllUsers);
  const users = useUserStore((state) => state.allUsers);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const { setIsModalOpen, setIsEditMode, loading } = useUserStore();
  const [userToChangeStatus, setUserToChangeStatus] = useState<UserType | null>(null);
  const [userToChangeRole, setUserToChangeRole] = useState<UserType | null>(null);
  
  // Obtenemos el userID del usuario en sesión
  const { userID } = useAuthStore();

  // Estado para el modal de confirmación
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmStatusChangeOpen, setIsConfirmStatusChangeOpen] = useState(false);
  const [isConfirmRoleChangeOpen, setIsConfirmRoleChangeOpen] = useState(false);
  
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);
  
  const handleEditClick = (user: UserType) => {
    setSelectedUser(user); // Establece el usuario seleccionado
    setIsEditMode(true); // Activa el modo de edición
    setIsModalOpen(true); // Abre el modal
  };
  
  const handleCreateClick = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setUserIdToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userIdToDelete) {
      await deleteUser(userIdToDelete);
      await fetchAllUsers();
      setIsConfirmDeleteOpen(false);
      setUserIdToDelete(null);
    }
  };

  const handleStatusChangeClick = (user: UserType) => {
    setUserToChangeStatus(user);
    setIsConfirmStatusChangeOpen(true);
  };

  const confirmStatusChange = async (newStatus: string) => {
    if (userToChangeStatus) {
      const userToUpdate = {
        ...userToChangeStatus,
        status: newStatus === "activo" || newStatus === "inactivo" ? (newStatus as "activo" | "inactivo") : "activo",
      };
  
      if (userToUpdate._id) {
        try {
          await updateUser(userToUpdate._id, userToUpdate); // Actualiza el usuario
          await fetchAllUsers(); // Refresca la lista de usuarios
          setIsConfirmStatusChangeOpen(false); // Cierra el modal
          setUserToChangeStatus(null); // Limpia el estado
        } catch (error) {
          console.error("Error al actualizar el estado del usuario:", error);
        }
      } else {
        console.error("El ID del usuario no está definido.");
      }
    }
  };
  
  const handleRoleChangeClick = (user: UserType) => {
    setUserToChangeRole(user);
    setIsConfirmRoleChangeOpen(true);
  };
  
  const confirmRoleChange = async (newRole: string) => {
      if (userToChangeRole) {
      const userToUpdate = {
        ...userToChangeRole,
        role: newRole === "user" || newRole === "admin" ? (newRole as "user" | "admin") : "user",
      };
  
      if (userToUpdate._id) {
        try {
          await updateUser(userToUpdate._id, userToUpdate); // Actualiza el usuario
          await fetchAllUsers(); // Refresca la lista de usuarios
          setIsConfirmRoleChangeOpen(false); // Cierra el modal
          setUserToChangeRole(null); // Limpia el estado
        } catch (error) {
          console.error("Error al cambiar el rol del usuario:", error);
        }
      }else {
        console.error("El ID del usuario no está definido.");
      }
    }
  };
  
  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  // Calcula los usuarios a mostrar en la página actual
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const reversedUsers = [...filteredUsers].reverse();
  const currentUsers = reversedUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(users.length / itemsPerPage);
    
  return (
    <div className="py-16 px-8 overflow-x-auto">
      <h2 className="text-4xl text-center text-orange-600 mb-12 font-bold min-w-full border border-collapse mx-auto">
        Dashboard de usuarios
      </h2>

      <div className="mb-6 flex justify-center">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Buscar usuarios por nombre, usuario o email..."
            className="border border-gray-300 rounded-full px-4 py-2 w-full pr-10 shadow-sm focus:ring-2 focus:ring-orange-600 focus:outline-none transition duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
      </div>

      <button onClick={handleCreateClick}>
        <PlusIcon className="fixed bottom-4 right-4 h-12 text-white bg-blue-600 rounded-full" />
      </button>
      {loading ? (
        <LoadingSpinner />
      ) : (
      <>
      <table className="min-w-full border border-collapse mx-auto">
        <thead>
          <tr className="bg-gray-300">
            <th className="border border-slate-200 py-4">Nombre completo</th>
            <th className="border border-slate-200 py-4">Usuario</th>
            <th className="border border-slate-200 py-4">Email</th>
            <th className="border border-slate-200 py-4">Fecha de nacimiento</th>
            <th className="border border-slate-200 py-4">Teléfono</th>
            <th className="border border-slate-200 py-4">Dirección</th>
            <th className="border border-slate-200 py-4">Rol</th>
            <th className="border border-slate-200 py-4">Estado</th>
            <th className="border border-slate-200 py-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers 
          .map((user) =>
            user._id ? (
              <tr key={user._id} className="bg-white">
                <td className="p-4 border border-gray-300">{user.fullName}</td>
                <td className="p-4 border border-gray-300">{user.username}</td>
                <td className="p-4 border border-gray-300">{user.email}</td>
                <td className="p-4 border border-gray-300">{user.dateOfBirth || ""}</td>
                <td className="p-4 border border-gray-300">{user.phone || ""}</td>
                <td className="p-4 border border-gray-300">{user.address || ""}</td>
                <td className="p-4 border border-gray-300 text-center">
                  {user._id === userID ? (
                    <span className="px-4 py-2 rounded bg-gray-300 text-gray-600 cursor-not-allowed">
                      {user.role === "user" ? "Usuario" : "Administrador"}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRoleChangeClick(user)}
                      className={`px-4 py-2 rounded  ${
                        user.role === "user"
                          ? "text-blue-600 border-blue-600 hover:bg-blue-100"
                          : "text-red-600 border-red-600 hover:bg-red-100"
                      }`}
                    >
                      {user.role === "user" ? "Usuario" : "Administrador"}
                    </button>
                  )}
                </td>
                <td className="p-4 border border-gray-300 text-center">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() => handleStatusChangeClick(user)}
                      className={`px-4 py-2 rounded ${
                        user.status === "activo"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      {user.status === "activo" ? "Activo" : "Inactivo"}
                    </button>
                  </div>
                </td>
                <td className="p-4 border border-gray-300 text-center">
                  <div className="flex justify-center items-center divide-x divide-gray-300">
                    <button className="pr-2" onClick={() => handleDeleteClick(user._id!)}>
                      <TrashIcon className="h-6 w-6 text-red-600 hover:text-red-500 transition duration-300" />
                    </button>
                    <button className="pl-2" onClick={() => handleEditClick(user)}>
                      <PencilSquareIcon className="h-6 w-6 text-green-600 hover:text-green-500 transition duration-300" />
                    </button>
                  </div>
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      </>
      )}

      {isConfirmRoleChangeOpen && (
        <Transition appear show={isConfirmRoleChangeOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsConfirmRoleChangeOpen(false)}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-75" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      Confirmar Cambio de Rol
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">
                        ¿Estás seguro de que deseas cambiar el rol del usuario{" "}
                        <strong>{userToChangeRole?.username}</strong>? El nuevo rol será{" "}
                        <strong>
                          {userToChangeRole?.role === "admin" ? "Usuario" : "Administrador"}
                        </strong>.
                      </p>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => setIsConfirmRoleChangeOpen(false)}
                        className="mr-4 bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          confirmRoleChange(userToChangeRole?.role === "user" ? "admin" : "user")
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Sí
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      {/* Modal de Confirmación para el cambio de estado */}
      {isConfirmStatusChangeOpen && (
        <Transition appear show={isConfirmStatusChangeOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsConfirmStatusChangeOpen(false)}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-75" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      Confirmar Cambio de Estado
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">
                        ¿Estás seguro de que deseas cambiar el estado del usuario {" "}
                        <strong>{userToChangeStatus?.username}</strong>? Esta acción cambiará el estado del usuario a{" "}
                        <strong>{userToChangeStatus?.status === "activo" ? "inactivo" : "activo"}.</strong>
                      </p>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => setIsConfirmStatusChangeOpen(false)}
                        className="mr-4 bg-gray-500 text-white px-4 py-2 rounded"
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmStatusChange(userToChangeStatus?.status === "activo" ? "inactivo" : "activo")}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Sí
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      {/* Modal de Confirmación para eliminar usuario */}
      {isConfirmDeleteOpen && (
        <Transition appear show={isConfirmDeleteOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsConfirmDeleteOpen(false)}
          >
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-75" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      Confirmar Eliminación
                    </DialogTitle>
                    <div className="mt-2">
                      {/** Encuentra el usuario que se va a eliminar */}
                      {(() => {
                        const userToDelete = users.find(
                          (user) => user._id === userIdToDelete
                        );
                        return (
                          <>
                            <p className="text-sm text-gray-700">
                              Estás a punto de eliminar al usuario{" "}
                              <strong>
                                {userToDelete?.username || "Desconocido"}
                              </strong>
                              . Esta acción es irreversible y resultará en la
                              eliminación permanente de todos los datos asociados,
                              como su historial, información personal y cualquier
                              otra información guardada en el sistema.
                            </p>
                            <p className="mt-2 text-sm text-gray-700">
                              ¿Estás seguro de que deseas continuar con esta operación? 
                              Si eliminas al usuario, no será posible recuperar sus datos en el futuro.
                            </p>
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => setIsConfirmDeleteOpen(false)}
                        className="mr-2 bg-gray-400 text-white py-2 px-4 rounded-md"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={confirmDeleteUser}
                        className="bg-red-600 text-white py-2 px-4 rounded-md"
                      >
                        Eliminar
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
      <UserModal onUserChange={fetchAllUsers} />
    </div>
  );
}
