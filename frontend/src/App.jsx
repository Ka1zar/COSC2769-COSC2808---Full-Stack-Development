import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import AdminDashboard from './pages/Admin/AdminDashBoard.jsx';
import Settings from './pages/Admin/Settings.jsx';
import { Toaster } from 'react-hot-toast';

import { UserContextProvider } from './pages/User/UserContext';

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
