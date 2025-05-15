// src/pages/EngineerProcurements.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    getProcurements,
    updateProcurementStatus,
    ProcurementWithTicket,
} from '../services/ticketService'
import { logout } from '../services/authService'

const EngineerProcurements: React.FC = () => {
    const [items, setItems] = useState<ProcurementWithTicket[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [processing, setProcessing] = useState<Record<string, boolean>>({})
    const navigate = useNavigate()

    const loadItems = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getProcurements()
            setItems(res.data)
        } catch (err: unknown) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : 'Failed to load'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadItems()
    }, [])

    const handleApprove = async (id: string) => {
        setProcessing(p => ({ ...p, [id]: true }))
        try {
            const res = await updateProcurementStatus(id, { status: 'Approved' })
            setItems(items.map(i => (i._id === id ? res.data : i)))
        } catch (err: unknown) {
            alert(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : 'Error approving'
            )
        } finally {
            setProcessing(p => ({ ...p, [id]: false }))
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <main className="engineer-tickets-page" style={{ padding: '2rem' }}>
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                }}
            >
                <h1>Procurement Requests</h1>
                <div>
                    <button className="btn" onClick={loadItems}>
                        Refresh
                    </button>
                    <button
                        className="btn"
                        style={{ marginLeft: '0.5rem' }}
                        onClick={() => navigate('/engineer')}
                    >
                        Tickets
                    </button>
                    <button
                        className="btn"
                        style={{ marginLeft: '0.5rem' }}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Loading / Error */}
            {loading && <p>Loading…</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && items.length === 0 && <p>No procurement requests.</p>}

            {/* Grid */}
            <div className="ticket-grid">
                {items.map(p => (
                    <div
                        key={p._id}
                        className="ticket-card"
                        style={{ cursor: 'default' }}
                    >
                        <h3 className="ticket-card-title">{p.itemName}</h3>
                        <div className="ticket-card-meta" style={{ marginBottom: '0.5rem' }}>
                            <p>
                                <strong>Ticket:</strong> {p.ticketId.title} (
                                {p.ticketId.status})
                            </p>
                            <p>
                                <strong>Qty:</strong> {p.quantity} ·{' '}
                                <strong>Cost:</strong> ${p.estimatedCost.toFixed(2)}
                            </p>
                            <p>
                                <strong>Status:</strong> {p.status}
                            </p>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#555' }}>
                            Requested by {p.requestedBy.name} on{' '}
                            {new Date(p.createdAt).toLocaleDateString()}
                        </p>

                        {p.status === 'Requested' && (
                            <button
                                className="btn"
                                disabled={processing[p._id]}
                                onClick={() => handleApprove(p._id)}
                                style={{ marginTop: '0.5rem' }}
                            >
                                {processing[p._id] ? 'Approving…' : 'Approve'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </main>
    )
}

export default EngineerProcurements
