import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ProductType } from "../../types/type";
import { useProductStore } from "../../store/productStore";
import ErrorFormMessage from "../forms/ErrorFormMessage";

const initialState = {
  productName: "",
  description: "",
  shortDescription: "",
  price: 0,
  isAvailable: true,
  stock: 50,
  imageUrl: null,
};

export default function ProductForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductType>();

  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const onRefresh = useProductStore((state) => state.fetchAllProducts);
  const { setIsModalOpen, isEditMode } = useProductStore();

  useEffect(() => {
    if (isEditMode && selectedProduct) {
      reset(selectedProduct); // Restaura el formulario con los datos del producto seleccionado
    } else {
      reset(initialState); // Restablece el formulario a su estado inicial
    }
  }, [selectedProduct, reset, isEditMode]);

  // Función asíncrona que maneja el envío de datos de un producto
  const onSubmit = async (data: ProductType) => {
    const formData = new FormData(); // Crea un nuevo objeto FormData para enviar datos

    // Agrega los datos del producto al FormData
    formData.append("_id", data._id);
    formData.append("productName", data.productName);
    formData.append("description", data.description);
    formData.append("shortDescription", data.shortDescription);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("isAvailable", data.isAvailable.toString());

    // Si existe una imagen, la agrega al FormData
    const imageFile = data.imageUrl && data.imageUrl[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Llama a la función de actualización o creación según el modo de edición
    if (isEditMode) {
      await updateProduct(formData); // Actualiza el producto existente
    } else {
      await createProduct(formData); // Crea un nuevo producto
    }

    await onRefresh(); // Refresca la lista de productos
    setIsModalOpen(false); // Cierra el modal
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg py-10 px-5 "
      >
        <div className="mb-2">
          <label htmlFor="productName" className="text-sm uppercase font-bold">
            Título
          </label>
          <input
            id="productName"
            className="w-full p-2 border border-gray-200"
            type="text"
            placeholder="Nombre del Producto"
            {...register("productName", {
              required: "El nombre del producto es obligatorio",
            })}
          />
          {errors.productName && (
            <ErrorFormMessage>{errors.productName.message}</ErrorFormMessage>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="description" className="text-sm uppercase font-bold">
            Descripción
          </label>
          <textarea
            id="description"
            className="w-full p-2 border border-gray-200"
            placeholder="Descripción del Producto"
            {...register("description", {
              required: "La descripción es obligatoria",
            })}
          ></textarea>
          {errors.description && (
            <ErrorFormMessage>{errors.description.message}</ErrorFormMessage>
          )}
        </div>

        <div className="mb-2">
          <label
            htmlFor="shortDescription"
            className="text-sm uppercase font-bold"
          >
            Breve descripción
          </label>
          <textarea
            id="shortDescription"
            className="w-full p-2 border border-gray-200"
            placeholder="Breve descripción del producto"
            {...register("shortDescription", {
              required: "La breve descripción es obligatoria",
            })}
          ></textarea>
          {errors.shortDescription && (
            <ErrorFormMessage>
              {errors.shortDescription.message}
            </ErrorFormMessage>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="price" className="text-sm uppercase font-bold">
            Precio
          </label>
          <input
            id="price"
            type="number"
            className="w-full p-2 border border-gray-200"
            placeholder="Precio del Producto"
            {...register("price", {
              required: "El precio es obligatorio",
              min: {
                value: 1,
                message: "El precio debe ser mayor que cero.",
              },
            })}
          />
          {errors.price && (
            <ErrorFormMessage>{errors.price.message}</ErrorFormMessage>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="stock" className="text-sm uppercase font-bold">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            defaultValue={50}
            className="w-full p-2 border border-gray-200"
            {...register("stock", { required: "El stock es obligatorio" })}
          />
          {errors.stock && (
            <ErrorFormMessage>{errors.stock.message}</ErrorFormMessage>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="imageUrl" className="text-sm uppercase font-bold">
            Imagen del producto
          </label>
          <input
            id="imageUrl"
            type="file"
            accept=".jpg,.jpeg,.png"
            {...register("imageUrl")}
            className="w-full p-2 border border-gray-200"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="isAvailable" className="flex items-center">
            <input
              id="isAvailable"
              type="checkbox"
              {...register("isAvailable")}
              defaultChecked={true}
              className="mr-2"
            />
            Disponible
          </label>
        </div>

        <input
          type="submit"
          className={`bg-orange-600 w-full p-2 text-white uppercase font-bold hover:bg-orange-700 cursor-pointer transition-colors`}
          value={isEditMode ? "Actualizar Producto" : "Crear Producto"}
        />
      </form>
    </div>
  );
}
