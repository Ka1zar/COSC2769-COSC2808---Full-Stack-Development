import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from './OrganizerDashboard.module.css'; // Import CSS module
import { useNavigate } from 'react-router-dom'; // If using React Router

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // If using React Router

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('/my-events'); // API trả các event do user tạo
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        toast.error('Failed to load your events.');
      }
    };
    fetchEvents();
  }, []);

  const handleCreateNewEvent = () => {
    // Navigate to the event creation page
    navigate('/create-event'); // Adjust the route as needed
  };

  const handleEditEvent = (eventId) => {
    // Navigate to the event edit page
    navigate(`/edit-event/${eventId}`); // Adjust the route as needed
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/events/${eventId}`);
        setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
        toast.success('Event deleted successfully.');
      } catch (err) {
        console.error('Failed to delete event:', err);
        toast.error('Failed to delete the event.');
      }
    }
  };

  const handleViewRsvps = (eventId) => {
    // Navigate to the RSVP management page for this event
    navigate(`/event/${eventId}/rsvps`); // Adjust the route as needed
  };

  const handleViewDiscussion = (eventId) => {
    // Navigate to the discussion board for this event
    navigate(`/event/${eventId}/discussion`); // Adjust the route as needed
  };

  const handleDeleteDiscussion = async (eventId) => {
    if (window.confirm('Are you sure you want to delete the discussion for this event? This will remove all messages.')) {
      try {
        await axios.delete(`/events/${eventId}/discussion`); // API to delete discussion
        toast.success('Discussion deleted successfully.');
        // Optionally, provide feedback to the user that the discussion is now empty
      } catch (err) {
        console.error('Failed to delete discussion:', err);
        toast.error('Failed to delete the discussion.');
      }
    }
  };

  const handleNotifyAttendees = async (eventId) => {
    const notificationMessage = prompt('Enter the notification message for attendees:');
    if (notificationMessage) {
      try {
        await axios.post(`/events/${eventId}/notify`, { message: notificationMessage });
        toast.success('Notification sent to attendees.');
      } catch (err) {
        console.error('Failed to notify attendees:', err);
        toast.error('Failed to notify the attendees.');
      }
    }
  };

  return (
    <div className={styles.organizerDashboard}>
      <h1 className="text-2xl font-bold mb-6">My Created Events</h1>
      <button className={styles.primaryBtn + " mb-4"} onClick={handleCreateNewEvent}>+ Create New Event</button>

      {events.length === 0 ? (
        <p className="text-gray-600">You haven't created any events yet.</p>
      ) : (
        <div className={styles.eventGrid}>
          {events.map(event => (
            <div key={event._id} className={styles.eventCard}>
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className={styles.eventDescription}>{event.description}</p>
              <p className="text-sm text-gray-600">📅 {event.date} – 📍 {event.location}</p>
              <p className="text-sm mt-1">
                RSVP: ✅ {event.rsvpYes || 0} | ❌ {event.rsvpNo || 0} | ⏳ {event.rsvpPending || 0}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <button className={styles.secondaryBtn} onClick={() => handleEditEvent(event._id)}>Edit</button>
                <button className={styles.secondaryBtn} onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                <button className={styles.secondaryBtn} onClick={() => handleViewRsvps(event._id)}>View RSVPs</button>
                <button className={styles.secondaryBtn} onClick={() => handleViewDiscussion(event._id)}>View Discussion</button>
                <button className={styles.secondaryBtn} onClick={() => handleDeleteDiscussion(event._id)}>Delete Discussion</button>
                <button className={styles.primaryBtn} onClick={() => handleNotifyAttendees(event._id)}>Notify Attendees</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}