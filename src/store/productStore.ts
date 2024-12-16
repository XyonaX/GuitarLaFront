import { ProductType } from "../types/type";
import { create } from "zustand";
import axios from "axios";
import { ProductSchema } from "../schema/productSchema";

// Define el estado del store de productos
type ProductState = {
  allProducts: ProductType[]; // Lista de todos los productos
  isModalOpen: boolean; // Estado del modal (verdadero o falso)
  setIsModalOpen: (open: boolean) => void; // Función para cambiar el estado del modal
  isEditMode: boolean; // Estado que indica si se está en modo de edición
  setIsEditMode: (edit: boolean) => void; // Función para cambiar el estado de edición
  loading: boolean; // Estado de carga
  selectedProduct: ProductType | null; // Producto seleccionado para ver o editar
  setSelectedProduct: (product: ProductType | null) => void; // Función para establecer el producto seleccionado
  fetchAllProducts: () => Promise<void>; // Función para obtener todos los productos
  getOneProduct: (productID: ProductType["_id"]) => Promise<void>; // Función para obtener un producto específico por ID
  createProduct: (productData: FormData) => Promise<void>; // Función para crear un nuevo producto
  updateProduct: (productData: FormData) => Promise<void>; // Función para actualizar un producto existente
  deleteProduct: (productID: ProductType["_id"]) => Promise<void>; // Función para eliminar un producto
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useProductStore = create<ProductState>((set) => ({
  allProducts: [],
  isModalOpen: false,
  setIsModalOpen: (open) => set({ isModalOpen: open }),
  isEditMode: false,
  setIsEditMode: (mode) => set({ isEditMode: mode }),
  loading: true,
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      const productData = response.data;

      const validatedProduct = productData.map((product: ProductType) => {
        return ProductSchema.parse(product);
      });

      set({ allProducts: validatedProduct });
      set({ loading: false });
    } catch (error) {
      throw new Error(`Error fetching products. ${error}`);
    } finally {
      set({ loading: false });
    }
  },
  getOneProduct: async (productID) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/products/${productID}`);
      const responseData = response.data;
      const validatedProduct = ProductSchema.parse(responseData);

      set({ selectedProduct: validatedProduct });
      set({ loading: false });
    } catch (error) {
      set({ selectedProduct: null });
      throw new Error(`Error fetching product with ID ${productID}: ${error}`);
    } finally {
      set({ loading: false });
    }
  },
  createProduct: async (productData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/products/create`,
        productData
      );
      const newProduct = ProductSchema.parse(response.data);
      console.log(newProduct);

      set((state) => ({
        allProducts: [...state.allProducts, newProduct],
      }));
    } catch (error) {
      throw new Error(`Error creating product: ${error}`);
    }
  },
  updateProduct: async (productData) => {
    try {
      const productId = productData.get("_id");
      const response = await axios.put(
        `${BASE_URL}/products/update/${productId}`,
        productData
      );
      const updatedProduct = ProductSchema.parse(response.data);

      set((state) => ({
        allProducts: state.allProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        ),
        selectedProduct: null,
      }));
    } catch (error) {
      throw new Error(
        `Error updating product with ID ${productData.get("_id")}: ${error}`
      );
    }
  },
  deleteProduct: async (productID) => {
    try {
      await axios.delete(`${BASE_URL}/products/delete/${productID}`);
      set((state) => ({
        allProducts: state.allProducts.filter(
          (product) => product._id !== productID
        ),
      }));
    } catch (error) {
      throw new Error(
        `Error deleting product with ID: ${productID}. Error: ${error}`
      );
    }
  },
}));
