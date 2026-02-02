import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("expense"); // 'expense' or 'income'

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name) return;
        try {
            await api.post("/categories", { name, type });
            setName("");
            fetchCategories();
        } catch (error) {
            alert("Error creating category");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            alert("Error deleting category");
        }
    };

    // Filter based on active tab
    const displayedCategories = categories.filter(c => c.type === type);

    // Styles
    const cardStyle = { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', maxWidth: '600px' };
    const tabContainerStyle = { display: 'flex', borderBottom: '2px solid #f3f4f6', marginBottom: '1.5rem' };
    const tabStyle = (isActive) => ({
        padding: '0.75rem 1.5rem', cursor: 'pointer', background: 'none', border: 'none',
        borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
        color: isActive ? '#2563eb' : '#6b7280', fontWeight: '600', marginBottom: '-2px'
    });
    
    const formStyle = { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' };
    const inputStyle = { flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db' };
    const btnStyle = { padding: '0.6rem 1.2rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
    
    const listStyle = { listStyle: 'none', padding: 0 };
    const itemStyle = { padding: '0.75rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

    return (
        <Layout>
            <h1 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Manage Categories</h1>

            <div style={cardStyle}>
                {/* Tabs */}
                <div style={tabContainerStyle}>
                    <button onClick={() => setType('expense')} style={tabStyle(type === 'expense')}>Expenses 💸</button>
                    <button onClick={() => setType('income')} style={tabStyle(type === 'income')}>Income 💰</button>
                </div>

                {/* Add Form */}
                <form onSubmit={handleAdd} style={formStyle}>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder={`New ${type} category...`} 
                        style={inputStyle} 
                    />
                    <button type="submit" style={btnStyle}>Add</button>
                </form>

                {/* List */}
                <ul style={listStyle}>
                    {displayedCategories.map((cat) => (
                        <li key={cat.id} style={itemStyle}>
                            <span style={{ fontWeight: '500', color: '#374151' }}>{cat.name}</span>
                            <button onClick={() => handleDelete(cat.id)} style={{ color: '#ef4444', background:'none', border:'none', cursor:'pointer' }}>Delete</button>
                        </li>
                    ))}
                    {displayedCategories.length === 0 && <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No categories found.</p>}
                </ul>
            </div>
        </Layout>
    );
};

export default Categories;