// src/pages/AdminTicketDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    getTicket,
    getTicketComments,
    Ticket,
    Comment,
} from '../services/ticketService';
import Card from '../components/Card';

const AdminTicketDetail: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate     = useNavigate();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    const [comments, setComments]   = useState<Comment[]>([]);
    const [cLoading, setCLoading]   = useState(false);
    const [cError, setCError]       = useState<string | null>(null);

    // Load ticket details
    useEffect(() => {
        if (!ticketId) return;
        setLoading(true);
        getTicket(ticketId)
            .then(res => {
                // client/engineer endpoints wrap in { ticket } or return raw
                const data = 'ticket' in res.data ? res.data.ticket : res.data;
                setTicket(data);
            })
            .catch(err => {
                const msg = axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : (err as Error).message;
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [ticketId]);

    // Load comments read-only
    useEffect(() => {
        if (!ticketId) return;
        setCLoading(true);
        getTicketComments(ticketId)
            .then(res => setComments(res.data))
            .catch(err => {
                const msg = axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : (err as Error).message;
                setCError(msg);
            })
            .finally(() => setCLoading(false));
    }, [ticketId]);

    if (loading) return <p style={{ padding: '2rem' }}>Loading…</p>;
    if (error)   return <p style={{ padding: '2rem', color: 'red' }}>Error: {error}</p>;
    if (!ticket) return <p style={{ padding: '2rem' }}>Ticket not found.</p>;

    return (
        <main className="admin-ticket-detail-page" style={{ padding: '2rem' }}>
            <button
                className="btn"
                onClick={() => navigate('/admin')}
                style={{ marginBottom: '1rem' }}
            >
                ← Back to Dashboard
            </button>

            <Card title={ticket.title} className="ticket-detail-card">
                <p><strong>Description:</strong> {ticket.description}</p>

                <div style={{ marginTop: '1rem' }}>
                    <p><strong>Status:</strong> {ticket.status}</p>
                    <p><strong>Priority:</strong> {ticket.priority}</p>
                    <p>
                        <strong>Procurement Required:</strong>{' '}
                        {ticket.procurementRequired ? 'Yes' : 'No'}
                    </p>
                    <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                    <p><strong>Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
                    {ticket.assignedBy && (
                        <p><strong>Assigned By:</strong> {ticket.assignedBy}</p>
                    )}
                    {ticket.assignedTo && (
                        <p>
                            <strong>Assigned To:</strong> {ticket.assignedTo.name}{' '}
                            ({ticket.assignedTo.email})
                        </p>
                    )}
                </div>

                {/* read-only comments */}
                <section className="comment-section" style={{ marginTop: '1.5rem' }}>
                    <h2>Comments</h2>
                    {cLoading && <p>Loading comments…</p>}
                    {cError   && <p style={{ color: 'red' }}>{cError}</p>}
                    {!cLoading && comments.length === 0 && <p>No comments.</p>}
                    {comments.map(c => (
                        <div key={c._id} className="comment-card">
                            <p className="comment-content">{c.content}</p>
                            <p className="comment-meta">
                                By {c.createdBy.name} ({c.createdBy.role}) •{' '}
                                {new Date(c.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </section>
            </Card>
        </main>
    );
};

export default AdminTicketDetail;
