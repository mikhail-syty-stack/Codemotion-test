import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface PublicRouteProps {
    children: ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
    const { token } = useAuth();

    if (token) {
        return <Navigate to="/my-items" replace />;
    }

    return <>{children}</>;
} 