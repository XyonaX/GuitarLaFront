import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useBlogStore } from "../../store/blogStore";
import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import BlogModal from "../modals/BlogModal";
import Pagination from "../../utilities/Pagination";
import LoadingSpinner from "../LoadingSpinner";
import { BlogType } from "../../types/type";

export default function DashboardBlogs() {
  const fetchAllBlogs = useBlogStore((state) => state.fetchAllBlogs);
  const blogs = useBlogStore((state) => state.allBlogs);
  const setSelectedBlog = useBlogStore((state) => state.setSelectedBlog);
  const deleteBlog = useBlogStore((state) => state.deleteBlog);
  const { setIsModalOpen, setIsEditMode, loading } = useBlogStore();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [blogIdToDelete, setBlogIdToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!blogs.length) {
      fetchAllBlogs();
    }
  }, [blogs.length, fetchAllBlogs]);

  const handleEditClick = (blog: BlogType) => {
    setSelectedBlog(blog);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCreateClick = async () => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setBlogIdToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDeleteBlog = async () => {
    if (blogIdToDelete) {
      try {
        await deleteBlog(blogIdToDelete);
        setIsConfirmDeleteOpen(false);
        setBlogIdToDelete(null);
      } catch (error) {
        console.error("Error al eliminar el blog: ", error);
      }
    }
  };

  const indexOfLastBlog = currentPage * itemsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - itemsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  return (
    <div className="py-16 px-8 min-h-screen overflow-x-auto">
      <h2 className="text-4xl text-center text-orange-600 mb-12 font-bold">
        Dashboard de Blogs
      </h2>
      <button
        onClick={handleCreateClick}
        className="fixed right-4 w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg z-50"
      >
        <PlusIcon className="h-8 w-8" />
      </button>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <table className="table-auto min-w-full border border-collapse mx-auto">
            <thead>
              <tr className="bg-gray-300">
                <th className="border border-slate-200 py-4">Título</th>
                <th className="border border-slate-200 py-4">Descripción</th>
                <th className="border border-slate-200 py-4">Autor</th>
                <th className="border border-slate-200 py-4">Fecha</th>
                <th className="border border-slate-200 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentBlogs.map((blog) => (
                <tr key={blog._id} className="bg-white">
                  <td className="p-4 border border-gray-300 max-w-[200px]">
                    {blog.title}
                  </td>
                  <td className="p-4 border border-gray-300 max-w-[500px] truncate overflow-hidden whitespace-nowrap md:max-w-sm md:whitespace-normal">
                    {blog.content}
                  </td>
                  <td className="p-4 border border-gray-300">{blog.author}</td>
                  <td className="p-4 border border-gray-300">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => blog._id && handleDeleteClick(blog._id)}
                    >
                      <TrashIcon className="h-6 w-6 text-red-600 mr-2 hover:text-red-500 transition duration-300" />
                    </button>
                    <button onClick={() => handleEditClick(blog)}>
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

      {isConfirmDeleteOpen && (
        <Transition appear show={isConfirmDeleteOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsConfirmDeleteOpen(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      Confirmar Eliminación
                    </Dialog.Title>
                    <div className="mt-2">
                      <p>¿Estás seguro de que deseas eliminar este blog?</p>
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
                        onClick={confirmDeleteBlog}
                        className="bg-red-600 text-white py-2 px-4 rounded-md"
                      >
                        Eliminar
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      <BlogModal />
    </div>
  );
}
