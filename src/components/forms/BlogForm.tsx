import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useBlogStore } from "../../store/blogStore";

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
    const setIsModalOpen = useBlogStore((state) => state.setIsModalOpen);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm<BlogFormData>({
        defaultValues: {
            title: "",
            content: "",
            author: "",
            imageUrl: undefined,
            isPublished: false,
            _id: undefined,
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
            setIsEditing(true);
        }

        // Validaciones
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

        try {
            const url = data._id
                ? `${baseUrl}/blogs/update/${data._id}`
                : `${baseUrl}/blogs/create`;

            const response = await fetch(url, {
                method: data._id ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setMessage({
                    text: responseData.message || "Ocurrió un error inesperado.",
                    type: "error",
                });
                return;
            }

            setMessage({
                text: data._id
                    ? "Blog actualizado correctamente."
                    : "Blog creado correctamente.",
                type: "success",
            });

            await useBlogStore.getState().fetchAllBlogs();
            setIsModalOpen(false); // Cierra el modal
        } catch (error) {
            console.error(error);
            setMessage({
                text: "Hubo un problema con la conexión.",
                type: "error",
            });
        }
    };

    useEffect(() => {
        if (selectedBlog) {
            // Si hay un blog seleccionado (modo edición), llenamos el formulario
            reset({
                title: selectedBlog.title || "",
                content: selectedBlog.content || "",
                author: selectedBlog.author || "",
                imageUrl: selectedBlog.imageUrl || "",
                isPublished: selectedBlog.isPublished || false,
                _id: selectedBlog._id || undefined,
            });
        } else {
            // Si no hay un blog seleccionado (modo creación), limpiamos el formulario
            reset({
                title: "",
                content: "",
                author: "",
                imageUrl: "",
                isPublished: false,
                _id: undefined,
            });
        }
    }, [selectedBlog, reset]);
    

    return (
        <div className="p-4 border rounded-md shadow-md bg-white max-w-md mx-auto">
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
                <div className="mb-4">
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Título
                    </label>
                    <input
                        id="title"
                        type="text"
                        {...register("title")}
                        className="mt-1 block w-full border rounded-md p-2"
                    />
                    {errors.title && (
                        <span className="text-red-500 text-sm">
                            {errors.title.message}
                        </span>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Contenido
                    </label>
                    <textarea
                        id="content"
                        {...register("content")}
                        className="mt-1 block w-full border rounded-md p-2"
                    ></textarea>
                    {errors.content && (
                        <span className="text-red-500 text-sm">
                            {errors.content.message}
                        </span>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="author"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Autor
                    </label>
                    <input
                        id="author"
                        type="text"
                        {...register("author")}
                        className="mt-1 block w-full border rounded-md p-2"
                    />
                    {errors.author && (
                        <span className="text-red-500 text-sm">
                            {errors.author.message}
                        </span>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="imageUrl"
                        className="block text-sm font-medium text-gray-700"
                    >
                        URL de la Imagen (opcional)
                    </label>
                    <input
                        id="imageUrl"
                        type="url"
                        {...register("imageUrl")}
                        className="mt-1 block w-full border rounded-md p-2"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="isPublished" className="flex items-center">
                        <input
                            id="isPublished"
                            type="checkbox"
                            {...register("isPublished")}
                            className="mr-2"
                        />
                        Publicar inmediatamente
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full text-white bg-orange-600 py-2 px-4 rounded-md hover:bg-orange-500"
                >
                    {isEditing ? "Actualizar Blog" : "Crear Blog"}
                </button>
            </form>
        </div>
    );
}
