import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useProductStore } from "../../store/productStore";
import { useEffect, useState } from "react";
import { ProductType } from "../../types/type";

import {
  Dialog,
  Transition,
  DialogPanel,
  TransitionChild,
  DialogTitle,
} from "@headlessui/react";
import { Fragment } from "react";
import ProductModal from "../modals/ProductModal";
import Pagination from "../../utilities/Pagination";
import LoadingSpinner from "../LoadingSpinner";

export default function DashboardProducts() {
  const fetchAllProducts = useProductStore((state) => state.fetchAllProducts);
  const products = useProductStore((state) => state.allProducts);
  const setSelectedProduct = useProductStore(
    (state) => state.setSelectedProduct
  );
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const { setIsModalOpen, setIsEditMode, loading } = useProductStore();

  // Estado para el modal de confirmación
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null
  );
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Estado para controlar la recarga
  const [reload, setReload] = useState(0);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts, reload]);

  const handleEditClick = (product: ProductType) => {
    setSelectedProduct(product);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCreateClick = async () => {
    setIsEditMode(false);
    setIsModalOpen(true);
    setReload((prev) => prev + 1);
  };

  const handleDeleteClick = (id: string) => {
    setProductIdToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (productIdToDelete) {
      await deleteProduct(productIdToDelete);
      await fetchAllProducts();
      setReload((prev) => prev + 1);
      setIsConfirmDeleteOpen(false);
      setProductIdToDelete(null);
    }
  };

  // Calcula los productos a mostrar en la página actual
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calcula el número total de páginas
  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="py-16 px-8">
      <h2 className="text-4xl text-center text-orange-600 mb-12 font-bold">
        Dashboard de productos
      </h2>
      <button onClick={() => handleCreateClick()}>
        <PlusIcon className="fixed bottom-4 right-4 h-12 text-white bg-blue-600 rounded-full" />
      </button>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <table className="min-w-full border border-collapse mx-auto">
            <thead>
              <tr className="bg-gray-300">
                <th className="border border-slate-200 py-4">Imagen</th>
                <th className="border border-slate-200 py-4">Nombre</th>
                <th className="border border-slate-200 py-4">Descripción</th>
                <th className="border border-slate-200 py-4">Precio</th>
                <th className="border border-slate-200 py-4">Stock</th>
                <th className="border border-slate-200 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id} className="bg-white">
                  <td className="p-4 border h-full border-gray-300 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="w-14 object-fill"
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {product.productName}
                  </td>
                  <td className="p-4 border border-gray-300 max-w-sm">
                    {product.description}
                  </td>
                  <td className="p-4 border border-gray-300">
                    $ {product.price}
                  </td>
                  <td className="p-4 border border-gray-300">
                    {product.stock}
                  </td>
                  <td className="text-center">
                    <button onClick={() => handleDeleteClick(product._id)}>
                      <TrashIcon className="h-6 w-6 text-red-600 mr-2 hover:text-red-500 transition duration-300" />
                    </button>
                    <button onClick={() => handleEditClick(product)}>
                      <PencilSquareIcon className="h-6 w-6 text-green-600 hover:text-green-500 transition duration-300" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* Modal de Confirmación */}
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
                      <p>¿Estás seguro de que deseas eliminar este producto?</p>
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
                        onClick={confirmDeleteProduct}
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

      <ProductModal />
    </div>
  );
}
