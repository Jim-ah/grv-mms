import {JSX} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
    allowedRoles: string[];      // e.g. ['Admin'], or ['Technician','Engineer']
    children: JSX.Element;
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
    const { user } = useAuth();
    console.log("USER", user);
    const location = useLocation();

    if (!user) {
        // not logged in
        return (
            <Navigate to="/login" state={{ from: location }} replace />
        );
    }

    if (!allowedRoles.includes(user.role)) {
        // logged in, but wrong role
        return <Navigate to="/" replace />;
    }

    // authorized
    return children;
}
