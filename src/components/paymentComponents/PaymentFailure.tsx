import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";

export const PaymentFailure = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/checkout");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <div className='bg-white shadow-lg rounded-lg p-6 space-y-6'>
                    <div className='flex flex-col items-center'>
                        <XCircleIcon className='w-16 h-16 text-red-500' />
                        <h2 className='mt-4 text-3xl font-extrabold text-gray-900'>
                            Payment Failed
                        </h2>
                        <p className='mt-2 text-sm text-gray-600'>
                            We're sorry, but there was an issue processing your payment. 
                            Please try again or contact customer support if the problem persists.
                        </p>
                    </div>
                    <div className='mt-6 space-y-4'>
                        <Link
                            to="/checkout"
                            className='w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                        >
                            Try Again
                        </Link>
                        <Link
                            to="/"
                            className='w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

