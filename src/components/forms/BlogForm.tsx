import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useBlogStore } from "../../store/blogStore";

// Definimos el tipo de los datos del formulario
type BlogFormData = {
    title: string;
    content: string;
    author: string;
    imageUrl?: string;
    isPublished: boolean;
    _id?: string;
};

export default function BlogForm() {
    const selectedBlog = useBlogStore((state) => state.selectedBlog);
    const setIsModalOpen = useBlogStore((state) => state.setIsModalOpen); // Accedemos a la función para controlar el modal
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm<BlogFormData>({
        defaultValues: {
            title: selectedBlog?.title || "",
            content: selectedBlog?.content || "",
            author: selectedBlog?.author || "",
            imageUrl: selectedBlog?.imageUrl ?? undefined,
            isPublished: selectedBlog?.isPublished || false,
            _id: selectedBlog?._id || undefined,
        },
    });

    const [isEditing, setIsEditing] = useState(false);

    const [message, setMessage] = useState<{
        text: string;
        type: "success" | "error";
    } | null>(null);

    const baseUrl = import.meta.env.VITE_BASE_URL;

    const handleBlogSubmit = async (data: BlogFormData) => {
        setMessage(null);

        if (data._id) {
            setIsEditing(true); // Marca que estás editando
        }

        // Validaciones...
        if (!data.title.trim()) {
            setError("title", {
                type: "manual",
                message: "El título es obligatorio.",
            });
            return;
        }
        if (!data.content.trim()) {
            setError("content", {
                type: "manual",
                message: "El contenido es obligatorio.",
            });
            return;
        }
        if (!data.author.trim()) {
            setError("author", {
                type: "manual",
                message: "El autor es obligatorio.",
            });
            return;
        }

        if (!data.imageUrl?.trim()) {
            delete data.imageUrl;
        }

        try {
            // Verifica si hay un _id para decidir si es creación o edición
            const url = data._id
                ? `${baseUrl}/blogs/update/${data._id}` // URL para actualizar el blog
                : `${baseUrl}/blogs/create`; // URL para crear el blog

            const response = await fetch(url, {
                method: data._id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                const errorMessage =
                    responseData.message ||
                    "Ocurrió un error inesperado. Intenta más tarde.";
                setMessage({ text: errorMessage, type: "error" });
                return;
            }

            setMessage({
                text: data._id
                    ? "Blog actualizado correctamente."
                    : "Blog creado correctamente.",
                type: "success",
            });

            // Llamar a fetchAllBlogs para recargar la lista de blogs
            await useBlogStore.getState().fetchAllBlogs();

            // Cerrar el formulario después de la operación exitosa
            setIsModalOpen(false); // Cerramos el modal usando la función del store

        } catch (error) {
            console.error(error);
            setMessage({
                text: "Hubo un problema con la conexión. Revisa tu red e intenta nuevamente.",
                type: "error",
            });
        }
    };

    useEffect(() => {
        if (selectedBlog) {
            reset({
                title: selectedBlog.title,
                content: selectedBlog.content,
                author: selectedBlog.author,
                imageUrl: selectedBlog.imageUrl ?? undefined,
                isPublished: selectedBlog.isPublished,
                _id: selectedBlog._id,
            });
        }
    }, [selectedBlog, reset]);

    return (
        <div className='p-4 border rounded-md shadow-md bg-white max-w-md mx-auto'>
            {message && (
                <div
                    className={`p-2 mb-4 rounded ${
                        message.type === "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit(handleBlogSubmit)}>
                <div className='mb-4'>
                    <label
                        htmlFor='title'
                        className='block text-sm font-medium text-gray-700'
                    >
                        Título
                    </label>
                    <input
                        id='title'
                        type='text'
                        {...register("title")}
                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2'
                    />
                    {errors.title && (
                        <span className='text-red-500 text-sm'>
                            {errors.title.message}
                        </span>
                    )}
                </div>

                <div className='mb-4'>
                    <label
                        htmlFor='content'
                        className='block text-sm font-medium text-gray-700'
                    >
                        Contenido
                    </label>
                    <textarea
                        id='content'
                        {...register("content")}
                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2'
                    ></textarea>
                    {errors.content && (
                        <span className='text-red-500 text-sm'>
                            {errors.content.message}
                        </span>
                    )}
                </div>

                <div className='mb-4'>
                    <label
                        htmlFor='author'
                        className='block text-sm font-medium text-gray-700'
                    >
                        Autor
                    </label>
                    <input
                        id='author'
                        type='text'
                        {...register("author")}
                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2'
                    />
                    {errors.author && (
                        <span className='text-red-500 text-sm'>
                            {errors.author.message}
                        </span>
                    )}
                </div>

                <div className='mb-4'>
                    <label
                        htmlFor='imageUrl'
                        className='block text-sm font-medium text-gray-700'
                    >
                        URL de la Imagen (opcional)
                    </label>
                    <input
                        id='imageUrl'
                        type='url'
                        {...register("imageUrl")}
                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2'
                    />
                    {errors.imageUrl && (
                        <span className='text-red-500 text-sm'>
                            {errors.imageUrl.message}
                        </span>
                    )}
                </div>

                <div className='mb-4'>
                    <label htmlFor='isPublished' className='flex items-center'>
                        <input
                            id='isPublished'
                            type='checkbox'
                            {...register("isPublished")}
                            className='mr-2'
                        />
                        Publicar inmediatamente
                    </label>
                </div>

                <button
                    type='submit'
                    className='w-full text-lg text-white bg-orange-600 font-bold uppercase py-2 px-4 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300'
                >
                    {isEditing ? "Actualizar Blog" : "Crear Blog"}
                </button>
            </form>
        </div>
    );
}
