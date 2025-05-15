// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { logout } from '../services/authService';
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    deleteAllUsers,
    User,
} from '../services/userService';
import {
    getAdminTickets,
    getAdminProcurements,
    updateProcurementStatus,
    AdminTicket,
    AdminProcurement,
} from '../services/adminService';
import Card from '../components/Card';

const AdminDashboard: React.FC = () => {
    // Users
    const [users, setUsers] = useState<User[]>([]);
    const [uLoading, setULoading] = useState(false);
    const [uError, setUError] = useState<string | null>(null);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Client',
    });

    // Tickets
    const [tickets, setTickets] = useState<AdminTicket[]>([]);
    const [tLoading, setTLoading] = useState(false);
    const [tError, setTError] = useState<string | null>(null);

    // Procurements
    const [procs, setProcs] = useState<AdminProcurement[]>([]);
    const [pLoading, setPLoading] = useState(false);
    const [pError, setPError] = useState<string | null>(null);
    const [processing, setProcessing] = useState<Record<string, boolean>>({});

    // Fetch all three resources
    useEffect(() => {
        const loadAll = async () => {
            // Users
            try {
                setULoading(true);
                setUError(null);
                const res = await getUsers();
                setUsers(res.data);
            } catch (err) {
                setUError(
                    axios.isAxiosError(err) ? err.response?.data?.message ?? err.message : String(err)
                );
            } finally {
                setULoading(false);
            }

            // Tickets
            try {
                setTLoading(true);
                setTError(null);
                const res = await getAdminTickets();
                setTickets(res.data.tickets);
            } catch (err) {
                setTError(
                    axios.isAxiosError(err) ? err.response?.data?.message ?? err.message : String(err)
                );
            } finally {
                setTLoading(false);
            }

            // Procurements
            try {
                setPLoading(true);
                setPError(null);
                const res = await getAdminProcurements();
                setProcs(res.data);
            } catch (err) {
                setPError(
                    axios.isAxiosError(err) ? err.response?.data?.message ?? err.message : String(err)
                );
            } finally {
                setPLoading(false);
            }
        };

        loadAll();
    }, []);

    // User handlers
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser(newUser);
            setNewUser({ name: '', email: '', password: '', role: 'Client' });
            // reload users
            const res = await getUsers();
            setUsers(res.data);
        } catch (err: any) {
            setUError(err.message);
        }
    };

    const handleEditUser = async (id: string) => {
        const name = prompt('New name?');
        if (!name) return;
        try {
            await updateUser(id, { name });
            const res = await getUsers();
            setUsers(res.data);
        } catch (err: any) {
            setUError(err.message);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (err: any) {
            setUError(err.message);
        }
    };

    const handleDeleteAllUsers = async () => {
        if (!window.confirm('Delete ALL users?')) return;
        try {
            await deleteAllUsers();
            setUsers([]);
        } catch (err: any) {
            setUError(err.message);
        }
    };

    // Approve procurement
    const handleApprove = async (id: string) => {
        setProcessing(p => ({ ...p, [id]: true }));
        try {
            const res = await updateProcurementStatus(id, { status: 'Approved' });
            setProcs(ps => ps.map(p => (p._id === id ? res.data : p)));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setProcessing(p => ({ ...p, [id]: false }));
        }
    };

    // Logout
    const onLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={onLogout} className="btn" style={{ background: '#ef4444', color: '#fff' }}>
                    Log Out
                </button>
            </header>

            {/* User Management */}
            <Card title="User Management" className="users-page">
                {uLoading ? (
                    <p>Loading users…</p>
                ) : uError ? (
                    <p style={{ color: 'red' }}>{uError}</p>
                ) : (
                    <>
                        <form
                            onSubmit={handleCreateUser}
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                marginBottom: '1rem',
                            }}
                        >
                            <input
                                placeholder="Name"
                                required
                                value={newUser.name}
                                onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))}
                            />
                            <input
                                placeholder="Email"
                                type="email"
                                required
                                value={newUser.email}
                                onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
                            />
                            <input
                                placeholder="Password"
                                type="password"
                                required
                                value={newUser.password}
                                onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))}
                            />
                            <select
                                value={newUser.role}
                                onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}
                            >
                                <option>Client</option>
                                <option>Technician</option>
                                <option>Engineer</option>
                                <option>Admin</option>
                            </select>
                            <button type="submit" className="btn">
                                Create
                            </button>
                            <button type="button" className="btn danger" onClick={handleDeleteAllUsers}>
                                Delete All
                            </button>
                        </form>

                        <table className="user-table">
                            <thead>
                            <tr>
                                {['Name', 'Email', 'Role', 'Actions'].map(h => (
                                    <th key={h}>{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <button className="btn secondary" onClick={() => handleEditUser(u._id)}>
                                            Edit
                                        </button>
                                        <button className="btn danger" onClick={() => handleDeleteUser(u._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                )}
            </Card>

            {/* All Tickets */}
            <Card title="All Tickets" className="admin-tickets-page">
                {tLoading ? (
                    <p>Loading tickets…</p>
                ) : tError ? (
                    <p style={{ color: 'red' }}>{tError}</p>
                ) : (
                    <div className="ticket-grid">
                        {tickets.map(t => (
                            <div key={t._id} className="ticket-card">
                                <h3 className="ticket-card-title">{t.title}</h3>
                                <p className="ticket-card-desc">{t.description}</p>
                                <p><strong>Status:</strong> {t.status}</p>
                                <p><strong>Priority:</strong> {t.priority}</p>
                                <p><strong>Created By:</strong> {t.createdBy.name}</p>
                                {t.assignedTo && (
                                    <p><strong>Assigned To:</strong> {t.assignedTo.name}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* All Procurements */}
            <Card title="All Procurement Requests" className="admin-procurements-page">
                {pLoading ? (
                    <p>Loading procurements…</p>
                ) : pError ? (
                    <p style={{ color: 'red' }}>{pError}</p>
                ) : (
                    <div className="procurement-grid">
                        {procs.map(p => (
                            <div key={p._id} className="procurement-card">
                                <p><strong>Ticket:</strong> {p.ticketId.title}</p>
                                <p><strong>Item:</strong> {p.itemName}</p>
                                <p><strong>Qty:</strong> {p.quantity}</p>
                                <p><strong>Est. Cost:</strong> ${p.estimatedCost.toFixed(2)}</p>
                                <p><strong>Status:</strong> {p.status}</p>
                                {p.status === 'Requested' && (
                                    <button
                                        className="btn"
                                        disabled={processing[p._id]}
                                        onClick={() => handleApprove(p._id)}
                                    >
                                        {processing[p._id] ? 'Approving…' : 'Approve'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </main>
    );
};

export default AdminDashboard;
