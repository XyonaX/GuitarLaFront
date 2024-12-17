import { useEffect, useState } from "react";
import { useProductStore } from "../../store/productStore";
import { useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import LoadingSpinner from "../LoadingSpinner";
import Swal from "sweetalert2";

export default function ProductIDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const getOneProduct = useProductStore((state) => state.getOneProduct);
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const setSelectedProduct = useProductStore(
    (state) => state.setSelectedProduct
  );
  const loading = useProductStore((state) => state.loading);
  const { addToCart, cart, showWarning, setShowWarning } = useCartStore();
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setSelectedProduct(null);
      getOneProduct(id);
    }
  }, [getOneProduct, id]);

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para realizar la compra");
      navigate("/login");
      return;
    }

    if (!selectedProduct) return;

    const cartItem = {
      ...selectedProduct,
      quantity,
    };

    const existingProduct = cart.find(
      (item) => item._id === selectedProduct?._id
    );
    const totalQuantity = existingProduct
      ? existingProduct.quantity + quantity
      : quantity;

    if (totalQuantity > 5) {
      setShowWarning(true);
      return; // No agrega al carrito si se excede la cantidad
    }

    addToCart(cartItem);
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      icon: "success",
      title: `${selectedProduct?.productName} agregado al carrito`,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: `${selectedProduct?.productName} agregado al carrito`,
    });
  };

  // Verifica si el producto ya está en el carrito y si su cantidad total es igual o mayor a 5
  const isMaxQuantityReached = () => {
    const existingProduct = cart.find(
      (item) => item._id === selectedProduct?._id
    );
    return existingProduct ? existingProduct.quantity >= 5 : false;
  };

  if (loading || !selectedProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className=" max-w-4xl mx-auto py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-16 rounded-2xl">
              {/* Image */}
              <div className="flex items-center justify-center bg-white">
                <img
                  src={`${selectedProduct?.imageUrl}`}
                  alt={`${selectedProduct?.productName}`}
                  className="w-52"
                />
              </div>
              <div className="flex flex-col flex-1 justify-center bg-white px-8 py-12 rounded-xl">
                <h2 className="text-4xl text-start text-orange-600 font-bold mb-2">
                  {selectedProduct?.productName}
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  {selectedProduct?.shortDescription}
                </p>
                <p className="mb-8">{selectedProduct?.description}</p>
                <div className="flex justify-evenly gap-8">
                  <select
                    name="quantity"
                    id="quantity"
                    className="border border-slate-200 p-2 mb-6 flex-1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  >
                    <option value=""> -- </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <p className="text-2xl text-orange-600 font-bold">
                    $ {selectedProduct?.price}
                  </p>
                </div>
                <div className="mb-4">
                  <span className="text-xl text-orange-500">
                    Stock Disponible: {selectedProduct?.stock}
                  </span>
                </div>
                <button
                  type="button"
                  className={`text-white uppercase font-bold bg-orange-600 py-2 rounded-xl ${
                    isMaxQuantityReached()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handleAddToCart}
                  disabled={isMaxQuantityReached()}
                >
                  Agregar al carrito
                </button>
                {isMaxQuantityReached() && (
                  <p className="text-center text-red-500 text-sm py-4">
                    Has alcanzado el máximo permitido de 5 productos por tipo.
                  </p>
                )}
                {showWarning && (
                  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                      <p className="text-lg">
                        No puedes comprar más de 5 productos por tipo.
                      </p>
                      <button
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowWarning(false)}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
