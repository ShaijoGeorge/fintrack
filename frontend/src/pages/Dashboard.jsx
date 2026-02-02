import { useEffect, useState } from "react";
import api from "../services/api";
import WalletCard from "../components/WalletCard";
import Layout from "../components/Layout"; // Import Layout

const Dashboard = () => {
    const [wallets, setWallets] = useState([]);
    const [name, setName] = useState("");
    const [balance, setBalance] = useState("");

    useEffect(() => {
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const response = await api.get("/wallets");
            setWallets(response.data);
        } catch (error) {
            console.error("Error fetching wallets", error);
        }
    };

    const handleAddWallet = async (e) => {
        e.preventDefault();
        if (!name) return;
        try {
            await api.post("/wallets", {
                name: name,
                balance: parseFloat(balance) || 0
            });
            setName("");
            setBalance("");
            fetchWallets();
        } catch (error) {
            alert("Failed to create wallet");
        }
    };

    // Inline Styles for Dashboard specifics
    const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' };
    const formCardStyle = { padding: '1.5rem', backgroundColor: '#f3f4f6', border: '2px dashed #d1d5db', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
    const inputStyle = { width: '100%', padding: '0.5rem', marginBottom: '0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' };
    const addBtnStyle = { width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.5rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: '500' };

    return (
        <Layout>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>My Dashboard</h1>

            <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>My Wallets</h2>
                
                <div style={gridStyle}>
                    {wallets.map((wallet) => (
                        <WalletCard key={wallet.id} name={wallet.name} balance={wallet.balance} />
                    ))}
                    
                    <div style={formCardStyle}>
                        <form onSubmit={handleAddWallet}>
                            <input type="text" placeholder="Wallet Name" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
                            <input type="number" placeholder="Initial Balance" style={inputStyle} value={balance} onChange={(e) => setBalance(e.target.value)} />
                            <button type="submit" style={addBtnStyle}>+ Add Wallet</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;