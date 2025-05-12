// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const role = localStorage.getItem('role'); // Kiểm tra role người dùng (admin)

    // Nếu không phải là admin, chuyển hướng về trang login
    if (role !== 'admin') {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
