// src/pages/TicketDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getTicket, Ticket, getTicketComments, addComment, Comment } from '../services/ticketService';
import Card from '../components/Card';

const TicketDetail: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate = useNavigate();

    const [ticket, setTicket]       = useState<Ticket | null>(null);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState<string | null>(null);

    const [comments, setComments]   = useState<Comment[]>([]);
    const [cLoading, setCLoading]   = useState(false);
    const [cError, setCError]       = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');

    // load ticket
    useEffect(() => {
        if (!ticketId) return;
        setLoading(true);
        getTicket(ticketId)
            .then(res => setTicket(res.data.ticket ?? res.data))
            .catch(err =>
                setError(
                    axios.isAxiosError(err)
                        ? err.response?.data?.message ?? err.message
                        : (err as Error).message
                )
            )
            .finally(() => setLoading(false));
    }, [ticketId]);

    // load comments
    const loadComments = () => {
        if (!ticketId) return;
        setCLoading(true);
        getTicketComments(ticketId)
            .then(res => setComments(res.data))
            .catch(err =>
                setCError(
                    axios.isAxiosError(err)
                        ? err.response?.data?.message ?? err.message
                        : (err as Error).message
                )
            )
            .finally(() => setCLoading(false));
    };

    useEffect(() => {
        loadComments();
    }, [ticketId]);

    // handle new comment submit
    const handleAddComment = async () => {
        if (!newComment.trim()) return setCError('Comment cannot be empty');
        setCError(null);
        try {
            await addComment(ticketId!, {
                content: newComment.trim(),
                isInternal: false,
            });
            setNewComment('');
            loadComments();
        } catch (err) {
            setCError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : (err as Error).message
            );
        }
    };

    if (loading) return <p style={{ padding: '2rem' }}>Loading ticket…</p>;
    if (error)   return <p style={{ padding: '2rem', color: 'red' }}>Error: {error}</p>;
    if (!ticket) return <p style={{ padding: '2rem' }}>Ticket not found.</p>;

    return (
        <main style={{ padding: '2rem' }}>
            <button
                className="btn"
                onClick={() => navigate('/tickets')}
                style={{ marginBottom: '1rem' }}
            >
                ← Back to list
            </button>

            <Card title={ticket.title} className="ticket-detail-card">
                <p><strong>Description:</strong></p>
                <p>{ticket.description}</p>

                <div style={{ marginTop: '1.5rem' }}>
                    <p><strong>Status:</strong> {ticket.status}</p>
                    <p><strong>Priority:</strong> {ticket.priority}</p>
                    <p>
                        <strong>Procurement Required:</strong>{' '}
                        {ticket.procurementRequired ? 'Yes' : 'No'}
                    </p>
                    <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                    <p><strong>Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
                </div>

                {/* Comments section */}
                <section className="comment-section">
                    <h2>Comments</h2>

                    {cLoading && <p>Loading comments…</p>}
                    {cError   && <p style={{ color: 'red' }}>{cError}</p>}

                    {!cLoading && comments.length === 0 && (
                        <p>No comments yet. Be the first to comment!</p>
                    )}

                    {!cLoading && comments.length > 0 && (
                        <ul className="comment-list">
                            {comments.map(c => (
                                <li key={c._id} className="comment-card">
                                    <p className="comment-content">{c.content}</p>
                                    <div className="comment-meta">
                                        By {c.createdBy.name} ({c.createdBy.role}) •{' '}
                                        {new Date(c.createdAt).toLocaleString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* New comment form */}
                    <div className="comment-form">
            <textarea
                rows={3}
                placeholder="Write your comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
            />
                        <button className="btn" onClick={handleAddComment}>
                            Submit Comment
                        </button>
                    </div>
                </section>
            </Card>
        </main>
    );
};

export default TicketDetail;
