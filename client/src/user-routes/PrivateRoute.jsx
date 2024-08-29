import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        toast.error("please login first !!!");
        return <Navigate to="/login" replace />;
    } else {
        return children;
    }
};

export default ProtectedRoute;