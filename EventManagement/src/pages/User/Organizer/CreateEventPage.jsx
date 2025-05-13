import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import styles from './CreateEventPage.module.css'; // Import CSS module

const CreateEventPage = () => {
    const navigate = useNavigate(); // Hook for navigation

    const [newEvent, setNewEvent] = useState({
        name: '',
        date: '',
        time: '',
        location: '',
        description: '',
        isPublic: false, // Add state for public/private
        // Add state for image file if you want to upload image during creation
        // image: null,
    });

    const [loading, setLoading] = useState(false); // State for loading indicator

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'checkbox') {
            setNewEvent({ ...newEvent, [name]: checked });
        } else if (type === 'file') {
            setNewEvent({ ...newEvent, [name]: files[0] }); // Handle file input
        }
        else {
            setNewEvent({ ...newEvent, [name]: value });
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Basic validation
        if (!newEvent.name || !newEvent.date || !newEvent.location || !newEvent.time) {
            toast.error('Please fill in all required fields.');
            return;
        }

        setLoading(true); // Start loading

        // Prepare data for backend
        // If you are including image upload, use FormData
        const formData = new FormData();
        formData.append('name', newEvent.name);
        formData.append('date', newEvent.date); // Send date string, backend should parse
        formData.append('time', newEvent.time);
        formData.append('location', newEvent.location);
        formData.append('description', newEvent.description);
        formData.append('isPublic', newEvent.isPublic);
        // If you add image upload to the form
        // if (newEvent.image) {
        //     formData.append('eventImage', newEvent.image); // 'eventImage' must match backend multer field name
        // }


        try {
            // Use the backend endpoint for creating events
            // If sending FormData (for image), axios automatically sets Content-Type
            const { data } = await axios.post('/api/organizer/events', formData); // Use formData if sending image, otherwise newEvent

            toast.success('Event created successfully!');
            setLoading(false);

            // Redirect to the newly created event's detail page or the organizer's dashboard
            navigate(`/events/${data._id}`); // Assuming backend returns the created event with _id
            // Or navigate('/user/organizer/event-management');

        } catch (error) {
            console.error('Error creating event:', error);
            setLoading(false);
            // Display specific error message from backend if available
            toast.error(error.response?.data?.message || error.message || 'Failed to create event.');
        }
    };

    return (
        <div className={styles.createEventPage}>
            <h1>Create New Event</h1>

            <form onSubmit={handleCreateEvent} className={styles.createEventForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Event Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter event name"
                        value={newEvent.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={newEvent.date}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={newEvent.time}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="Enter location"
                        value={newEvent.location}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Enter description"
                        value={newEvent.description}
                        onChange={handleInputChange}
                    />
                </div>

                 {/* Add file input for image if needed */}
                 <div className={styles.formGroup}>
                     <label htmlFor="image">Event Image:</label>
                     <input
                         type="file"
                         id="image"
                         name="image"
                         accept="image/*"
                         onChange={handleInputChange}
                     />
                 </div> 

                 <div className={styles.formGroup}>
                     <label htmlFor="isPublic" className={styles.checkboxLabel}>
                         <input
                             type="checkbox"
                             id="isPublic"
                             name="isPublic"
                             checked={newEvent.isPublic}
                             onChange={handleInputChange}
                         />
                         Make this event public
                     </label>
                 </div>


                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Event'}
                </button>
            </form>
        </div>
    );
};

export default CreateEventPage;
