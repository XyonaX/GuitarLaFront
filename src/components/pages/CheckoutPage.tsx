import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { motion } from "framer-motion";
import Button from "../ui/Button";


export const CheckoutPage = () => {
    initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, {
        locale: "es-AR",
    });
    const { cart } = useCartStore();
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const token = localStorage.getItem("token");
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userId = decodedToken?.id;

    const createPreference = async (userId: string) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/payment/create_preference`,
                {
                    userId,
                    items: cart.map((item) => ({
                        title: item.productName,
                        unit_price: Number(item.price),
                        quantity: Number(item.quantity),
                        _id: item._id
                    })),
                }
            );
            const { id, saleId } = response.data;
            return { id, saleId };
        } catch (error) {
            console.error("Error al crear la preferencia:", error);
        }
    };

    const handlePayment = async () => {
        const result = await createPreference(userId);
        if (result) {
            setPreferenceId(result.id);
            localStorage.setItem('lastSaleId', result.saleId);
        }
    };

    return (
        <div className="container mx-auto mt-8 min-h-screen px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Card className="bg-white shadow-lg">
                        <CardHeader>
                            <CardTitle>Resumen de la Compra</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <ul className="space-y-4">
                                {cart.map((item) => (
                                    <motion.li
                                        key={item._id}
                                        className="flex items-center space-x-4 bg-orange-300 p-4 rounded-lg"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img
                                            className="w-20 min-30  rounded"
                                            src={item.imageUrl || ""}
                                            alt={item.productName || "Producto"}
                                        />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold">{item.productName}</h3>
                                            <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Resumen del Pedido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between mb-4">
                                <span>Subtotal:</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span>Envío:</span>
                                <span>Gratis</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handlePayment}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                aria-label="Proceder al pago"
                            >
                                Proceder al Pago
                            </Button>
                        </CardFooter>
                    </Card>
                    {preferenceId && (
                        <div className="mt-4">
                            <Wallet initialization={{ preferenceId }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};