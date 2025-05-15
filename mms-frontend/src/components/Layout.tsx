// src/components/Layout.tsx
import { Outlet, Link } from "react-router-dom";

const Layout: React.FC = () => (
    <>
        <nav className="navbar">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
        </nav>
        <div style={{ padding: "2rem" }}>
            <Outlet />
        </div>
    </>
);

export default Layout;
