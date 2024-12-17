import { Link } from "react-router-dom";
import { useProductStore } from "../../store/productStore";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import Pagination from "../../utilities/Pagination";

export default function ProductsStorePage() {
  const fetchAllProducts = useProductStore((state) => state.fetchAllProducts);
  const allProducts = useProductStore((state) => state.allProducts);
  const loading = useProductStore((state) => state.loading);

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Estado de filtro
  const [filter, setFilter] = useState({
    search: "",
    order: "asc",
  });

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Resetea la página actual a 1 cuando se aplica un filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Calcula los productos a mostrar en la página actual
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

  // Filtra los productos según el estado de filtro
  const filteredProducts = allProducts.filter((product) => {
    const productName = product.productName.toLowerCase();
    const search = filter.search.toLowerCase();

    return productName.includes(search);
  });

  // Ordena los productos según el estado de filtro
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (filter.order === "asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  // Calcula los productos a mostrar en la página actual después de filtrar y ordenar
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Calcula el número total de páginas después de filtrar y ordenar
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  return (
    <main>
      <section className="max-w-5xl mx-auto py-16">
        <h2 className="text-4xl md:text-5xl text-center text-orange-600 font-bold mb-10">
          Nuestros productos
        </h2>

        <div className="max-w-xl md:max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-8 mb-4 px-8">
          <input
            type="search"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            placeholder="Buscar productos"
            className="w-full py-2 px-10 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
          <div className="flex items-center">
            <label className="mr-2 text-nowrap">Ordenar por:</label>
            <select
              value={filter.order}
              onChange={(e) => setFilter({ ...filter, order: e.target.value })}
              className="w-full md:w-20 py-2 pl-2 text-sm text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            >
              <option value="asc">Precio ascendente</option>
              <option value="desc">Precio descendente</option>
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {currentProducts.length === 0 ? (
              <p className="text-2xl text-red-500 text-center mt-12 py-16">
                No se encontraron productos que coincidan con los filtros
                aplicados.
              </p>
            ) : (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12 lg:gap-6 md:px-4 place-items mt-12">
                {currentProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 flex mb-4 flex-col h-full hover:scale-105"
                  >
                    <div className="flex justify-center mb-4">
                      <img
                        src={`${product.imageUrl}`}
                        alt={`Imagen de ${product.productName}`}
                        className="w-20 h-auto object-contain"
                      />
                    </div>
                    <div className="flex flex-col flex-grow justify-between text-center">
                      <h3 className="text-xl font-bold mb-2">
                        {product.productName}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {product.shortDescription}
                      </p>
                      <p className="text-orange-500 text-3xl font-bold mb-4">
                        $ {product.price}
                      </p>
                      <Link to={`/product/${product._id}`}>
                        <button
                          type="button"
                          className="w-full py-2 text-white font-bold uppercase bg-orange-700 rounded-lg hover:bg-opacity-90 transition duration-300"
                        >
                          Ver detalles
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Componente de Paginación */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>
    </main>
  );
}
