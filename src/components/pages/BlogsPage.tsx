import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBlogStore } from "../../store/blogStore";

export default function BlogsPage() {
  const { id } = useParams();
  const fetchAllBlogs = useBlogStore((state) => state.fetchAllBlogs);
  const getOneBlog = useBlogStore((state) => state.getOneBlog);
  const allBlogs = useBlogStore((state) => state.allBlogs);
  const loading = useBlogStore((state) => state.loading);

  useEffect(() => {
    if (!id) {
      // Si no hay ID, carga todos los blogs
      fetchAllBlogs();
    } else {
      // Si hay ID, carga un blog específico
      getOneBlog(id);
    }
  }, [id]); // Solo depende de `id`
  
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
            {allBlogs.map((blog) => (
              <div key={blog._id} className="bg-white border-2 border-orange-600 rounded-lg shadow-md">
                <h2 className="p-4 bg-orange-600 text-white font-semibold text-lg rounded-t-lg">
                  {blog.title}
                </h2>
                <div className="p-4">
                  <p>{blog.content}</p>
                  {blog.imageUrl && (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-auto mt-4 rounded-lg"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
