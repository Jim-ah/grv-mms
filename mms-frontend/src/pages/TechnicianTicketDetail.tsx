// src/pages/TechnicianTicketDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import api from '../services/api';
import {
    getTicket,
    getTicketComments,
    addComment,
    updateTicketStatus,
    requestProcurement,
    Ticket,
    Comment,
} from '../services/ticketService';
import Card from '../components/Card';

type TicketPayload = Ticket | { ticket: Ticket };

interface Procurement {
    _id: string;
    itemName: string;
    quantity: number;
    estimatedCost: number;
    status: string;
    requestedBy: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    createdAt: string;
}

const STATUS_OPTIONS = [
    'Open',
    'In Progress',
    'Resolved',
    'Closed',
    'Canceled',
    'Rejected',
] as const;

const TechnicianTicketDetail: React.FC = () => {
    const { ticketId } = useParams<{ ticketId: string }>();
    const navigate    = useNavigate();
    const location    = useLocation();

    // Ticket state
    const [ticket, setTicket]   = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    // Comments
    const [comments, setComments]     = useState<Comment[]>([]);
    const [cLoading, setCLoading]     = useState(false);
    const [cError, setCError]         = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');

    // Status
    const [newStatus, setNewStatus]     = useState<Ticket['status']>('Open');
    const [updating, setUpdating]       = useState(false);
    const [statusError, setStatusError] = useState<string | null>(null);

    // Overlay mode: 'none' | 'form' | 'list'
    const [mode, setMode] = useState<'none' | 'form' | 'list'>('none');

    // Procurement form
    const [itemName, setItemName]           = useState('');
    const [quantity, setQuantity]           = useState(1);
    const [estimatedCost, setEstimatedCost] = useState('');
    const [procLoading, setProcLoading]     = useState(false);
    const [procError, setProcError]         = useState<string | null>(null);

    // Procurement list
    const [procurements, setProcurements] = useState<Procurement[]>([]);
    const [plLoading, setPlLoading]       = useState(false);
    const [plError, setPlError]           = useState<string | null>(null);

    const backPath = location.pathname.startsWith('/technician')
        ? '/technician'
        : '/tickets';

    // Load ticket
    useEffect(() => {
        if (!ticketId) return;
        setLoading(true);
        getTicket(ticketId)
            .then((res: AxiosResponse<TicketPayload>) => {
                const data = (res.data as { ticket?: Ticket }).ticket ?? (res.data as Ticket);
                setTicket(data);
                setNewStatus(data.status);
            })
            .catch(err => {
                const msg = axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : err.message;
                setError(msg);
            })
            .finally(() => setLoading(false));
    }, [ticketId]);

    // Load comments
    useEffect(() => {
        if (!ticketId) return;
        setCLoading(true);
        getTicketComments(ticketId)
            .then(res => setComments(res.data))
            .catch(err => {
                const msg = axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : err.message;
                setCError(msg);
            })
            .finally(() => setCLoading(false));
    }, [ticketId]);

    // Add comment
    const handleAddComment = async () => {
        if (!newComment.trim()) {
            setCError('Comment cannot be empty');
            return;
        }
        setCError(null);
        addComment(ticketId!, { content: newComment.trim(), isInternal: false })
            .then(() => {
                setNewComment('');
                return getTicketComments(ticketId!);
            })
            .then(res => setComments(res.data))
            .catch(err => {
                const msg = axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : err.message;
                setCError(msg);
            });
    };

    // Update status
    const handleUpdateStatus = () => {
        setStatusError(null);
        setUpdating(true);
        updateTicketStatus(ticketId!, { status: newStatus })
            .then(res => setTicket(res.data))
            .catch(err => {
                const msg = axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : err.message;
                setStatusError(msg);
            })
            .finally(() => setUpdating(false));
    };

    // Request procurement
    const handleProcure = () => {
        if (!itemName.trim()) {
            setProcError('Item name is required');
            return;
        }
        setProcError(null);
        setProcLoading(true);
        requestProcurement(ticketId!, {
            itemName: itemName.trim(),
            quantity,
            estimatedCost: parseFloat(estimatedCost),
        })
            .then(() => {
                setMode('none');
                setItemName('');
                setQuantity(1);
                setEstimatedCost('');
            })
            .catch(err => {
                const msg = axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : err.message;
                setProcError(msg);
            })
            .finally(() => setProcLoading(false));
    };

    // Load procurement list
    const loadProcurements = () => {
        setPlError(null);
        setPlLoading(true);
        api.get<Procurement[]>(`/tickets/${ticketId}/procurements`)
            .then(res => setProcurements(res.data))
            .catch(err => {
                const msg = axios.isAxiosError(err)
                    ? err.response?.data?.message ?? err.message
                    : err.message;
                setPlError(msg);
            })
            .finally(() => setPlLoading(false));
    };

    if (loading) return <p style={{ padding: '2rem' }}>Loading ticket…</p>;
    if (error)   return <p style={{ padding: '2rem', color: 'red' }}>Error: {error}</p>;
    if (!ticket) return <p style={{ padding: '2rem' }}>Ticket not found.</p>;

    return (
        <main style={{ padding: '2rem' }}>
            {/* Top toolbar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem',
            }}>
                <button
                    className="btn"
                    onClick={() => navigate(backPath)}
                    style={{
                        background: 'var(--green-light)',
                        border: '1px solid var(--green-medium)',
                        color: '#fff',
                    }}
                >
                    ← Back to list
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className="btn"
                        onClick={() => setMode('form')}
                        style={{
                            background: 'var(--green-light)',
                            border: '1px solid var(--green-medium)',
                            color: '#fff',
                        }}
                    >
                        Request Procurement
                    </button>
                    <button
                        className="btn"
                        onClick={() => { setMode('list'); loadProcurements(); }}
                        style={{
                            background: 'var(--green-light)',
                            border: '1px solid var(--green-medium)',
                            color: '#fff',
                        }}
                    >
                        View Procurement Items
                    </button>
                </div>
            </div>

            {/* Main ticket + overlay container */}
            <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
                {/* Main ticket details */}
                <Card title={ticket.title} className="ticket-detail-card">
                    <p><strong>Description:</strong></p>
                    <p>{ticket.description}</p>
                    <div style={{ marginTop: '1rem' }}>
                        <p><strong>Status:</strong> {ticket.status}</p>
                        <p><strong>Priority:</strong> {ticket.priority}</p>
                        <p><strong>Procurement Required:</strong> {ticket.procurementRequired ? 'Yes' : 'No'}</p>
                        <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                        <p><strong>Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
                        {ticket.assignedTo && (
                            <p><strong>Assigned To:</strong> {ticket.assignedTo.name} ({ticket.assignedTo.email})</p>
                        )}
                    </div>

                    {/* Status update */}
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                        <select
                            value={newStatus}
                            onChange={e => setNewStatus(e.target.value as Ticket['status'])}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                border: '1px solid var(--green-medium)',
                                borderRadius: 4,
                            }}
                        >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button
                            className="btn"
                            onClick={handleUpdateStatus}
                            disabled={updating}
                            style={{
                                background: 'var(--green-light)',
                                border: '1px solid var(--green-medium)',
                                color: '#fff',
                                padding: '0.5rem 1rem',
                            }}
                        >
                            {updating ? 'Updating…' : 'Update Status'}
                        </button>
                    </div>
                    {statusError && <p style={{ color: 'var(--green-dark)', marginTop: '0.5rem' }}>{statusError}</p>}

                    {/* Comments */}
                    <section className="comment-section" style={{ marginTop: '2rem' }}>
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
                                            By {c.createdBy.name} ({c.createdBy.role}) •{' '}
                                            {new Date(c.createdAt).toLocaleString()}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="comment-form" style={{ marginTop: '1rem' }}>
              <textarea
                  rows={3}
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Write your comment..."
                  style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid var(--green-medium)',
                      borderRadius: 4,
                  }}
              />
                            <button
                                className="btn"
                                onClick={handleAddComment}
                                style={{
                                    marginTop: '0.5rem',
                                    width: '100%',
                                    background: 'var(--green-light)',
                                    border: '1px solid var(--green-medium)',
                                    color: '#fff',
                                    padding: '0.5rem',
                                }}
                            >
                                Submit Comment
                            </button>
                        </div>
                    </section>
                </Card>

                {/* Procurement overlay to the right */}
                {mode !== 'none' && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '100%',
                        marginLeft: 16,
                        width: 300,
                    }}>
                        {mode === 'form' && (
                            <Card title="New Procurement Request" className="procurement-card">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label><strong>Item Name</strong></label>
                                        <input
                                            type="text"
                                            value={itemName}
                                            onChange={e => setItemName(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem',
                                                border: '1px solid var(--green-medium)',
                                                borderRadius: 4,
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label><strong>Quantity</strong></label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={quantity}
                                            onChange={e => setQuantity(Number(e.target.value))}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem',
                                                border: '1px solid var(--green-medium)',
                                                borderRadius: 4,
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label><strong>Estimated Cost</strong></label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={estimatedCost}
                                            onChange={e => setEstimatedCost(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem',
                                                border: '1px solid var(--green-medium)',
                                                borderRadius: 4,
                                            }}
                                        />
                                    </div>
                                    {procError && <p style={{ color: 'var(--green-dark)' }}>{procError}</p>}
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn"
                                            onClick={handleProcure}
                                            disabled={procLoading}
                                            style={{
                                                background: 'var(--green-light)',
                                                border: '1px solid var(--green-medium)',
                                                color: '#fff',
                                            }}
                                        >
                                            {procLoading ? 'Requesting…' : 'Submit'}
                                        </button>
                                        <button
                                            className="btn"
                                            onClick={() => setMode('none')}
                                            style={{
                                                background: '#fff',
                                                border: '1px solid var(--green-medium)',
                                                color: 'var(--green-medium)',
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        )}
                        {mode === 'list' && (
                            <Card title="Procurement Items" className="procurement-list-card">
                                {plLoading && <p>Loading…</p>}
                                {plError   && <p style={{ color: 'red' }}>{plError}</p>}
                                {!plLoading && procurements.length === 0 && <p>No items.</p>}
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {procurements.map(p => (
                                        <li key={p._id} style={{ marginBottom: '1rem' }}>
                                            <p><strong>{p.itemName}</strong> ×{p.quantity}</p>
                                            <p>Est: ${p.estimatedCost.toFixed(2)}</p>
                                            <p>Status: {p.status}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#555' }}>
                                                By {p.requestedBy.name} on {new Date(p.createdAt).toLocaleDateString()}
                                            </p>
                                            <hr/>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className="btn"
                                    onClick={() => setMode('none')}
                                    style={{
                                        marginTop: '0.5rem',
                                        background: '#fff',
                                        border: '1px solid var(--green-medium)',
                                        color: 'var(--green-medium)',
                                        width: '100%',
                                    }}
                                >
                                    Close
                                </button>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default TechnicianTicketDetail;
