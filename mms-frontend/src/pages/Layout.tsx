import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

const Layout: React.FC = () => {
    const nav = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        nav("/login", { replace: true });
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/users">Users</Link>
                <button onClick={handleLogout} className="btn" style={{ marginLeft: "auto" }}>
                    Logout
                </button>
            </nav>
            <div className="content" style={{ padding: "2rem" }}>
                <Outlet />
            </div>
        </>
    );
};

export default Layout;
