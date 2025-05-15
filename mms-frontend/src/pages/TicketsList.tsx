import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMyTickets, Ticket } from '../services/ticketService';
import { logout } from '../services/authService';

const TicketsList: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    const loadTickets = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getMyTickets();
            setTickets(res.data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    // reload only when back on /tickets
    useEffect(() => {
        if (location.pathname === '/tickets') {
            loadTickets();
        }
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    // individual card with expand/collapse
    const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
        const [expanded, setExpanded] = useState(false);
        const goDetail = () => navigate(`/tickets/${ticket._id}`);

        return (
            <div
                className="ticket-card"
                style={{ cursor: 'pointer' }}
                onClick={goDetail}
            >
                <h3 className="ticket-card-title">{ticket.title}</h3>

                <p className={`ticket-card-desc${expanded ? ' expanded' : ''}`}>
                    {ticket.description}
                </p>

                {ticket.description.length > 100 && (
                    <button
                        className="btn"
                        style={{
                            padding: 0,
                            background: 'none',
                            border: 'none',
                            marginBottom: '0.5rem',
                        }}
                        onClick={e => {
                            e.stopPropagation();
                            setExpanded(x => !x);
                        }}
                    >
                        {expanded ? 'Show less' : 'Read more'}
                    </button>
                )}

                <div className="ticket-card-meta">
                    Status: {ticket.status} · Priority: {ticket.priority}
                    <br />
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                </div>
            </div>
        );
    };

    return (
        <main style={{ padding: '2rem' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                }}
            >
                <h1>My Tickets</h1>
                <div>
                    <button className="btn" onClick={() => navigate('create')}>
                        Create Ticket
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

            {loading && <p>Loading…</p>}
            {error   && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && tickets.length === 0 && <p>No tickets yet.</p>}

            {!loading && tickets.length > 0 && (
                <div className="ticket-grid">
                    {tickets.map(t => (
                        <TicketCard key={t._id} ticket={t} />
                    ))}
                </div>
            )}
        </main>
    );
};

export default TicketsList;
