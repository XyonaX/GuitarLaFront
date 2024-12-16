import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

type Product = {
    _id: string;
    quantity?: number;
};

export const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { clearCart } = useCartStore();
    const [isUpdated, setIsUpdated] = useState(false);
    const updateAttempted = useRef(false);

    const getUserIdFromToken = (): string | null => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica la carga útil del JWT
            return payload?.id || null; // Devuelve el `id` si está presente
        } catch (error) {
            console.error("Error decodificando el token:", error);
            return null;
        }
    };

    // Ejecuta el efecto solo una vez con dependencia vacía
    useEffect(() => {
        const userId = getUserIdFromToken();
        if (!userId) {
            console.error("User ID is null, aborting update stock process.");
            return;
        }
        const updateStock = async () => {
            if (updateAttempted.current || isUpdated) return;
            updateAttempted.current = true;

            const cartProducts: Product[] = JSON.parse(
                localStorage.getItem(`cart_${userId}`) || "[]"
            );
            const productsToUpdate = cartProducts.map((product) => ({
                id: product._id,
                quantity: product.quantity || 1,
            }));

            if (productsToUpdate.length > 0) {
                try {
                    const response = await axios.post(
                        `${import.meta.env.VITE_BASE_URL}/products/updateStock`,
                        { products: productsToUpdate },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "auth_token"
                                )}`,
                            },
                        }
                    );

                    console.log("Stock update response:", response.data);
                    clearCart();
                    setIsUpdated(true);
                    setTimeout(() => {
                        navigate("/my_orders");
                    }, 3000);
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.error("Error updating stock:", error.response?.data?.message || error.message);
                    } else {
                        console.error("Unexpected error:", error);
                    }
                }
            }
        };

        updateStock();
    }, [clearCart, navigate, isUpdated]);

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <div className='bg-white shadow-lg rounded-lg p-6 space-y-6'>
                    <div className='flex flex-col items-center'>
                        <CheckCircleIcon className='w-16 h-16 text-green-500' />
                        <h2 className='mt-4 text-3xl font-extrabold text-gray-900'>
                            Payment Successful!
                        </h2>
                        <p className='mt-2 text-sm text-gray-600'>
                            Thank you for your purchase. Your order has been
                            processed successfully.
                        </p>
                    </div>
                    <div className='mt-6'>
                        <Link
                            to={"/"}
                            className='w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
