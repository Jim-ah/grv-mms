import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout: React.FC = () => (
    <div className="admin-layout">
        <aside className="admin-sidebar">
            <nav>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/tasks">Tasks</Link>
                <Link to="/admin/procurement">Procurement</Link>
                <Link to="/admin/attendance">Attendance</Link>
                <Link to="/admin/budget">Budget</Link>
                <Link to="/users">Users</Link>
                <Link to="/admin/notifications">Notifications</Link>
            </nav>
        </aside>
        <main className="admin-content">
            {/* This is where nested <Route> elements will render */}
            <Outlet />
        </main>
    </div>
);

export default AdminLayout;
