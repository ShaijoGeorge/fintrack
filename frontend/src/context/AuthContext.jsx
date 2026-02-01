import { createContext, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            // Symfony expects 'username' for the login check
            const response = await api.post("/login_check", { username: email, password });
            const newToken = response.data.token;

            localStorage.setItem("token", newToken);
            setToken(newToken);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};