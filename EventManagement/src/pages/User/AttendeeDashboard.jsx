import React, { useState, useEffect } from "react";
  import axios from "axios";
  import { toast } from "react-hot-toast";
  import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
  import styles from "./AttendeeDashboard.module.css"; // Import CSS module
  import EventList from "./EventList"; // Import the new EventList component

  // Assuming the invitation data from the backend includes an 'eventImageUrl' field
  // Example: { _id: '...', eventName: '...', eventDate: '...', eventTime: '...', location: '...', organizerName: '...', response: '...', eventImageUrl: 'image_url', event: { _id: '...', ...event details } }
  // The backend endpoint /api/my-invitations should return invitation objects, populated with event details under an 'event' field


  const AttendeeDashboard = () => {
    const navigate = useNavigate(); // Hook for navigation

    // State for invitations list (keeping your original state name)
    const [invitations, setInvitations] = useState([]);
    const [loadingInvitations, setLoadingInvitations] = useState(true);
    const [invitationError, setInvitationError] = useState(null);

    // State for notifications (keeping your existing state)
    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    const [notificationError, setNotificationError] = useState(null);

    // State and functions related to inline discussion (keeping your existing logic)
    const [expandedInvitationId, setExpandedInvitationId] = useState(null); // To show discussion
    const [discussions, setDiscussions] = useState({}); // Store discussions for each invitation
    const [loadingDiscussions, setLoadingDiscussions] = useState({}); // Track loading state for discussions
    const [discussionErrors, setDiscussionErrors] = useState({}); // Track errors for discussions
    const [newComment, setNewComment] = useState("");

    // --- Initial Data Fetching (on mount) ---
    useEffect(() => {
      const fetchInvitations = async () => {
        setLoadingInvitations(true);
        setInvitationError(null);
        try {
          // API to get the list of invitations, assuming it returns invitation objects
          // with populated event details under the 'event' field
          const { data } = await axios.get('/api/my-invitations'); // Use /api prefix
          setInvitations(data); // Store the raw invitation data
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
          const { data } = await axios.get('/api/my-notifications'); // Use /api prefix
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

      // --- Discussion and Response Logic (Keeping your existing functions) ---

    const fetchDiscussion = async (invitationId) => {
      setLoadingDiscussions(prevState => ({ ...prevState, [invitationId]: true }));
      setDiscussionErrors(prevState => ({ ...prevState, [invitationId]: null }));
      try {
          // Find the event ID associated with this invitation
          const invitation = invitations.find(inv => inv._id === invitationId);
          if (!invitation || !invitation.event || !invitation.event._id) {
              setDiscussionErrors(prevState => ({ ...prevState, [invitationId]: 'Event details not available for discussion.' }));
              setLoadingDiscussions(prevState => ({ ...prevState, [invitationId]: false }));
              toast.error('Cannot load discussion: Event details missing.');
              return;
          }
          const eventId = invitation.event._id;

        // API to fetch discussion for the event linked to this invitation
        const { data } = await axios.get(`/api/events/${eventId}/discussions`); // Use /api prefix and eventId
        setDiscussions(prevState => ({ ...prevState, [invitationId]: data })); // Store discussion by invitationId
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
        await axios.post(`/api/invitations/${invitationId}/respond`, { response }); // Use /api prefix
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
          return null; // Collapse if already expanded
        } else {
          // Only fetch discussion if it's not already loaded or if switching to a new invitation
          // Check if discussion data exists and there was no previous error
          if (!discussions[invitationId] || discussionErrors[invitationId]) {
              fetchDiscussion(invitationId);
          }
          return invitationId; // Expand this invitation's discussion
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
          // Find the event ID associated with this invitation
          const invitation = invitations.find(inv => inv._id === invitationId);
          if (!invitation || !invitation.event || !invitation.event._id) {
              toast.error('Cannot post comment: Event details missing.');
              return;
          }
          const eventId = invitation.event._id;

        // API to post comment to the event linked to this invitation
        const { data } = await axios.post(`/api/events/${eventId}/discussions`, { text: newComment }); // Use /api prefix and eventId

        setNewComment("");
        // After posting, refresh the discussion list for this invitation
        fetchDiscussion(invitationId);
        toast.success('Comment posted successfully.');
      } catch (error) {
        console.error('Error posting comment:', error);
        toast.error('Failed to post comment.');
      }
    };

    // This function is called when clicking "View Details" or clicking an event card
    const handleViewDetails = (eventId) => {
        // Navigate the user to the event details page
        if (eventId) {
            navigate(`/events/${eventId}`); // Use react-router-dom navigate
        } else {
            toast.error("Event ID not available.");
        }
    };

    return (
      <div className={styles.attendeeDashboard}>
        {/* You might add a Header here or wrap it with a Layout component */}
        <h1 className={styles.dashboardTitle}>Attendee Dashboard</h1>

        {/* Layout can be two columns or separate sections */}
        <div className={styles.dashboardContent}>
          {/* Notifications Section (keeping your existing section) */}
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
                  // CẬP NHẬT API URL trong onClick nếu cần
                  <li key={notif._id} className={`${styles.notificationItem} ${notif.isRead ? styles.read : ''}`}>
                    <div className={styles.notificationText}>{notif.message}</div>
                    {!notif.isRead && (
                      <button className={styles.markAsReadBtn} onClick={() => {
                        axios.patch(`/api/notifications/${notif._id}/read`) // Use /api prefix
                          .then(() => {
                            setNotifications(prev =>
                              prev.map(n => (n._id === notif._id ? { ...n, isRead: true } : n))
                            );
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

          {/* Invitations Section - Displayed as a Grid of Cards using EventList */}
          <section className={styles.invitationsSection}> {/* Keeping your section class */}
            <h2 className={styles.sectionTitle}>My Invitations</h2> {/* Keeping your section title */}
             {/* You could add Search and Filter for Invitations here if needed */}
             {/* <div className={styles.invitationControls}> ... </div> */}

            {/* Use the EventList component to render the invitations */}
            <EventList
                events={invitations.map(inv => ({ // Map invitations to event-like structure for EventList
                    ...inv.event, // Spread event details from the nested 'event' object
                    _id: inv.event ? inv.event._id : inv._id, // Use event ID if available, otherwise invitation ID (fallback)
                    response: inv.response, // Include invitation response
                    invitationId: inv._id // Include invitation ID for response/discussion logic
                }))}

                loading={loadingInvitations}
                error={invitationError}
                title="" // Title is already in the section header
                emptyMessage="No invitations found."
                showAttendeeCount={false} // Don't show attendee count on invitation cards
                showResponseStatus={true} // Show response status on invitation cards
                // Pass a custom click handler to EventList
                onEventClick={(eventId) => {
                    // When clicking on an Invitation Card (rendered by EventList),
                    // we want to toggle the discussion/response section below,
                    // NOT navigate to the event details page (which is handled separately)
                    // Find the original invitation object based on eventId or invitationId
                    const clickedInvitation = invitations.find(inv =>
                        (inv.event && inv.event._id === eventId) || // Check by nested event ID
                        inv._id === eventId // Fallback check by invitation ID
                    );
                    if (clickedInvitation) {
                        toggleDiscussion(clickedInvitation._id); // Toggle discussion using invitation ID
                    } else {
                        // This case is less likely if the mapping is correct,
                        // but include a fallback or error handling
                         toast.error("Could not find invitation details.");
                         console.warn("Clicked Event ID not found in invitations:", eventId);
                    }
                }}
            />


            {/* Discussion Board and Response Buttons - Rendered below the EventList */}
            {/* This section will appear below the list of invitation cards */}
            {invitations.map(inv => {
                // Only render the discussion/response section if this invitation is expanded AND it's the currently expanded one
                if (expandedInvitationId === inv._id) {
                    return (
                    <div key={`expanded-${inv._id}`} className={styles.expandedInvitationDetails}> {/* New container for expanded details */}
                        {/* Invitation response area (keeping your existing logic) */}
                        {/* This response area is shown only when the card is expanded */}
                        <div className={styles.responseArea}>
                            <h4>Your Invitation Status:</h4>
                            {inv.response ? (
                                <p className={styles.respondedText}>Status: <span className={inv.response === 'yes' ? styles.accepted : styles.decline}>{inv.response === 'yes' ? 'Accepted' : 'Declined'}</span></p>
                            ) : (
                                <div className={styles.responseButtons}>
                                    <button className={`${styles.button} ${styles.acceptBtn}`} onClick={() => respondInvitation(inv._id, 'yes')}>Accept</button>
                                    <button className={`${styles.button} ${styles.declineBtn}`} onClick={() => respondInvitation(inv._id, 'no')}>Decline</button>
                                </div>
                            )}
                        </div>

                        {/* Discussion Board (keeping your existing logic and rendering) */}
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

                            {/* Phần thêm comment mới */}
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
                    </div>);
                }
                return null; // Return null for invitations that are not expanded
            }) }
            </section>

            {/* Public Events Section - Sử dụng EventList component */}
            <section className={styles.publicEventsSection}>
                 {/* You could add Search and Filter for Public Events here if needed */}
                 {/* <div className={styles.publicEventControls}> ... </div> */}

                {/* Use the EventList component to display public events */}
                <EventList
                    events={[]} // TODO: Fetch Public Events and pass here
                    loading={false} // TODO: Use loading state for public events
                    error={null} // TODO: Use error state for public events
                    title="Upcoming Public Events" // Tiêu đề của danh sách
                    emptyMessage="No public events available at the moment." // Thông báo khi trống
                    onEventClick={handleViewDetails} // Click vào card điều hướng đến Event Detail Page
                    showAttendeeCount={false} // Mặc định là false cho Attendee xem sự kiện công khai
                    showResponseStatus={false} // Mặc định là false cho Attendee xem sự kiện công khai
                />
            </section>


        </div>
      </div>
    );
  };

  export default AttendeeDashboard;