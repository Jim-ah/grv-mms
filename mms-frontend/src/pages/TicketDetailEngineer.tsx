// src/pages/TicketDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    getTicket,
    getTicketComments,
    addComment,
    assignTicket,
    Ticket,
    Comment,
} from '../services/ticketService';
import { getTechnicians, User } from '../services/userService';
import Card from '../components/Card';

const TicketDetail: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate    = useNavigate();

    const [ticket, setTicket]         = useState<Ticket | null>(null);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState<string | null>(null);

    const [comments, setComments]     = useState<Comment[]>([]);
    const [cLoading, setCLoading]     = useState(false);
    const [cError, setCError]         = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');

    // assignment
    const [techs, setTechs]               = useState<User[]>([]);
    const [selectedTech, setSelectedTech] = useState<string>('');
    const [assigning, setAssigning]       = useState(false);
    const [assignError, setAssignError]   = useState<string | null>(null);

    // fetch ticket
    useEffect(() => {
        if (!ticketId) return;
        setLoading(true);
        getTicket(ticketId)
            .then(res => {
                // handle both { ticket } and raw Ticket
                const data = (res.data as any).ticket ?? res.data;
                setTicket(data);
            })
            .catch(err => {
                const msg = axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : err instanceof Error
                        ? err.message
                        : 'Unknown error';
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [ticketId]);

    // fetch comments
    const loadComments = () => {
        if (!ticketId) return;
        setCLoading(true);
        getTicketComments(ticketId)
            .then(res => setComments(res.data))
            .catch(err => {
                const msg = axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : err instanceof Error
                        ? err.message
                        : 'Unknown error';
                setCError(msg);
            })
            .finally(() => setCLoading(false));
    };
    useEffect(loadComments, [ticketId]);

    // fetch technicians
    useEffect(() => {
        getTechnicians()
            .then(res => setTechs(res.data))
            .catch(() => {});
    }, []);

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            setCError('Comment cannot be empty');
            return;
        }
        setCError(null);
        try {
            await addComment(ticketId!, { content: newComment.trim(), isInternal: false });
            setNewComment('');
            loadComments();
        } catch (err) {
            const msg = axios.isAxiosError(err)
                ? err.response?.data?.message ?? err.message
                : err instanceof Error
                    ? err.message
                    : 'Unknown error';
            setCError(msg);
        }
    };

    const handleAssign = async () => {
        if (!selectedTech) {
            setAssignError('Please select a technician');
            return;
        }
        setAssignError(null);
        setAssigning(true);
        try {
            const res = await assignTicket(ticketId!, { assignedTo: selectedTech });
            setTicket(res.data as Ticket);
        } catch (err) {
            const msg = axios.isAxiosError(err)
                ? err.response?.data?.message ?? err.message
                : err instanceof Error
                    ? err.message
                    : 'Unknown error';
            setAssignError(msg);
        } finally {
            setAssigning(false);
        }
    };

    if (loading) return <p style={{ padding: '2rem' }}>Loading ticket…</p>;
    if (error)   return <p style={{ padding: '2rem', color: 'red' }}>Error: {error}</p>;
    if (!ticket) return <p style={{ padding: '2rem' }}>Ticket not found.</p>;

    return (
        <main className="engineer-ticket-detail-page" style={{ padding: '2rem' }}>
            <button
                className="btn"
                onClick={() => navigate(-1)}
                style={{ marginBottom: '1rem' }}
            >
                ← Back to list
            </button>

            <Card title={ticket.title} className="ticket-detail-card">
                <p><strong>Description:</strong> {ticket.description}</p>
                <div style={{ margin: '1rem 0' }}>
                    <p><strong>Status:</strong> {ticket.status}</p>
                    <p><strong>Priority:</strong> {ticket.priority}</p>
                    <p><strong>Procurement Required:</strong> {ticket.procurementRequired ? 'Yes' : 'No'}</p>
                    <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                    <p><strong>Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
                    {ticket.assignedTo && (
                        <p><strong>Assigned To:</strong> {ticket.assignedTo.name} ({ticket.assignedTo.email})</p>
                    )}
                </div>

                {/* Comments */}
                <section className="comment-section">
                    <h2>Comments</h2>
                    {cLoading && <p>Loading comments…</p>}
                    {cError   && <p style={{ color: 'red' }}>{cError}</p>}
                    {!cLoading && comments.length === 0 && <p>No comments yet.</p>}
                    {comments.length > 0 && (
                        <ul className="comment-list">
                            {comments.map(c => (
                                <li key={c._id} className="comment-card">
                                    <p className="comment-content">{c.content}</p>
                                    <div className="comment-meta">
                                        By {c.createdBy.name} ({c.createdBy.role}) • {new Date(c.createdAt).toLocaleString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="comment-form" style={{ marginTop: '1rem' }}>
            <textarea
                rows={3}
                placeholder="Write your comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
            />
                        <button className="btn" onClick={handleAddComment} style={{ marginTop: '0.5rem' }}>
                            Submit Comment
                        </button>
                    </div>
                </section>

                {/* Assign section at bottom, themed */}
                <div
                    className="assign-section"
                    style={{
                        marginTop: '2rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--pink-light)',
                        display: 'flex',
                        gap: '0.75rem',
                    }}
                >
                    <select
                        value={selectedTech}
                        onChange={e => setSelectedTech(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            border: '1px solid var(--pink-light)',
                            borderRadius: '4px',
                        }}
                    >
                        <option value="">— assign technician —</option>
                        {techs.map(t => (
                            <option key={t._id} value={t._id}>
                                {t.name} ({t.email})
                            </option>
                        ))}
                    </select>
                    <button
                        className="btn"
                        onClick={handleAssign}
                        disabled={assigning}
                        style={{
                            padding: '0.5rem 1rem',
                            border: `1px solid var(--pink-medium)`,
                            background: 'var(--pink-light)',
                            color: '#fff',
                            borderRadius: '4px',
                        }}
                    >
                        {assigning ? 'Assigning…' : 'Assign'}
                    </button>
                </div>
                {assignError && (
                    <p style={{ color: 'var(--pink-dark)', marginTop: '0.5rem' }}>
                        {assignError}
                    </p>
                )}
            </Card>
        </main>
    );
};

export default TicketDetail;
