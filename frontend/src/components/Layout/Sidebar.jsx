// src/components/Sidebar.jsx
import React, { useContext } from 'react'; // Import useContext
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for logout
import { UserContext } from '../../UserContext'; // Import UserContext to access user information
import styles from './Sidebar.module.css';

// Import necessary icons (e.g., from react-icons/fa or your chosen library)
import { FaHome, FaCalendarAlt, FaUsers, FaSignOutAlt, FaCog, FaUserShield, FaCalendarPlus, FaClipboardList } from 'react-icons/fa';
// Icons for Admin: FaUserShield (User Management), FaCog (System Settings)
// Icons for Organizer: FaHome (Dashboard), FaCalendarPlus (Create Event), FaClipboardList (My Events) - Updated based on image
// Icons for General: FaCalendarAlt (All Events), FaUsers (My RSVPs)
// Icon for Logout: FaSignOutAlt


const Sidebar = () => {
  // Get user information from UserContext
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate(); // For logout navigation

  // Function to handle logout (as implemented before)
  const handleLogout = () => {
    // TODO: Implement actual logout logic here (clear token, call API, etc.)
    console.log('Logging out...');
    setUser(null); // Clear user from context
    navigate('/login'); // Redirect to the login page or landing page
  };


  // Hide sidebar if no user is logged in
  if (!user) {
    return null; // Or render an empty/placeholder sidebar
  }

  // Determine user roles for conditional rendering
  const isAdmin = user.role === 'admin';
  const isOrganizer = user.role === 'organizer';
  const isAttendee = user.role === 'attendee';


  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>EventHub</div>

      {/* --- ADMIN SECTION (Only display for Admin) --- */}
      {isAdmin && (
        <>
          <div className={styles.sectionHeader}>ADMIN</div>
          <nav className={styles.nav}>
            {/* Admin Dashboard Link */}
            {/* In your App.jsx, the Admin Dashboard route is '/admin' */}
            <Link to="/admin" className={styles.navItem}>
               <FaHome /> {/* Dashboard Icon */}
               Dashboard
            </Link>
            {/* User Management Link */}
            <Link to="/admin/users" className={styles.navItem}> {/* TODO: Adjust path if needed */}
               <FaUserShield /> {/* User Management Icon */}
               User Management
            </Link>
            {/* System Settings Link */}
            <Link to="/admin/settings" className={styles.navItem}> {/* TODO: Adjust path if needed */}
               <FaCog /> {/* System Settings Icon */}
               System Settings
            </Link>
          </nav>
        </>
      )}

      {/* --- ORGANIZER SECTION (Display for Admin and Organizer) --- */}
      {(isAdmin || isOrganizer) && ( // Admin also sees Organizer section based on image
        <>
          <div className={styles.sectionHeader}>ORGANIZER</div>
          <nav className={styles.nav}>
            {/* Organizer Dashboard Link */}
             {/* The image shows a Dashboard link under Organizer.
                If this is a separate dashboard for Organizers, update path.
                If it's the same as Admin Dashboard, you might remove this or link to /admin.
                Let's link to a potential /organizer/dashboard for now.
             */}
            <Link to="/organizer/dashboard" className={styles.navItem}> {/* TODO: Adjust path if needed */}
               <FaHome /> {/* Dashboard Icon */}
               Dashboard
            </Link>
             {/* My Events Link (Added based on Organizer sidebar image) */}
            <Link to="/my-events" className={styles.navItem}> {/* TODO: Adjust path if needed */}
               <FaClipboardList /> {/* My Events Icon */}
               My Events
            </Link>
            {/* Create Event Link */}
            <Link to="/create-event" className={styles.navItem}> {/* TODO: Adjust path if needed */}
               <FaCalendarPlus /> {/* Create Event Icon */}
               Create Event
            </Link>
          </nav>
        </>
      )}


      {/* --- GENERAL SECTION (Display for all roles) --- */}
       {/* All roles see the General section */}
      <>
        <div className={styles.sectionHeader}>GENERAL</div>
        <nav className={styles.nav}>
          {/* All Events Link */}
          <Link to="/events" className={styles.navItem}> {/* TODO: Adjust path if needed */}
             <FaCalendarAlt /> {/* All Events Icon */}
             All Events
          </Link>
          {/* My RSVPs Link */}
          <Link to="/rsvps" className={styles.navItem}> {/* TODO: Adjust path if needed */}
             <FaUsers /> {/* My RSVPs Icon */}
             My RSVPs
          </Link>
        </nav>
      </>


      {/* --- USER/ADMIN SECTION at the bottom --- */}
      {/* Display information of the logged-in user */}
      <div className={styles.adminSection}>
        {/* Avatar - Display first character of username or role */}
        <div className={styles.avatar}>
            {user.username ? user.username.charAt(0).toUpperCase() : user.role.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userInfo}>
           {/* Display Username if available, otherwise display Role */}
           <span className={styles.userName}>{user.username || user.role}</span>
           {/* Display Email */}
           <span className={styles.email}>{user.email}</span>
        </div>
        {/* Logout Button */}
        <button className={styles.logout} onClick={handleLogout}>
           <FaSignOutAlt /> {/* Logout Icon */}
           Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;