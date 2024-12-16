type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pageButtons = [];
  const maxButtons = 5; // Número máximo de botones a mostrar

  // Calcula el rango de botones a mostrar
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  // Ajusta el rango si hay menos de 5 páginas
  if (endPage - startPage < maxButtons - 1) {
    if (startPage === 1) {
      // Si estamos al principio, ajustar el final
      endPage = Math.min(totalPages, startPage + maxButtons - 1);
    } else {
      // Si estamos al final, ajustar el inicio
      startPage = Math.max(1, endPage - (maxButtons - 1));
    }
  }

  // Agregar el botón de la primera página si no está visible
  if (startPage > 1) {
    pageButtons.push(
      <button
        key={1}
        onClick={() => {
          onPageChange(1);
          window.scrollTo(0, 0); // Desplazar hacia la parte superior de la página
        }}
        className="mx-1 py-2 px-4 rounded-md bg-gray-300 text-gray-700"
      >
        1
      </button>
    );
    if (startPage > 2) {
      // Agregar un separador si hay más de una página entre la primera y la primera visible
      pageButtons.push(
        <span key="ellipsis-start" className="mx-1">
          ...
        </span>
      );
    }
  }

  // Agrega los botones de las páginas visibles
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => {
          onPageChange(i);
          window.scrollTo(0, 0);
        }}
        className={`mx-1 py-2 px-4 rounded-md ${
          i === currentPage
            ? "bg-orange-600 text-white"
            : "bg-gray-300 text-gray-700"
        }`}
      >
        {i}
      </button>
    );
  }

  // Agrega el botón de la última página si no está visible
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      // Agrega un separador si hay más de una página entre la última visible y la última
      pageButtons.push(
        <span key="ellipsis-end" className="mx-1">
          ...
        </span>
      );
    }
    pageButtons.push(
      <button
        key={totalPages}
        onClick={() => {
          onPageChange(totalPages);
          window.scrollTo(0, 0);
        }}
        className="mx-1 py-2 px-4 rounded-md bg-gray-300 text-gray-700"
      >
        {totalPages}
      </button>
    );
  }

  return (
    <div className="flex justify-center mt-12">
      {currentPage > 1 && (
        <button
          onClick={() => {
            onPageChange(currentPage - 1);
            window.scrollTo(0, 0);
          }}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md mx-1"
        >
          Anterior
        </button>
      )}
      {pageButtons}
      {currentPage < totalPages && (
        <button
          onClick={() => {
            onPageChange(currentPage + 1);
            window.scrollTo(0, 0); // Desplazar hacia la parte superior de la página
          }}
          className="bg-gray-300 text-gray-700 py-2 px-2 rounded-md mx-1"
        >
          Siguiente
        </button>
      )}
    </div>
  );
};

export default Pagination;
