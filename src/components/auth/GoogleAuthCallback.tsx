import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const GoogleAuthCallback = () => {
    const { setToken, setRole } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
    
        if (token) {
            localStorage.setItem("auth_token", token); // Guarda temporalmente en localStorage
        }
    
        const storedToken = localStorage.getItem("auth_token"); // Recupera desde localStorage si falta
        if (storedToken) {
            try {
                setToken(storedToken);
                const payloadBase64 = storedToken.split(".")[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                setRole(decodedPayload.role);
                navigate("/"); // Redirige a la página principal
            } catch (error) {
                console.error("Error al decodificar el token:", error);
                navigate("/login");
            }
        } else {
            console.error("Token no encontrado en la URL ni en localStorage");
            navigate("/login");
        }
    }, [setToken, setRole, navigate]);


    return <div>Autenticando...</div>;
};

export default GoogleAuthCallback;
