import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const success = await login(email, password);
        if (success) {
            navigate("/dashboard");
        } else {
            setError("Invalid credentials");
        }
    };

    return (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '350px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Login</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' }}
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: 'none', background: '#007bff', color: 'white', fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;