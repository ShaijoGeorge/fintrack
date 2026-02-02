import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Layout = ({ children }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: "📊" },
        { name: "Categories", path: "/categories", icon: "🏷️" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Styles
    const containerStyle = { display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' };
    const sidebarStyle = { width: '250px', backgroundColor: 'white', borderRight: '1px solid #e5e7eb', padding: '1.5rem', display: 'flex', flexDirection: 'column' };
    const logoStyle = { fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' };
    const navStyle = { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' };
    
    const linkStyle = (isActive) => ({
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.75rem 1rem', textDecoration: 'none', borderRadius: '8px',
        fontSize: '0.95rem', fontWeight: isActive ? '600' : '400',
        backgroundColor: isActive ? '#eff6ff' : 'transparent',
        color: isActive ? '#2563eb' : '#4b5563',
        transition: 'all 0.2s'
    });

    const logoutBtnStyle = { marginTop: 'auto', padding: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: '500' };
    const mainStyle = { flex: 1, padding: '2rem', overflowY: 'auto' };

    return (
        <div style={containerStyle}>
            {/* Sidebar */}
            <aside style={sidebarStyle}>
                <div style={logoStyle}>🚀 FinTrack</div>
                <nav style={navStyle}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path} style={linkStyle(isActive)}>
                                <span>{item.icon}</span> {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <button onClick={handleLogout} style={logoutBtnStyle}>🚪 Logout</button>
            </aside>

            {/* Main Content Area */}
            <main style={mainStyle}>
                {children}
            </main>
        </div>
    );
};

export default Layout;