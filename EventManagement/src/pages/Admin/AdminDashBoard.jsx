import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
// Import the new CSS Module file
import styles from './AdminDashBoard.module.css';

// You might need to import your icon components here if you are using a library like react-icons
import { FaCalendarAlt, FaClock, FaCheckCircle, FaComments } from 'react-icons/fa';

const AdminDashboard = () => {
  const [invitationsSent, setInvitationsSent] = useState(0);
  const [recipients, setRecipients] = useState([]);
  const [rsvpResponses, setRsvpResponses] = useState([]);

  // State for the new statistics (you will need API endpoints to fetch this data)
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [pendingInvitations, setPendingInvitations] = useState(0);
  const [eventsThisWeek, setEventsThisWeek] = useState(0);
  const [totalRsvps, setTotalRsvps] = useState(0);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Adjust the API endpoint if needed and fetch the new statistics data
        // The current endpoint is 'http://localhost:5000/admin/dashboard'
        const { data } = await axios.get('http://localhost:5000/admin/dashboard');

        setInvitationsSent(data.invitationsSent);
        setRecipients(data.recipients);
        setRsvpResponses(data.rsvpResponses);

        // TODO: Update state for the new statistics based on the API response data
        // Example:
        // setUpcomingEvents(data.upcomingEvents);
        // setPendingInvitations(data.pendingInvitations);
        // setEventsThisWeek(data.eventsThisWeek);
        // setTotalRsvps(data.totalRsvps);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data.');
      }
    };

    fetchDashboardData();
  }, []);

  return (
    // Use class from the CSS Module for the main container
    <div className={styles.dashboardContainer}>
      {/* Use classes from the CSS Module for the title and description */}
      <h1 className={styles.dashboardTitle}>Your Dashboard</h1>
      <p className={styles.dashboardDescription}>Discover events and manage your RSVPs</p>


      {/* Stats Summary Grid - Use class from the CSS Module */}
      <div className={styles.statsGrid}>

        {/* Upcoming Events Box - Use classes from the CSS Module */}
        {/* Add a specific class for styling its unique color */}
        <div className={`${styles.statBox} ${styles.upcoming}`}>
          <div>
            <h3 className={styles.statBoxTitle}>Upcoming Events</h3>
            {/* Use class from the CSS Module for the value */}
            <p className={styles.statBoxValue}>{upcomingEvents}</p>
          </div>
          {/* Icon for Upcoming Events - Use class from the CSS Module */}
          <div className={styles.statBoxIcon}>
            {/* Replace with your icon component, e.g., <FaCalendarAlt /> */}
            <FaCalendarAlt /> {/* Placeholder icon for Upcoming Events */}
            <i className="fas fa-calendar-alt"></i>
          </div>
        </div>

        {/* Pending Invitations Box - Use classes from the CSS Module */}
         {/* Add a specific class for styling its unique color */}
        <div className={`${styles.statBox} ${styles.pending}`}>
          <div>
            <h3 className={styles.statBoxTitle}>Pending Invitations</h3>
             {/* Use class from the CSS Module for the value */}
            <p className={styles.statBoxValue}>{pendingInvitations}</p>
          </div>
          {/* Icon for Pending Invitations - Use class from the CSS Module */}
          <div className={styles.statBoxIcon}>
             {/* Replace with your icon component, e.g., <FaClock /> */}
             <FaClock /> {/* Placeholder icon for Pending Invitations */}
             <i className="fas fa-clock"></i>
          </div>
        </div>

        {/* Events This Week Box - Use classes from the CSS Module */}
         {/* Add a specific class for styling its unique color */}
        <div className={`${styles.statBox} ${styles.thisWeek}`}>
          <div>
            <h3 className={styles.statBoxTitle}>Events This Week</h3>
            {/* Use class from the CSS Module for the value */}
            <p className={styles.statBoxValue}>{eventsThisWeek}</p>
          </div>
          {/* Icon */}
          <div className={styles.statBoxIcon}>
             {/* Replace with your icon component, e.g., <FaCheckCircle /> */}
             <FaCheckCircle /> {/* Placeholder icon for Events This Week */}
             <i className="fas fa-check-circle"></i>
          </div>
        </div>

        {/* Total RSVPs Box - Use classes from the CSS Module */}
         {/* Add a specific class for styling its unique color */}
        <div className={`${styles.statBox} ${styles.totalRsvps}`}>
          <div>
            <h3 className={styles.statBoxTitle}>Total RSVPs</h3>
            {/* Use class from the CSS Module for the value */}
            <p className={styles.statBoxValue}>{totalRsvps}</p>
          </div>
          {/* Icon */}
          <div className={styles.statBoxIcon}>
             {/* Replace with your icon component, e.g., <FaComments /> */}
             <FaComments /> {/* Placeholder icon for Total RSVPs */}
             <i className="fas fa-comments"></i>
          </div>
        </div>
      </div> {/* End Stats Summary Grid */}

      {/* "Upcoming Events" section below the stats - Use classes from the CSS Module */}
      <div className={`${styles.section} ${styles.upcomingEventsSection}`}> {/* Add section and specific class */}
        <h2 className={styles.sectionTitle}>Upcoming Events</h2>
        <p className={styles.sectionDescription}>Events you're attending soon</p>
        {/* TODO: Implement logic to display the list of Upcoming Events */}
        <div className={styles.sectionContent}> {/* Optional: Add a class for the content inside */}
           <p>You don't have any upcoming events.</p> {/* Placeholder */}
        </div>
      </div>


      {/* Recipients section - Use classes from the CSS Module */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Recipients</h3>
        {/* Use class from the CSS Module for the list */}
        <ul className={styles.list}>
          {recipients.map((r, i) => (
            <li key={i} className={styles.listItem}> {/* Use class for list item */}
              {r.name} (<span className={styles.listItemEmail}>{r.email}</span>) {/* Use class for email */}
            </li>
          ))}
        </ul>
      </div>

      {/* RSVP Responses section - Use classes from the CSS Module */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>RSVP Responses</h3>
         {/* Use class from the CSS Module for the list */}
        <ul className={styles.list}>
          {rsvpResponses.map((res, i) => (
            <li key={i} className={styles.listItem}> {/* Use class for list item */}
              {res.name} — <span className={styles.listItemStatus}>{res.status}</span> {/* Use class for status */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;