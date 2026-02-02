import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import WalletCard from "../components/WalletCard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [wallets, setWallets] = useState([]);
    const [name, setName] = useState("");
    const [balance, setBalance] = useState("");
    const { logout } = useContext(AuthContext); // add logout button
    const navigate = useNavigate();

    // Fetch Wallets on Page Load
    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const response = await api.get("/wallets");
            setWallets(response.data);
        } catch (error) {
            console.error("Error fetching wallets", error);
            if (error.response && error.response.status === 401) {
                logout(); // Logout if token expired
                navigate("/login");
            }
        }
    };

    // Handle Form Submit
    const handleAddWallet = async (e) => {
        e.preventDefault();
        if (!name) return;

        try {
            await api.post("/wallets", {
                name: name,
                balance: parseFloat(balance) || 0
            });
            // Clear form and refresh list
            setName("");
            setBalance("");
            fetchWallets();
        } catch (error) {
            alert("Failed to create wallet");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
                <button 
                    onClick={() => { logout(); navigate("/login"); }}
                    className="text-red-500 hover:text-red-700 font-medium"
                >
                    Logout
                </button>
            </div>

            {/* Wallet Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">My Wallets</h2>
                
                {/* Grid Layout for Wallets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {wallets.map((wallet) => (
                        <WalletCard key={wallet.id} name={wallet.name} balance={wallet.balance} />
                    ))}
                    
                    {/* Simple Add Wallet Card (Inline Form) */}
                    <div className="p-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col justify-center">
                        <form onSubmit={handleAddWallet} className="space-y-3">
                            <input 
                                type="text" 
                                placeholder="Wallet Name (e.g. SBI)" 
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input 
                                type="number" 
                                placeholder="Initial Balance" 
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                            />
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                                + Add Wallet
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;