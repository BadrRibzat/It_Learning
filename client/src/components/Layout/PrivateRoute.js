import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
export default function PrivateRoute({ children }) {
    const { user } = useAuth();
    const location = useLocation();
    if (!user) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    return children;
}
