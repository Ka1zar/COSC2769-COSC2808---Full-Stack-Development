// src/layouts/AdminDashboardLayout.jsx
import React from 'react';
import Sidebar from './Sidebar'; // Assuming you have a Sidebar component
import { Outlet } from 'react-router-dom'; // Import Outlet for nested routes
import Header from './Header';
import Footer from './Footer'; // Assuming you have a Footer component
import styles from './AdminDashboardLayout.module.css';

const AdminDashboardLayout = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          {/* Thay thế {children} bằng <Outlet /> */}
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
