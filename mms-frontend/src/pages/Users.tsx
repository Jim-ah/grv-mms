// src/pages/Users.tsx
import React, { useEffect, useState } from "react";
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    deleteAllUsers,
    User,
} from "../services/userService";

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "Client",
    });

    const loadUsers = () => {
        setLoading(true);
        getUsers()
            .then((res) => setUsers(res.data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(loadUsers, []);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createUser(newUser)
            .then(() => {
                setNewUser({ name: "", email: "", password: "", role: "Client" });
                loadUsers();
            })
            .catch((err) => setError(err.message));
    };

    const handleUpdate = (id: string) => {
        const newName = prompt("New name?");
        if (!newName) return;
        updateUser(id, { name: newName })
            .then(loadUsers)
            .catch((err) => setError(err.message));
    };

    const handleDelete = (id: string) => {
        if (!window.confirm("Delete this user?")) return;
        deleteUser(id)
            .then(loadUsers)
            .catch((err) => setError(err.message));
    };

    const handleDeleteAll = () => {
        if (!window.confirm("Delete ALL users?")) return;
        deleteAllUsers()
            .then(loadUsers)
            .catch((err) => setError(err.message));
    };

    if (loading) return <p>Loading users…</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <main style={{ padding: "2rem" }}>
            <h1 style={{ marginBottom: "1rem" }}>Users</h1>

            <form
                onSubmit={handleCreate}
                style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <input
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                    style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <input
                    placeholder="Email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                    style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
                >
                    <option>Client</option>
                    <option>Admin</option>
                    <option>Technician</option>
                    <option>Engineer</option>
                </select>
                <button
                    type="submit"
                    style={{
                        padding: "0.5rem 1rem",
                        border: "1px solid #007bff",
                        background: "#007bff",
                        color: "#fff",
                        borderRadius: "4px",
                    }}
                >
                    Create
                </button>
                <button
                    type="button"
                    onClick={handleDeleteAll}
                    style={{
                        padding: "0.5rem 1rem",
                        border: "1px solid #dc3545",
                        background: "#dc3545",
                        color: "#fff",
                        borderRadius: "4px",
                    }}
                >
                    Delete All
                </button>
            </form>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "1rem",
                    tableLayout: "auto",
                }}
            >
                <thead>
                <tr>
                    {["Name", "Email", "Role", "Actions"].map((h) => (
                        <th
                            key={h}
                            style={{
                                textAlign: "left",
                                padding: "0.75rem",
                                border: "1px solid #ccc",
                                backgroundColor: "#f9f9f9",
                            }}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {users.map((u, idx) => (
                    <tr
                        key={u._id}
                        style={{
                            backgroundColor: idx % 2 === 0 ? "#fff" : "#f5f5f5",
                            transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#e8f4ff")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                                idx % 2 === 0 ? "#fff" : "#f5f5f5")
                        }
                    >
                        <td style={{ padding: "0.75rem", border: "1px solid #ccc" }}>
                            {u.name}
                        </td>
                        <td style={{ padding: "0.75rem", border: "1px solid #ccc" }}>
                            {u.email}
                        </td>
                        <td style={{ padding: "0.75rem", border: "1px solid #ccc" }}>
                            {u.role}
                        </td>
                        <td
                            style={{
                                padding: "0.75rem",
                                border: "1px solid #ccc",
                                display: "flex",
                                gap: "0.5rem",
                            }}
                        >
                            <button
                                onClick={() => handleUpdate(u._id)}
                                style={{
                                    padding: "0.25rem 0.5rem",
                                    border: "1px solid #6c757d",
                                    background: "#6c757d",
                                    color: "#fff",
                                    borderRadius: "4px",
                                }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(u._id)}
                                style={{
                                    padding: "0.25rem 0.5rem",
                                    border: "1px solid #dc3545",
                                    background: "#dc3545",
                                    color: "#fff",
                                    borderRadius: "4px",
                                }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );
};

export default Users;
