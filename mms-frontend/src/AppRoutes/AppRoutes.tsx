// src/AppRoutes.tsx
import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';

// Client pages
import TicketsList from '../pages/TicketsList';
import CreateTicket from '../pages/CreateTicket';
import TicketDetail from '../pages/TicketDetail';

// Engineer page
import EngineerTickets from '../pages/EngineerTickets';

// Admin pages
import AdminLayout from '../components/AdminLayout';
import AdminDashboard from '../pages/AdminDashboard';
import TicketDetailEngineer from "../pages/TicketDetailEngineer.tsx";
import TechnicianTicket from "../pages/TechnicianTicket.tsx";
import TechnicianTicketDetail from "../pages/TechnicianTicketDetail.tsx";
import EngineerProcurements from "../pages/EngineerProcurement.tsx";
import AdminTicketDetail from "../pages/AdminTicketDetails.tsx";

const AppRoutes: React.FC = () =>
    useRoutes([
        // Public
        { path: '/login', element: <Login /> },

        // Client: view/create/detail
        {
            path: '/tickets',
            element: (
                <ProtectedRoute allowedRoles={['Client', 'Engineer']}>
                    <TicketsList />
                </ProtectedRoute>
            ),
        },
        {
            path: '/tickets/create',
            element: (
                <ProtectedRoute allowedRoles={['Client']}>
                    <CreateTicket />
                </ProtectedRoute>
            ),
        },
        {
            path: '/tickets/:ticketId',
            element: (
                <ProtectedRoute allowedRoles={['Client']}>
                    <TicketDetail />
                </ProtectedRoute>
            ),
        },
        {
            path: '/engineer/tickets/:ticketId',
            element: (
                <ProtectedRoute allowedRoles={[ 'Engineer']}>
                    <TicketDetailEngineer/>
                </ProtectedRoute>
            ),
        },

        {
            path: '/engineer',
            element: (
                <ProtectedRoute allowedRoles={['Engineer']}>
                     <EngineerTickets/>
                </ProtectedRoute>
            ),
            children: [
                { index: true, element: <EngineerTickets /> },
                { path: ':ticketId', element: <TicketDetailEngineer/> },  // 👈 add this
            ],
        },
        {
            path: '/engineer/procurements/',
            element: (
                <ProtectedRoute allowedRoles={['Engineer']}>
                    <EngineerProcurements/>
                </ProtectedRoute>
            ),
            children: [
                { index: true, element: <EngineerTickets /> },
                { path: ':ticketId', element: <TicketDetailEngineer/> },  // 👈 add this
            ],
        },
        {
            path: '/technician',
            element: (
                <ProtectedRoute allowedRoles={['Technician']}>
                    <TechnicianTicket/>
                </ProtectedRoute>
            ),
            children: [
                { index: true, element: <TechnicianTicket /> },
                { path: ':ticketId', element: <TechnicianTicketDetail/> },  // 👈 add this
            ],
        },
        {
            path: '/technician/tickets/:ticketId',
            element: (
                <ProtectedRoute allowedRoles={[ 'Technician']}>
                    <TechnicianTicketDetail/>
                </ProtectedRoute>
            ),
        },


        // Admin only
        {
            path: '/admin',
            element: (
                <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminLayout />
                </ProtectedRoute>
            ),
            children: [{ index: true, element: <AdminDashboard /> }],
        },
        {
            path: '/admin/tickets/:ticketId',
            element: (
                <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminTicketDetail/>
                </ProtectedRoute>
            ),
            children: [{ index: true, element: <AdminDashboard /> }],
        },



        // Fallback
        { path: '*', element: <Navigate to="/login" replace /> },
    ]);

export default AppRoutes;
