import React from 'react';
import styles from './EventList.module.css'; // Import CSS module
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// EventList component props:
// - events: An array of event objects to display
// - loading: Boolean indicating if events are currently loading
// - error: String containing an error message if loading failed
// - title: Title for the list section (e.g., "Upcoming Events", "My Hosted Events")
// - emptyMessage: Message to display when the event list is empty
// - showAttendeeCount: Boolean to conditionally show the attendee count overlay
// - showResponseStatus: Boolean to conditionally show the attendee's response status
// - onEventClick: Function to call when an event card is clicked (e.g., navigate to detail page)

const EventList = ({
    events,
    loading,
    error,
    title,
    emptyMessage,
    showAttendeeCount = false, // Default to false
    showResponseStatus = false, // Default to false
    onEventClick, // Function to handle clicks
}) => {
    const navigate = useNavigate(); // Hook for navigation

    // Handle click on an event card
    const handleCardClick = (eventId) => {
        if (onEventClick) {
            onEventClick(eventId); // Use the provided click handler if available
        } else {
            // Default behavior: navigate to the Event Detail Page
            navigate(`/events/${eventId}`);
        }
    };

    return (
        <div className={styles.eventListContainer}>
            {title && <h2 className={styles.sectionTitle}>{title}</h2>}

            {loading ? (
                <div className={styles.loading}>Loading events...</div>
            ) : error ? (
                <div className={styles.error}>{error}</div>
            ) : events.length === 0 ? (
                <div className={styles.emptyState}>{emptyMessage || 'No events found.'}</div>
            ) : (
                <div className={styles.eventCardGrid}> {/* Use Grid for the list of event cards */}
                    {events.map(event => (
                        // Use event._id from MongoDB
                        <div
                            key={event._id}
                            className={styles.eventCard}
                            onClick={() => handleCardClick(event._id)} // Call handler on click
                        >
                            {/* Event Image Section */}
                            <div className={styles.eventCardImageContainer}>
                                {event.eventImageUrl ? (
                                    <img src={event.eventImageUrl} alt={`Event: ${event.eventName}`} className={styles.eventCardImage} />
                                ) : (
                                    <div className={styles.eventCardImagePlaceholder}>
                                        Event Image
                                    </div>
                                )}
                                {/* Attendee Count Overlay (Conditional) */}
                                {showAttendeeCount && event.attendees && (
                                     <div className={styles.attendeeCountOverlay}>
                                         <i className="fas fa-users"></i> {/* Users icon */}
                                         <span>{event.attendees.length} attendees</span>
                                     </div>
                                )}
                            </div>

                            {/* Card Content Section */}
                            <div className={styles.eventCardContent}>
                                <h3 className={styles.eventCardName}>{event.eventName}</h3>

                                {/* Response Status (Conditional) */}
                                {showResponseStatus && event.response && (
                                    <span className={event.response === 'yes' ? styles.eventStatusConfirmed : styles.eventStatusDeclined}>
                                        {event.response === 'yes' ? 'Attending' : 'Declined'}
                                    </span>
                                )}


                                {/* Date, Time Info */}
                                <div className={styles.eventCardDateTime}>
                                    <p className={styles.eventCardInfo}><i className="far fa-calendar-alt"></i> {new Date(event.eventDate).toLocaleDateString()}</p> {/* Format date */}
                                    <p className={styles.eventCardInfo}><i className="far fa-clock"></i> {event.eventTime}</p>
                                </div>

                                 {/* Location Info */}
                                <p className={styles.eventCardInfo}><i className="fas fa-map-marker-alt"></i> {event.location}</p>

                                {/* Short Description */}
                                 {event.description && (
                                    <p className={styles.eventCardDescription}>{event.description.substring(0, 100)}...</p> // Display a truncated description
                                 )}

                                {/* Icons/Actions (Optional - can be passed as prop or handled by parent) */}
                                {/* <div className={styles.eventCardIcons}>
                                     <i className="fas fa-share-alt"></i>
                                     <i className="fas fa-ellipsis-v"></i>
                                </div> */}

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;
