// AdminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../pages/Admin/AdminDashBoard';
import Settings from '../pages/Setting/Settings';  // Import Settings
import EventManagement from '../pages/Admin/EventManagement';  // Import Event Management
import UserManagement from '../pages/Admin/UserManagement';  // Import User Management
import PrivateRoute from './PrivateRoute';  // Giả sử bạn đã có PrivateRoute bảo vệ route

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/event-management" element={<PrivateRoute><EventManagement /></PrivateRoute>} />
            <Route path="/user-management" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
        </Routes>
    );
};

export default AdminRoutes;
