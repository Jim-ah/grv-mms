// src/pages/EngineerTickets.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAllTickets, Ticket } from '../services/ticketService';
import { logout } from '../services/authService';

const EngineerTickets: React.FC = () => {
    const [filter, setFilter]   = useState('');
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);
    const navigate = useNavigate();

    const loadTickets = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getAllTickets({ client: filter || undefined, page: 1, limit: 100 });
            setTickets(res.data.tickets);
        } catch (err: unknown) {
            let msg = 'Failed to load tickets';
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                msg = err.response.data.message;
            } else if (err instanceof Error) {
                msg = err.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            await loadTickets();
        })();
    }, [filter]);
    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
        const [expanded, setExpanded] = useState(false);
        const goDetail = () => navigate(`/engineer/tickets/${ticket._id}`);
        return (
            <div className="ticket-card" style={{ cursor: 'pointer' }} onClick={goDetail}>
                <h3 className="ticket-card-title">{ticket.title}</h3>
                <p className={`ticket-card-desc${expanded ? ' expanded' : ''}`}>
                    {ticket.description}
                </p>
                {ticket.description.length > 100 && (
                    <button
                        className="btn"
                        style={{ padding: 0, background: 'none', border: 'none', marginBottom: '0.5rem' }}
                        onClick={e => { e.stopPropagation(); setExpanded(x => !x); }}
                    >
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                )}
                <div className="ticket-card-meta">
                    Client: {ticket.createdBy.name} · {ticket.createdBy.email}
                    <br />
                    Status: {ticket.status} · Priority: {ticket.priority}
                </div>
            </div>
        );
    };

    return (
        <main className="engineer-tickets-page" style={{ padding: '2rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
            }}>
                <h1>All Tickets</h1>
                <div>
                    <button className="btn" onClick={() => navigate('/engineer')}>
                        Refresh
                    </button>
                    <button
                        className="btn"
                        style={{ marginLeft: '0.5rem' }}
                        onClick={() => navigate('/engineer/procurements')}
                    >
                        Procurements
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

            <input
                type="text"
                placeholder="Filter by client name or email"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{
                    padding: '0.5rem',
                    border: '1px solid #cbd5e0',
                    borderRadius: '0.375rem',
                    marginBottom: '1rem',
                    width: '100%',
                    maxWidth: '400px',
                }}
            />

            {loading && <p>Loading…</p>}
            {error   && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && tickets.length === 0 && <p>No tickets found.</p>}

            {!loading && tickets.length > 0 && (
                <div className="ticket-grid">
                    {tickets.map(t => <TicketCard key={t._id} ticket={t} />)}
                </div>
            )}
        </main>
    );
};

export default EngineerTickets;
