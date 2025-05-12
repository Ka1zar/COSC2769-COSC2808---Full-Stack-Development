import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Assuming react-router-dom for routing
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./EventDetailPage.module.css"; // Import CSS module
import DiscussionBoard from "./DiscussionBoard"; // Import the new DiscussionBoard component

// Placeholder for user role and invitation status.
// In a real application, these would come from your authentication context or API calls.
const mockUserRole = "organizer"; // Can be "attendee", "organizer", "admin" - Set to 'organizer' for testing image upload view
const mockInvitationStatus = {
    isInvited: true, // Is the current user invited to this event?
    invitationId: "mock-invitation-id-123", // The ID of the invitation for this user
    response: null, // Can be null, "yes", or "no"
};

const EventDetailPage = () => {
    // Get the event ID from the URL parameters
    const { eventId } = useParams();
    const navigate = useNavigate(); // For navigation (e.g., after deletion)

    const [event, setEvent] = useState(null);
    const [loadingEvent, setLoadingEvent] = useState(true);
    const [eventError, setEventError] = useState(null);

    // Discussion state is now managed here and passed to DiscussionBoard
    const [discussions, setDiscussions] = useState([]);
    const [loadingDiscussions, setLoadingDiscussions] = useState(true);
    const [discussionError, setDiscussionError] = useState(null);
    const [newComment, setNewComment] = useState(""); // Comment input state

    // State for the current user's invitation status for this specific event
    // This would ideally be part of the event data fetched or a separate API call
    const [userInvitation, setUserInvitation] = useState(mockInvitationStatus); // Using mock data for now

    // State for image upload
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);


    // --- Fetch Event Data and User's Invitation Status ---
    useEffect(() => {
        const fetchEvent = async () => {
            setLoadingEvent(true);
            setEventError(null);
            try {
                // API to get event details.
                // It should ideally also return the current user's invitation status if invited.
                const { data } = await axios.get(`/events/${eventId}`);
                setEvent(data.event); // Assuming the event data is nested under 'event'
                // In a real app, you'd update userInvitation state based on data.userInvitation
                // setUserInvitation(data.userInvitation || { isInvited: false, invitationId: null, response: null });

                // Set initial image preview if event already has an image
                if (data.event && data.event.eventImageUrl) {
                    setImagePreviewUrl(data.event.eventImageUrl);
                }

                setLoadingEvent(false);
            } catch (error) {
                console.error('Error fetching event:', error);
                setEventError('Failed to load event details.');
                toast.error('Failed to load event details.');
                setLoadingEvent(false);
            }
        };

        fetchEvent();
    }, [eventId]); // Re-run effect if eventId changes (e.g., navigating between event pages)

    // --- Fetch Discussion Data ---
    useEffect(() => {
        if (event) { // Only fetch discussion if event data is loaded
            const fetchDiscussion = async () => {
                setLoadingDiscussions(true);
                setDiscussionError(null);
                try {
                    // API to fetch discussion for the event
                    const { data } = await axios.get(`/events/${eventId}/discussions`);
                    setDiscussions(data); // Assuming data is an array of comments
                    setLoadingDiscussions(false);
                } catch (error) {
                    console.error('Error fetching discussion:', error);
                    setDiscussionError('Failed to load discussion.');
                    toast.error('Failed to load discussion.');
                    setLoadingDiscussions(false);
                }
            };
            fetchDiscussion();
        }
    }, [eventId, event]); // Re-run if eventId or event data changes

    // --- Invitation Response ---
    const respondInvitation = async (response) => {
        if (!userInvitation.isInvited || !userInvitation.invitationId) {
            toast.error("You are not invited to this event.");
            return;
        }
        try {
            // API to respond to the invitation using the user's specific invitation ID
            await axios.post(`/invitations/${userInvitation.invitationId}/respond`, { response });

            // Optimistically update the UI
            setUserInvitation(prevState => ({ ...prevState, response }));

            toast.success(`Successfully responded: ${response === 'yes' ? 'Accepted' : 'Declined'}`);
        } catch (error) {
            console.error('Error responding to invitation:', error);
            toast.error('Failed to respond to invitation.');
        }
    };

    // --- Comment Handling ---
    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const postComment = async (currentEventId) => { // Accept eventId as argument
        if (!newComment.trim()) {
            toast.error('Please enter a comment.');
            return;
        }
        // You might want to check if the user is allowed to comment (e.g., invited/attending)
        if (!userInvitation.isInvited && mockUserRole === 'attendee') {
             toast.error('You must be invited or attending to comment.');
             return;
        }

        try {
            // API to post comment to the event's discussion board
            // Assuming the backend associates the comment with the logged-in user
            const { data } = await axios.post(`/events/${currentEventId}/discussions`, { text: newComment });

            // Add the new comment to the discussions list
            setDiscussions(prevDiscussions => [...prevDiscussions, data]); // Assuming the API returns the new comment object

            setNewComment("");
            toast.success('Comment posted successfully.');
        } catch (error) {
            console.error('Error posting comment:', error);
            toast.error('Failed to post comment.');
        }
    };

    // --- Image Upload Handling ---
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Create a preview URL for the selected image
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setSelectedImage(null);
            // If no file is selected, revert to the event's original image URL
            setImagePreviewUrl(event?.eventImageUrl || null);
        }
    };


    // --- Admin/Organizer Actions (Placeholders) ---
    const handleEditEvent = async () => {
        // In a real application, you would gather all the event data fields
        // (name, date, time, location, description, etc.) from input fields
        // and prepare the data to send to the backend.

        const formData = new FormData();
        // Append other event data fields to formData here
        // formData.append('eventName', eventNameState);
        // formData.append('eventDate', eventDateState);
        // ... other fields

        if (selectedImage) {
            // Append the selected image file to the form data
            formData.append('eventImage', selectedImage);
        }
        // If no new image is selected but there was an old one,
        // you might need to send a flag or the old URL depending on your backend API
        // else if (imagePreviewUrl && !selectedImage) {
        //     formData.append('existingImageUrl', imagePreviewUrl);
        // }


        try {
            // API to update the event.
            // Use a PUT or PATCH request.
            // The backend should handle receiving the image file via FormData.
            // Adjust the API endpoint and method as per your backend implementation
            await axios.put(`/events/${eventId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Important for sending files
                }
            });
            toast.success("Event updated successfully.");
            // Optionally refresh event data after successful update
            // fetchEvent(); // You would need to make fetchEvent accessible or re-fetch manually
        } catch (error) {
            console.error('Error updating event:', error);
            toast.error('Failed to update event.');
        }
    };

    const handleDeleteEvent = async () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                // API to delete the event
                await axios.delete(`/events/${eventId}`);
                toast.success("Event deleted successfully.");
                // Navigate the user away, perhaps back to the dashboard or event list
                navigate('/dashboard'); // Adjust the path as needed
            } catch (error) {
                console.error('Error deleting event:', error);
                toast.error('Failed to delete event.');
            }
        }
    };

    // --- Render Loading/Error States ---
    if (loadingEvent) {
        return <div className={styles.container}><div className={styles.loading}>Loading event details...</div></div>;
    }

    if (eventError) {
        return <div className={styles.container}><div className={styles.error}>{eventError}</div></div>;
    }

    if (!event) {
         return <div className={styles.container}><div className={styles.emptyState}>Event not found.</div></div>;
    }

    // --- Render Event Details ---
    return (
        <div className={styles.container}>
            <div className={styles.eventDetails}>

                {/* Event Image Display (shows current image or preview of new one) */}
                <div className={styles.eventImageContainer}>
                    {imagePreviewUrl ? (
                        <img src={imagePreviewUrl} alt={`Event: ${event.eventName}`} className={styles.eventImage} />
                    ) : (
                        <div className={styles.eventImagePlaceholder}>No Image Available</div>
                    )}
                </div>

                {/* Event Info */}
                <h1 className={styles.eventName}>{event.eventName}</h1>
                {event.description && <p className={styles.eventDescription}>{event.description}</p>}

                <div className={styles.eventInfoBlock}>
                    <p className={styles.eventInfo}><i className="far fa-calendar-alt"></i> {event.eventDate}</p>
                    <p className={styles.eventInfo}><i className="far fa-clock"></i> {event.eventTime}</p>
                    <p className={styles.eventInfo}><i className="fas fa-map-marker-alt"></i> {event.location}</p>
                    {event.organizerName && <p className={styles.eventInfo}>Organized by: {event.organizerName}</p>}
                </div>

                {/* --- Role-Based Actions --- */}

                {/* Attendee Actions: Respond to Invitation */}
                {mockUserRole === 'attendee' && userInvitation.isInvited && (
                    <div className={styles.responseArea}>
                        <h4>Your Invitation Status:</h4>
                        {userInvitation.response ? (
                            <p className={styles.respondedText}>
                                Status: <span className={userInvitation.response === 'yes' ? styles.accepted : styles.declined}>
                                    {userInvitation.response === 'yes' ? 'Accepted' : 'Declined'}
                                </span>
                            </p>
                        ) : (
                            <div className={styles.responseButtons}>
                                <button className={`${styles.button} ${styles.acceptBtn}`} onClick={() => respondInvitation('yes')}>Accept</button>
                                <button className={`${styles.button} ${styles.declineBtn}`} onClick={() => respondInvitation('no')}>Decline</button>
                            </div>
                        )}
                    </div>
                )}

                 {/* Organizer/Admin Actions: Edit/Delete and Image Upload */}
                {(mockUserRole === 'organizer' || mockUserRole === 'admin') && (
                    <div className={styles.adminActions}>
                        <h4>Manage Event:</h4>

                        {/* Image Upload Input */}
                        <div className={styles.imageUploadSection}>
                            <label htmlFor="eventImage" className={styles.imageUploadLabel}>
                                Choose Event Image
                            </label>
                            <input
                                type="file"
                                id="eventImage"
                                accept="image/*" // Accept only image files
                                onChange={handleImageChange}
                                className={styles.imageUploadInput}
                            />
                            {/* Optional: Display file name or status */}
                            {selectedImage && <span className={styles.selectedFileName}>{selectedImage.name}</span>}
                        </div>


                        <button className={`${styles.button} ${styles.editBtn}`} onClick={handleEditEvent}>Save Changes</button> {/* Changed text to Save Changes */}
                        {/* Only Admin can delete */}
                        {mockUserRole === 'admin' && (
                            <button className={`${styles.button} ${styles.deleteBtn}`} onClick={handleDeleteEvent}>Delete Event</button>
                        )}
                    </div>
                )}


                {/* --- Discussion Board Component --- */}
                 {/* Render DiscussionBoard if user is allowed to see/participate */}
                 {(userInvitation.isInvited || mockUserRole === 'organizer' || mockUserRole === 'admin') && (
                    <DiscussionBoard
                        eventId={eventId} // Pass the current event ID
                        discussions={discussions}
                        loading={loadingDiscussions}
                        error={discussionError}
                        newComment={newComment}
                        onCommentChange={handleCommentChange}
                        onPostComment={postComment} // Pass the postComment function
                    />
                 )}

            </div>
        </div>
    );
};

export default EventDetailPage;