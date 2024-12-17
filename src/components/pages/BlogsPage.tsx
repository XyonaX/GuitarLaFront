import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBlogStore } from "../../store/blogStore";

export default function BlogsPage() {
  const { id } = useParams();
  const fetchAllBlogs = useBlogStore((state) => state.fetchAllBlogs);
  const getOneBlog = useBlogStore((state) => state.getOneBlog);
  const allBlogs = useBlogStore((state) => state.allBlogs);
  const loading = useBlogStore((state) => state.loading);

  // Estado para controlar el índice del blog abierto (acepta número o null)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    if (!id) {
      fetchAllBlogs();
    } else {
      getOneBlog(id);
    }
  }, [id]); // Solo depende de `id`

  // Función para alternar el índice abierto
  const toggleAccordion = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {loading ? (
        <p className="text-center text-gray-500">Cargando blogs...</p>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
            {id ? "Blog Detallado" : "Todos los Blogs"}
          </h1>
          <div className="space-y-4">
            {allBlogs.map((blog, index) => (
              <div
                key={blog._id}
                className="bg-white border-2 border-orange-600 rounded-lg shadow-md"
              >
                {/* Cabecera del acordeón */}
                <div
                  className="p-4 bg-orange-600 text-white font-semibold text-lg rounded-t-lg cursor-pointer flex justify-between"
                  onClick={() => toggleAccordion(index)}
                >
                  <span>{blog.title}</span>
                  <span>{openIndex === index ? "▲" : "▼"}</span>
                </div>

                {/* Contenido del acordeón */}
                {openIndex === index && (
                  <div className="flex p-4">
                    {blog.imageUrl && (
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-1/3 h-auto rounded-lg mr-4"
                      />
                    )}
                    <div className="w-2/3">
                      <p className="mt-4 text-base">{blog.content}</p>
                      {blog.author && (
                        <p className="mt-4 text-base text-gray-600">
                          <strong>Autor:</strong> {blog.author}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
