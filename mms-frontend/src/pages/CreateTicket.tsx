// src/pages/CreateTicket.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createTicket } from '../services/ticketService';
import Card from '../components/Card';                          // Reusable card wrapper :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
import { FiPlusCircle } from 'react-icons/fi';                 // Optional icon

const CreateTicket: React.FC = () => {
    const [title, setTitle]             = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority]       = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
    const [error, setError]             = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await createTicket({ title, description, priority });
            navigate('/tickets', { replace: true });
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="ticket-form-container">
            <Card
                icon={<FiPlusCircle />}
                title="Create a New Ticket"
                className="ticket-form-card"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="ticket-title">Title</label>
                        <input
                            id="ticket-title"
                            type="text"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="ticket-desc">Description</label>
                        <textarea
                            id="ticket-desc"
                            required
                            rows={4}
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="ticket-priority">Priority</label>
                        <select
                            id="ticket-priority"
                            value={priority}
                            onChange={e => setPriority(e.target.value as any)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</p>}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn">
                            Submit
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => navigate('/tickets')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateTicket;
