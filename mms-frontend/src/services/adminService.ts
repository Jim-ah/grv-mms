// src/services/adminService.ts
import api from './api';
import { AxiosResponse } from 'axios';

export interface AdminTicket {
    _id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    procurementRequired: boolean;
    createdBy: { _id: string; name: string; email: string };
    assignedTo?: { _id: string; name: string; email: string };
}

export interface AdminProcurement {
    _id: string;
    ticketId: { _id: string; title: string };
    itemName: string;
    quantity: number;
    estimatedCost: number;
    status: string;
    requestedBy: { _id: string; name: string; email: string; role: string };
    approvedBy?: { _id: string; name: string; email: string; role: string };
}

export const getAdminTickets = (): Promise<AxiosResponse<{ tickets: AdminTicket[] }>> =>
    api.get('/admin/tickets');

export const getAdminProcurements = (): Promise<AxiosResponse<AdminProcurement[]>> =>
    api.get('/admin/procurements');

export const updateProcurementStatus = (
    id: string,
    data: { status: 'Approved' | 'Rejected' }
) => api.patch<AdminProcurement>(`/procurements/${id}`, data);
