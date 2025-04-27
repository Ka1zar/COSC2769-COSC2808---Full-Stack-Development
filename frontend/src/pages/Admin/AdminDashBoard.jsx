// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const [invitationsSent, setInvitationsSent] = useState(0);
    const [recipients, setRecipients] = useState([]);
    const [rsvpResponses, setRsvpResponses] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/admin/dashboard');
                setInvitationsSent(data.invitationsSent);
                setRecipients(data.recipients);
                setRsvpResponses(data.rsvpResponses);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                toast.error('Failed to load dashboard data.');
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="stats">
                <div className="stat-item">
                    <h3>Number of Invitations Sent</h3>
                    <p>{invitationsSent}</p>
                </div>
                <div className="stat-item">
                    <h3>Recipients</h3>
                    <ul>
                        {recipients.map((recipient, index) => (
                            <li key={index}>{recipient.name} ({recipient.email})</li>
                        ))}
                    </ul>
                </div>
                <div className="stat-item">
                    <h3>RSVP Responses</h3>
                    <ul>
                        {rsvpResponses.map((response, index) => (
                            <li key={index}>
                                {response.name} - {response.status}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
