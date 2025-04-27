// EventManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EventManagement = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/events');
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
                toast.error('Failed to load events.');
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="event-management">
            <h1>Event Management</h1>
            <div>
                {events.map((event) => (
                    <div key={event.id} className="event">
                        <h2>{event.name}</h2>
                        <p>{event.date}</p>
                        <button>Manage</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventManagement;
