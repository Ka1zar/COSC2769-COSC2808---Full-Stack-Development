import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from './EventManagement.module.css'; // Import CSS module

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(true); // Mock organizer role, replace with actual auth logic
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get('http://localhost:5000/events');
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events.');
        toast.error('Failed to load events.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleManageClick = (eventId) => {
    setSelectedEventId(eventId);
    toast.info(`Managing event with ID: ${eventId}`);
    // In a real application, you would likely navigate to a detailed event management page
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:5000/events/${eventId}`);
        setEvents(events.filter((event) => event.id !== eventId));
        toast.success('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event.');
      }
    }
  };

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async () => {
    try {
      const { data } = await axios.post('http://localhost:5000/events', newEvent);
      setEvents([...events, data]);
      setNewEvent({ name: '', date: '', time: '', location: '', description: '' });
      setShowCreateForm(false);
      toast.success('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event.');
    }
  };

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  return (
    <div className={styles.eventManagement}>
      <h1>Event Management</h1>

      {loading && <p>Loading events...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {isOrganizer && (
        <div className={styles.organizerControls}>
          <button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel Create' : 'Create New Event'}
          </button>

          {showCreateForm && (
            <div className={styles.createEventForm}>
              <h2>Create New Event</h2>
              <input
                type="text"
                name="name"
                placeholder="Event Name"
                value={newEvent.name}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
              />
              <input
                type="time"
                name="time"
                value={newEvent.time}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={newEvent.location}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newEvent.description}
                onChange={handleInputChange}
              />
              <button onClick={handleCreateEvent}>Create Event</button>
            </div>
          )}
        </div>
      )}

      <div className={styles.eventList}>
        <h2>Available Events</h2>
        {events.map((event) => (
          <div key={event.id} className={styles.eventCard}>
            <h3>{event.name}</h3>
            <p>Date: {event.date}</p>
            <p>Time: {event.time}</p>
            <p>Location: {event.location}</p>
            {isOrganizer ? (
              <div className={styles.organizerActions}>
                <button onClick={() => handleManageClick(event.id)}>Manage</button>
                <button className={styles.deleteButton} onClick={() => handleDeleteEvent(event.id)}>
                  Delete
                </button>
              </div>
            ) : (
              <button onClick={() => toast.info(`You are participating in: ${event.name}`)}>
                Participate
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedEvent && isOrganizer && (
        <div className={styles.eventDetails}>
          <h2>Event Details</h2>
          <h3>{selectedEvent.name}</h3>
          <p>Description: {selectedEvent.description}</p>
          <p>Date: {selectedEvent.date}</p>
          <p>Time: {selectedEvent.time}</p>
          <p>Location: {selectedEvent.location}</p>

          {/* Placeholder for Discussion Board */}
          <div className={styles.discussionPlaceholder}>
            <h3>Discussion</h3>
            <p>Discussion board will be integrated here for event ID: {selectedEvent.id}</p>
          </div>

          {/* Placeholder for Notifications related to this event */}
          <div className={styles.notificationsPlaceholder}>
            <h3>Notifications</h3>
            <ul>
              <li>Reminder: Event starts soon!</li>
              <li>Update: Location might have changed (check email).</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;