// src/pages/Admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
// Import the CSS Module file
import styles from './UserManagement.module.css'; // <-- Import the CSS file here

// You might need to import icons for Edit and Disable actions (e.g., from react-icons/fa)
import { FaEdit, FaTrash, FaBan } from 'react-icons/fa';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    // You might need state for sorting, pagination, loading state etc.

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/users'); // Example API endpoint
                // Assuming the data structure is an array of user objects directly
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                // toast.error('Failed to load users.'); // Optional: show error toast
            }
        };
        fetchUsers();
    }, []); // Empty dependency array means this runs once on mount

    // TODO: Implement search filtering logic if needed
    // const filteredUsers = users.filter(user =>
    //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     user.role.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // TODO: Implement handler for Edit button
    const handleEdit = (userId) => {
        console.log('Edit user:', userId);
        // Implement logic to navigate to an edit page or open a modal
        // Example navigation: navigate(`/admin/users/edit/${userId}`);
    };

    // TODO: Implement handler for Disable/Delete button
    const handleDisable = (userId) => {
        console.log('Disable/Delete user:', userId);
        // Implement API call to disable or delete the user
        // After successful API call, update the 'users' state to reflect the change
        // Example: axios.put(`/users/${userId}/status`, { status: 'inactive' }).then(...)
    };


    return (
        // Use class from the CSS Module for the main container
        <div className={styles.userManagementContainer}>
            {/* Page Title */}
            <h1 className={styles.pageTitle}>User Management</h1>
            {/* Page Description */}
            <p className={styles.pageDescription}>Manage user accounts and permissions</p>

            {/* Search bar */}
            <div className={styles.searchBar}>
                {/* TODO: Add a search icon inside the input or next to it */}
                <input
                    type="text"
                    placeholder="Search users..."
                    className={styles.searchInput} // Use class from the CSS Module
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>


            {/* User Table */}
            <div className={styles.tableContainer}> {/* Container for table styling/scrolling */}
                <table className={styles.usersTable}> {/* Main table element */}
                    <thead>
                        <tr>
                            <th>Name</th> {/* Table Header */}
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Status</th>
                            <th>Actions</th> {/* Column for action buttons */}
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            // Use filteredUsers here if implementing search
                            users.map((user) => (
                                <tr key={user.id}> {/* Table Row for each user */}
                                    {/* Name Cell */}
                                    <td className={styles.user_name_cell}> {/* Use class from CSS Module (using snake_case or camelCase) */}
                                        {/* TODO: Add Avatar logic here */}
                                        <div className={styles.userAvatar}> {/* Use class from CSS Module */}
                                            {/* Display first letter of name or email */}
                                            {(user.name ? user.name.charAt(0) : user.email.charAt(0)).toUpperCase()}
                                        </div>
                                        <div className={styles.userNameDetails}> {/* Use class from CSS Module */}
                                            <span className={styles.userFullName}>{user.name || 'N/A'}</span> {/* Use class from CSS Module */}
                                            <span className={styles.userUsername}>{user.username || user.email}</span> {/* Use class from CSS Module */}
                                        </div>
                                    </td>
                                    {/* Email Cell */}
                                    <td>{user.email}</td>
                                    {/* Role Cell with Badge - Use classes from CSS Module */}
                                    <td>
                                        {/* Apply role-specific class dynamically */}
                                        <span className={`${styles.roleBadge} ${styles[`role-${user.role ? user.role.toLowerCase() : 'unknown'}`]}`}>
                                            {user.role || 'Unknown'}
                                        </span>
                                    </td>
                                     {/* Joined Date Cell */}
                                    <td>{user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'}</td> {/* Format date */}
                                    {/* Status Cell with Icon/Badge - Use classes from CSS Module */}
                                    <td>
                                         {/* Apply status-specific class dynamically */}
                                         <span className={`${styles.statusBadge} ${styles[`status-${user.status ? user.status.toLowerCase() : 'unknown'}`]}`}>
                                            <FaCheckCircle className={styles.statusIcon} /> {/* Example icon, replace with actual icon */}
                                            {/* TODO: Add status icon (e.g., FaCheckCircle for Active) */}
                                             {user.status || 'Unknown'}
                                         </span>
                                    </td>
                                    {/* Actions Cell with Buttons - Use classes from CSS Module */}
                                    <td className={styles.actionsCell}> {/* Use class from CSS Module */}
                                        {/* Edit Button */}
                                        <button onClick={() => handleEdit(user.id)} className={`${styles.actionButton} ${styles.editButton}`}>
                                             {/* TODO: Add Edit icon */}
                                             Edit
                                        </button>
                                        {/* Disable Button */}
                                         {/* TODO: Add logic to show Disable or Delete button based on user status/permissions */}
                                        <button onClick={() => handleDisable(user.id)} className={`${styles.actionButton} ${styles.disableButton}`}>
                                             {/* TODO: Add Disable/Delete icon */}
                                             Disable
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // Display message if no users are loaded
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                    {searchTerm ? 'No users found matching your search.' : 'Loading users... or No users available.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div> {/* End table-container */}

            {/* TODO: Add Pagination component here if needed */}

        </div> // End user-management-container
    );
};

export default UserManagement;