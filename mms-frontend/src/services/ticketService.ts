// src/services/ticketService.ts
import api from './api';
import { AxiosResponse } from 'axios';

/** Minimal user reference for relationships */
export interface UserRef {
    _id: string;
    name: string;
    email: string;
}

/** A maintenance ticket */
export interface Ticket {
    _id: string;
    title: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Closed';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    procurementRequired: boolean;
    createdBy: UserRef;
    createdAt: string;
    updatedAt: string;

    /** ID of engineer who assigned this ticket */
    assignedBy?: string;
    /** Technician to whom this ticket is assigned */
    assignedTo?: UserRef;
}

/** Pagination metadata */
export interface Pagination {
    total: number;
    page: number;
    pages: number;
    limit: number;
}

/** Response shape for listing tickets */
export interface TicketsResponse {
    tickets: Ticket[];
    pagination: Pagination;
}

/** Create a new ticket */
export const createTicket = (data: {
    title: string;
    description: string;
    priority?: 'Low' | 'Medium' | 'High' | 'Critical';
    procurementRequired?: boolean;
}) => api.post<Ticket>('/tickets', data);

/** Fetch tickets belonging to the current user */
export const getMyTickets = () =>
    api.get<Ticket[]>('/tickets/my');

/** Fetch a single ticket by ID */
export const getTicket = (id: string) =>
    api.get<{ ticket: Ticket }>(`/tickets/${id}`);

/** A comment on a ticket */
export interface Comment {
    _id: string;
    ticketId: string;
    content: string;
    createdBy: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    isInternal: boolean;
    createdAt: string;
    updatedAt: string;
}

/** Post a new comment */
export const addComment = (
    ticketId: string,
    data: { content: string; isInternal: boolean }
) => api.post<Comment>(`/tickets/${ticketId}/comments`, data);

/** Fetch comments for a ticket */
export const getTicketComments = (ticketId: string) =>
    api.get<Comment[]>(`/tickets/${ticketId}/comments`);

/** Fetch all tickets (Admin/Engineer) with optional client filter & pagination */
export const getAllTickets = (params?: {
    client?: string;
    page?: number;
    limit?: number;
}): Promise<AxiosResponse<TicketsResponse>> =>
    api.get<TicketsResponse>('/tickets', { params });

/** Payload for assigning a ticket */
export interface AssignPayload {
    assignedTo: string;
}

/** Assign this ticket to a technician */
export const assignTicket = (
    ticketId: string,
    data: AssignPayload
): Promise<AxiosResponse<Ticket>> =>
    api.patch<Ticket>(`/tickets/${ticketId}`, data);

/** Fetch tickets assigned to the current technician */
export const getAssignedTickets = () =>
    api.get<Ticket[]>('/tickets/assigned');

/** PATCH /tickets/:id to update status */
export const updateTicketStatus = (
    ticketId: string,
    data: { status: Ticket['status'] }
) => api.patch<Ticket>(`/tickets/${ticketId}`, data);


export interface Procurement {
    _id: string;
    ticketId: string;
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
    updatedAt: string;
}

// POST /tickets/:ticketId/procurements
export const requestProcurement = (
    ticketId: string,
    data: {
        itemName: string;
        quantity: number;
        estimatedCost: number;
    }
): Promise<AxiosResponse<Procurement>> =>
    api.post<Procurement>(`/tickets/${ticketId}/procurements`, data);


// new: shape of a procurement when fetched by engineer
export interface ProcurementWithTicket {
    _id: string;
    ticketId: {
        _id: string;
        title: string;
        status: string;
    };
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
    updatedAt: string;
}

// GET /api/procurements
export const getProcurements = (): Promise<AxiosResponse<ProcurementWithTicket[]>> =>
    api.get<ProcurementWithTicket[]>('/procurements');

// NEW: PATCH /api/procurements/:id { status }
export const updateProcurementStatus = (
    id: string,
    data: { status: 'Approved' | 'Rejected' }
): Promise<AxiosResponse<ProcurementWithTicket>> =>
    api.patch<ProcurementWithTicket>(`/procurements/${id}`, data)
