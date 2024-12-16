import { Fragment } from "react";
import { Dialog, Transition, DialogPanel, TransitionChild } from "@headlessui/react";
import { useUserStore } from "../../store/userStore"; // Estado global de usuarios
import RegisterForm from "../forms/RegisterForm";

interface UserModalProps {
    onUserChange: () => void; // Callback para actualizar el listado
}


const UserModal = ({ onUserChange }: UserModalProps) => {
    const { setIsModalOpen, isModalOpen, isEditMode, selectedUser } = useUserStore();

    return (
        <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsModalOpen(false)}
        >
            {/* Fondo oscuro */}
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

            {/* Contenedor del modal */}
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
                    {/* Título del modal */}
                    <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                    {isEditMode ? "Editar Usuario" : "Crear Nuevo Usuario"}
                    </Dialog.Title>

                    {/* Formulario de usuario */}
                    <RegisterForm 
                        user={
                            selectedUser
                            ? {
                                ...selectedUser,
                                  password: selectedUser.password || "", // Convertimos null/undefined en string vacío
                                }
                            : undefined
                        }
                        closeModal={() => setIsModalOpen(false)}
                        onUserChange={onUserChange}
                        />
                        
                    {/* Botones de acción */}
                    <div className="mt-4 flex justify-end">
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded-md mr-2"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancelar
                    </button>
                    </div>
                </DialogPanel>
                </TransitionChild>
            </div>
            </div>
        </Dialog>
        </Transition>
    );
};

export default UserModal;