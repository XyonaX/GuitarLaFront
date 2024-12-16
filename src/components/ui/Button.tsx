import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset" | undefined;
    disabled?: boolean;
}

const Button = ({ children, className, onClick, type, disabled }: ButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={twMerge(
                "bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg",
                className
            )}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
};

export default Button;