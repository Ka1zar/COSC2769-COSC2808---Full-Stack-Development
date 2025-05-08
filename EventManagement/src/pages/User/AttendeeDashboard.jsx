import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./AttendeeDashboard.module.css"; // Import CSS module

// Assuming the invitation data from the backend includes an 'eventImageUrl' field
// Example: { _id: '...', eventName: '...', eventDate: '...', eventTime: '...', location: '...', organizerName: '...', response: '...', eventImageUrl: 'image_url' }

const AttendeeDashboard = () => {
  const [invitations, setInvitations] = useState([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);
  const [invitationError, setInvitationError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationError, setNotificationError] = useState(null);
  const [expandedInvitationId, setExpandedInvitationId] = useState(null); // To show discussion
  const [discussions, setDiscussions] = useState({}); // Store discussions for each invitation
  const [loadingDiscussions, setLoadingDiscussions] = useState({}); // Track loading state for discussions
  const [discussionErrors, setDiscussionErrors] = useState({}); // Track errors for discussions
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchInvitations = async () => {
      setLoadingInvitations(true);
      setInvitationError(null);
      try {
        // API to get the list of invitations, assuming it returns eventImageUrl, eventDate, eventTime, location
        const { data } = await axios.get('/my-invitations');
        setInvitations(data);
        setLoadingInvitations(false);
      } catch (error) {
        console.error('Error fetching invitations:', error);
        setInvitationError('Failed to load invitations.');
        toast.error('Failed to load invitations.');
        setLoadingInvitations(false);
      }
    };

    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      setNotificationError(null);
      try {
        const { data } = await axios.get('/my-notifications'); // API to get the list of notifications
        setNotifications(data);
        setNotificationError(null); // Reset error on success
        setLoadingNotifications(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotificationError('Failed to load notifications.');
        toast.error('Failed to load notifications.');
        setLoadingNotifications(false);
      }
    };

    fetchInvitations();
    fetchNotifications();
  }, []);

  const fetchDiscussion = async (invitationId) => {
    setLoadingDiscussions(prevState => ({ ...prevState, [invitationId]: true }));
    setDiscussionErrors(prevState => ({ ...prevState, [invitationId]: null }));
    try {
      const { data } = await axios.get(`/invitations/${invitationId}/discussions`); // API to fetch discussion
      setDiscussions(prevState => ({ ...prevState, [invitationId]: data }));
      setLoadingDiscussions(prevState => ({ ...prevState, [invitationId]: false }));
    } catch (error) {
      console.error('Error fetching discussion:', error);
      setDiscussionErrors(prevState => ({ ...prevState, [invitationId]: 'Failed to load discussion.' }));
      toast.error('Failed to load discussion.');
      setLoadingDiscussions(prevState => ({ ...prevState, [invitationId]: false }));
    }
  };

  const respondInvitation = async (invitationId, response) => {
    try {
      await axios.post(`/respond-invitation/${invitationId}`, { response });
      // Optimistically update the UI
      setInvitations(prevInvitations =>
        prevInvitations.map(inv =>
          inv._id === invitationId ? { ...inv, response } : inv
        )
      );
      toast.success(`Successfully responded: ${response === 'yes' ? 'Accepted' : 'Declined'}`);
    } catch (error) {
      console.error('Error responding to invitation:', error);
      toast.error('Failed to respond to invitation.');
    }
  };

  const toggleDiscussion = (invitationId) => {
    setExpandedInvitationId(prevId => {
      if (prevId === invitationId) {
        return null;
      } else {
        // Only fetch discussion if it's not already loaded or if switching to a new invitation
        if (!discussions[invitationId] || discussionErrors[invitationId]) {
             fetchDiscussion(invitationId);
        }
        return invitationId;
      }
    });
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const postComment = async (invitationId) => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment.');
      return;
    }
    try {
      // API to post comment, assuming it returns the new comment or success status
      await axios.post(`/invitations/${invitationId}/discussions`, { text: newComment });
      setNewComment("");
      fetchDiscussion(invitationId); // Refresh the discussion list after posting
      toast.success('Comment posted successfully.');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment.');
    }
  };

  // This function could be called when clicking "View Details" or similar
  const handleViewDetails = (eventId) => {
      // Logic to navigate the user to the event details page
      console.log(`Maps to event details for event ID: ${eventId}`);
      // Example using react-router-dom:
      // import { useNavigate } from 'react-router-dom';
      // const navigate = useNavigate();
      // navigate(`/events/${eventId}`);
       toast.info(`Viewing details for event ID: ${eventId}`);
  };


  return (
    <div className={styles.attendeeDashboard}>
      {/* You might add a Header here or wrap it with a Layout component */}
      <h1 className={styles.dashboardTitle}>Attendee Dashboard</h1>

      {/* Layout can be two columns or separate sections */}
      <div className={styles.dashboardContent}>
        {/* Notifications Section */}
        <section className={styles.notificationsSection}>
          <h2 className={styles.sectionTitle}>Notifications</h2>
          {loadingNotifications ? (
            <div className={styles.loading}>Loading notifications...</div>
          ) : notificationError ? (
            <div className={styles.error}>{notificationError}</div>
          ) : notifications.length === 0 ? (
            <div className={styles.emptyState}>No new notifications.</div>
          ) : (
            <ul className={styles.notificationList}>
              {notifications.map(notif => (
                <li key={notif._id} className={`${styles.notificationItem} ${notif.isRead ? styles.read : ''}`}>
                  <div className={styles.notificationText}>{notif.message}</div>
                  {!notif.isRead && (
                    <button className={styles.markAsReadBtn} onClick={() => {
                      axios.patch(`/notifications/${notif._id}`, { isRead: true })
                        .then(() => {
                          setNotifications(prev =>
                            prev.map(n => (n._id === notif._id ? { ...n, isRead: true } : n))
                          );
                          // toast.success('Notification marked as read.'); // Optional: Avoid too many toasts
                        })
                        .catch(err => {
                          console.error('Error marking as read:', err);
                          toast.error('Failed to mark as read.');
                        });
                    }}>Mark as Read</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Invitations Section - Displayed as a Grid of Cards like in the image */}
        <section className={styles.invitationsSection}>
          <h2 className={styles.sectionTitle}>My Invitations</h2>
           {/* You could add Search and Filter for Invitations here if needed */}
           {/* <div className={styles.invitationControls}>
               <input type="text" placeholder="Search invitations..." className={styles.searchInput} />
               <select className={styles.filterDropdown}>
                   <option value="all">All Invitations</option>
                   <option value="pending">Pending</option>
                   <option value="accepted">Accepted</option>
                   <option value="declined">Declined</option>
               </select>
           </div> */}


          {loadingInvitations ? (
            <div className={styles.loading}>Loading invitations...</div>
          ) : invitationError ? (
            <div className={styles.error}>{invitationError}</div>
          ) : invitations.length === 0 ? (
            <div className={styles.emptyState}>No invitations found.</div>
          ) : (
            <div className={styles.invitationGrid}> {/* Use Grid for the list of invitations */}
              {invitations.map(inv => (
                // Use eventId from invitation if available, or the invitation's _id
                <div key={inv._id} className={styles.invitationCard}>
                  {/* Event Image Section */}
                  <div className={styles.eventImageContainer}>
                      {inv.eventImageUrl ? (
                          <img src={inv.eventImageUrl} alt={`Event: ${inv.eventName}`} className={styles.eventImage} />
                      ) : (
                          // Display a placeholder div if no image
                          <div className={styles.eventImagePlaceholder}>
                              Event Image
                          </div>
                      )}
                       {/* You can add tags like "Public", "Upcoming" here if your data has them */}
                       {/* <div className={styles.eventTags}>
                            <span className={styles.eventTagPublic}>Public</span>
                            <span className={styles.eventTagUpcoming}>Upcoming</span>
                       </div> */}
                  </div>


                  {/* Card Content Section */}
                  <div className={styles.invitationCardContent}>
                    <h3 className={styles.eventName}>{inv.eventName}</h3>
                     {/* Add a short description if available in the data */}
                    {/* <p className={styles.eventShortDescription}>{inv.shortDescription}</p> */}


                    {/* Date, Time, Location Info */}
                    <div className={styles.eventDateTimeLocation}>
                        <p className={styles.eventInfo}><i className="far fa-calendar-alt"></i> {inv.eventDate}</p> {/* Calendar Icon */}
                        <p className={styles.eventInfo}><i className="far fa-clock"></i> {inv.eventTime}</p>    {/* Clock Icon */}
                        <p className={styles.eventInfo}><i className="fas fa-map-marker-alt"></i> {inv.location}</p> {/* Location Icon */}
                    </div>

                     {/* Invitation response area */}
                     {/* Keep existing response logic */}
                     <div className={styles.responseArea}>
                       {inv.response ? (
                         <p className={styles.respondedText}>Status: <span className={inv.response === 'yes' ? styles.accepted : styles.declined}>{inv.response === 'yes' ? 'Accepted' : 'Declined'}</span></p>
                       ) : (
                         <div className={styles.responseButtons}>
                           <button className={`${styles.button} ${styles.acceptBtn}`} onClick={() => respondInvitation(inv._id, 'yes')}>Accept</button>
                           <button className={`${styles.button} ${styles.declineBtn}`} onClick={() => respondInvitation(inv._id, 'no')}>Decline</button>
                         </div>
                       )}
                     </div>


                    {/* View Details Button (or button to navigate to event details) */}
                     {/* Assuming the invitation includes a related eventId */}
                    {inv.eventId && (
                         <button className={`${styles.button} ${styles.viewDetailsBtn}`} onClick={() => handleViewDetails(inv.eventId)}>
                             View Details
                         </button>
                    )}


                    {/* Discussion Toggle - Place at the end of the card or a separate area if needed */}
                    <button className={styles.discussionToggleBtn} onClick={() => toggleDiscussion(inv._id)}>
                      {expandedInvitationId === inv._id ? 'Hide Discussion' : 'Show Discussion'}
                    </button>

                    {/* Discussion Board */}
                    {expandedInvitationId === inv._id && (
                      <div className={styles.discussionBoard}>
                        <h4>Discussion</h4>
                        {loadingDiscussions[inv._id] ? (
                          <div className={styles.loading}>Loading discussion...</div>
                        ) : discussionErrors[inv._id] ? (
                          <div className={styles.error}>{discussionErrors[inv._id]}</div>
                        ) : discussions[inv._id] && discussions[inv._id].length > 0 ? (
                          <ul className={styles.discussionList}>
                            {discussions[inv._id].map(comment => (
                              <li key={comment._id} className={styles.commentItem}>
                                <div className={styles.commentMeta}>
                                   <span className={styles.commentAuthor}>{comment.author}</span>
                                   <span className={styles.commentTime}>({new Date(comment.createdAt).toLocaleString()})</span>
                                </div>
                                <p className={styles.commentText}>{comment.text}</p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className={styles.emptyState}>No comments yet. Be the first to comment!</div>
                        )}

                        {/* Add new comment section */}
                        <div className={styles.newCommentSection}>
                          <textarea
                            className={styles.commentInput}
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={handleCommentChange}
                          />
                          <button className={`${styles.button} ${styles.postCommentBtn}`} onClick={() => postComment(inv._id)}>Post</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AttendeeDashboard;