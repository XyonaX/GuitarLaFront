import { useEffect } from "react";
import { useProductStore } from "../../store/productStore";
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function Offers() {
  const allProducts = useProductStore((state) => state.allProducts);
  const fetchAllProducts = useProductStore((state) => state.fetchAllProducts);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const orderProducts = allProducts.sort((a, b) => a.price - b.price);
  const offertsProducts = orderProducts.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto py-20">
      <h2 className="text-4xl text-center font-bold text-orange-500 mb-12">
        Ofertas
      </h2>

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-16">
        {offertsProducts.map((product) => (
          <div
            key={product._id}
            className="flex flex-col items-center justify-center bg-white p-6 shadow-xl rounded-xl text-center"
          >
            <img
              src={`${product.imageUrl}`}
              alt={`${product.productName}`}
              className="w-24 mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{product.productName}</h3>
            <p className="text-sm text-slate-600 mb-4">
              {product.shortDescription}
            </p>
            <p className="text-3xl text-orange-600 font-extrabold mb-4">
              ${product.price}
            </p>
            <Link to={`/product/${product._id}`}>
              <button
                type="button"
                className="text-white font-bold uppercase py-2 px-4 w-full bg-orange-600 rounded-xl hover:bg-orange-700 transition-all duration-300 mb-2"
              >
                Ver detalles
              </button>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center mt-8">
        <ArrowDownCircleIcon className=" text-orange-600 h-10 w-10 animate-bounce" />
        <Link to="/products">
          <button className=" bg-orange-600 text-white font-bold py-2 px-8 rounded-md hover:bg-orange-700 transition-all duration-300">
            <p className="text-nowrap">Ver más</p>
          </button>
        </Link>
      </div>
    </div>
  );
}
