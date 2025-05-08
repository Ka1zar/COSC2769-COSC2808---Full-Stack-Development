// src/components/Layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react'; // Import useState, useEffect, useRef
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react'; // Notification icon from lucide-react
import styles from './Header.module.css';
import axios from 'axios'; // Import axios to fetch notifications
import { toast } from 'react-hot-toast'; // Optional: To display toast messages

// You might need to import icons for specific notification types if needed (e.g., from lucide-react or another library)
import { AlertCircle, CalendarCheck, UserPlus } from 'lucide-react';


const Header = () => {
  // State to control the visibility of the notification dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // State to store the list of notifications
  const [notifications, setNotifications] = useState([]);
  // State to store the count of unread notifications (assuming API provides this)
  const [unreadCount, setUnreadCount] = useState(0);


  // Refs to reference the bell icon and dropdown elements, used for handling clicks outside
  const dropdownRef = useRef(null);
  const bellIconRef = useRef(null);


  // Function to toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  // Function to close the dropdown
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };


  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside the dropdown and not on the bell icon, close the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          bellIconRef.current && !bellIconRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    // Add event listener when the dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remove event listener when the dropdown is closed
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]); // Re-run this effect when isDropdownOpen changes


  // Effect to fetch the list of notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // TODO: Replace with your actual API endpoint to fetch notifications
        // The API response structure should ideally be like: { notifications: [...], unreadCount: number }
        const { data } = await axios.get('http://localhost:5000/api/notifications'); // Example API URL

        // Assuming API returns an object like { notifications: [...], unreadCount: number }
        setNotifications(data.notifications || []); // Update notifications list, use empty array if undefined/null
        setUnreadCount(data.unreadCount || 0); // Update unread count, use 0 if undefined/null


      } catch (error) {
        console.error('Error fetching notifications:', error);
        // toast.error('Failed to load notifications.'); // Optional: Display an error toast
      }
    };

    // Fetch notifications when the component mounts
    fetchNotifications();

  }, []); // Empty dependency array means this effect runs only once on mount


  return (
    // Use class from the CSS Module for the header element
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo or Site Title */}
        <Link to="/" className={styles.siteTitle}>
          Event Management {/* Or EventHub */}
        </Link>

        {/* Search Box */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search events..."
            className={styles.searchInput}
          />
        </div>

        {/* Notification + Navigation Menu */}
        <div className={styles.rightSection}>

          {/* Container for the bell icon and dropdown */}
          <div className={styles.notificationContainer}> {/* Add this class for relative positioning */}
             {/* Bell Icon Button - Attach ref and onClick handler */}
            <button ref={bellIconRef} className={styles.bellButton} onClick={toggleDropdown}>
               {/* Using the Bell icon from lucide-react */}
               <Bell size={20} />
            </button>
            {/* Unread Notification Badge - Only display when unreadCount > 0 */}
            {unreadCount > 0 && (
                <span className={styles.notificationBadge}>{unreadCount}</span>
            )}

            {/* Notification Dropdown Menu - Conditionally rendered */}
            {isDropdownOpen && (
              // Attach ref to the dropdown element
              <div ref={dropdownRef} className={styles.notificationDropdown}>
                <div className={styles.dropdownHeader}>Notifications</div>
                <div className={styles.dropdownList}>
                  {/* Render the list of notifications */}
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      // TODO: Use actual data from the notification object
                      // The notification object should ideally have fields like title, description, timestamp
                      // You might use notification.id as the key instead of index if available
                      <div key={index} className={styles.notificationItem}>
                         {/* TODO: Add icon for specific notification types if needed */}
                         {/* Example: <div className={styles.notificationItemIcon}>{notification.type === 'approval' && <AlertCircle size={16} />}</div> */}
                         <div> {/* Div to wrap text content */}
                           <div className={styles.notificationTitle}>{notification.title || 'Untitled Notification'}</div>
                           <div className={styles.notificationDescription}>{notification.description || 'No description.'}</div>
                           {/* TODO: Format the timestamp for better readability */}
                           <div className={styles.notificationTimestamp}>{notification.timestamp || 'Just now'}</div>
                         </div>
                      </div>
                    ))
                  ) : (
                    // Display message when there are no notifications
                    <div className={styles.noNotifications}>No new notifications.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Other links on the right (Homepage, Login, Sign Up) */}
          <nav>
            <ul className={styles.navList}>
              <li><Link to="/" className={styles.navLink}>Homepage</Link></li>
              {/* TODO: Add logic to conditionally display these links based on login status */}
              {/* Example: Show Login/Sign Up only when logged out, or a Profile link when logged in */}
              <li><Link to="/login" className={styles.navLink}>Login</Link></li>
              <li><Link to="/register" className={styles.navLink}>Sign Up</Link></li>
            </ul>
          </nav>
           {/* Old bell icon button (replaced by the one above) */}
           {/* <button className={styles.bellButton}>
             <Bell size={20} />
           </button> */}

        </div>
      </div>
    </header>
  );
};

export default Header;