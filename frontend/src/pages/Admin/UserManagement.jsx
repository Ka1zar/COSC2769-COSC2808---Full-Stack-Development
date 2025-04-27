// UserManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/users');
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Failed to load users.');
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="user-management">
            <h1>User Management</h1>
            <div>
                {users.map((user) => (
                    <div key={user.id} className="user">
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                        <button>Manage</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;
