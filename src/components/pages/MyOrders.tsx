import { useEffect, useState } from "react";
import { ProductType, Order, SaleDetail } from "../../types/type";
import { ProductSchema } from "../../schema/productSchema";

export const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]); // Datos de las órdenes
    const [products, setProducts] = useState<Record<string, ProductType>>({}); // Almacena los productos por ID
    const [loading, setLoading] = useState<boolean>(true);

    const fetchOrders = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/orders`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();
        setLoading(false);

        if (response.ok) {
            setOrders(data.orders);
            loadProductDetails(data.orders); // Cargar detalles de productos cuando las órdenes estén disponibles
        } else {
            console.error(data.message);
        }
    };

    const loadProductDetails = async (orders: Order[]): Promise<void> => {
        const productIds = new Set(
            orders.flatMap((order) =>
                order.saleDetails.map((detail) => detail.idProduct)
            )
        );

        const productPromises = Array.from(productIds).map((productId) =>
            fetch(
                `${import.meta.env.VITE_BASE_URL}/products/${productId}`
            ).then((res) => res.json())
        );

        const productData: unknown[] = await Promise.all(productPromises);

        try {
            const validatedProducts = productData.map((product) =>
                ProductSchema.parse(product)
            );

            const productMap: Record<string, ProductType> =
                validatedProducts.reduce((map, product) => {
                    map[product._id] = product;
                    return map;
                }, {} as Record<string, ProductType>);

            setProducts(productMap);
        } catch (error) {
            console.error("Error en la validación de productos:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <p className='text-gray-500'>Cargando tus órdenes...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className='flex flex-col items-center mt-10 min-h-screen'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-6 w-24'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
                    />
                </svg>

                <p className='text-lg font-medium text-gray-600 mt-4'>
                    ¡Haz tu primera compra!
                </p>
                <p className='text-sm text-gray-500'>
                    Aquí podrás ver tus compras y hacer el seguimiento de tus
                    envíos.
                </p>
                <a
                    href='/products'
                    className='text-blue-500 underline mt-4 hover:text-blue-700'
                >
                    Ver ofertas del día
                </a>
            </div>
        );
    }

    return (
        <div className='p-4 min-h-screen'>
            <h1 className='text-2xl font-semibold mb-6'>Mis Órdenes</h1>
            <div className='space-y-4'>
                {orders.map((order: Order) => (
                    <div
                        key={order._id}
                        className='bg-white shadow-md rounded-md p-4 border border-gray-200'
                    >
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-medium'>
                                Orden #{order._id}
                            </h2>
                            <p className='text-gray-600'>
                                {new Date(
                                    order.dateOfSale
                                ).toLocaleDateString()}
                            </p>
                        </div>
                        <div className='space-y-2'>
                            {order.saleDetails.map((detail: SaleDetail) => {
                                const product = products[detail.idProduct]; // Obtener producto usando su id
                                return (
                                    <div
                                        key={detail.idProduct}
                                        className='flex justify-between text-sm text-gray-600'
                                    >
                                        <div className='flex items-center'>
                                            {/* Mostrar la imagen del producto */}
                                            {product?.imageUrl && (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.productName}
                                                    className='w-16 h-16 mr-4 object-contain'
                                                />
                                            )}
                                            <span>
                                                {detail.quantity} x{" "}
                                                {product?.productName}
                                            </span>
                                        </div>
                                        <span>
                                            $
                                            {(
                                                detail.quantity * detail.price
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className='flex justify-end border-t border-gray-200 pt-2 mt-2'>
                            <p className='text-lg font-semibold'>
                                Total: ${order.totalSale.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
