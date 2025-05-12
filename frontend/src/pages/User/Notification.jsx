import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import styles from "./Notification.module.css"; // Create this CSS module

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [notificationError, setNotificationError] = useState(null);
  const [newNotifications, setNewNotifications] = useState([]);
  const [earlierNotifications, setEarlierNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      setNotificationError(null);
      try {
        const { data } = await axios.get('/my-notifications'); // API to fetch all notifications
        setNotifications(data);
        setLoadingNotifications(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotificationError('Failed to load notifications.');
        toast.error('Failed to load notifications.');
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    // Separate notifications into 'new' (unread) and 'earlier' (read)
    const newOnes = notifications.filter(notif => !notif.isRead);
    const earlierOnes = notifications.filter(notif => notif.isRead);
    setNewNotifications(newOnes);
    setEarlierNotifications(earlierOnes);
  }, [notifications]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/notifications/${notificationId}`, { isRead: true });
      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      toast.success('Notification marked as read.');
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read.');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read.');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read.');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.notificationsContainer}>
      <div className={styles.notificationsHeader}>
        <h1 className="text-2xl font-bold mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your events and invitations</p>
      </div>
      <div className={styles.notificationsBody}>
        <div className={styles.notificationsTabs}>
          <button
            className={`${styles.tab} ${activeTab === 'new' ? styles.active : ''}`}
            onClick={() => handleTabChange('new')}
          >
            New ({newNotifications.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'earlier' ? styles.active : ''}`}
            onClick={() => handleTabChange('earlier')}
          >
            Earlier ({earlierNotifications.length})
          </button>
          <span className={styles.markAsRead} onClick={markAllAsRead}>
            Mark all as read
          </span>
        </div>

        <div className={styles.notificationsContent}>
          {loadingNotifications ? (
            <div>Loading notifications...</div>
          ) : notificationError ? (
            <div className={styles.error}>{notificationError}</div>
          ) : activeTab === 'new' ? (
            newNotifications.length === 0 ? (
              <div className={styles.emptyNotifications}>No new notifications.</div>
            ) : (
              <ul className={styles.notificationList}>
                {newNotifications.map(notif => (
                  <li key={notif._id} className={styles.notificationItem}>
                    {notif.message}
                    <button className={styles.markAsReadBtn} onClick={() => markAsRead(notif._id)}>
                      Mark as Read
                    </button>
                  </li>
                ))}
              </ul>
            )
          ) : (
            earlierNotifications.length === 0 ? (
              <div className={styles.emptyNotifications}>No earlier notifications.</div>
            ) : (
              <ul className={styles.notificationList}>
                {earlierNotifications.map(notif => (
                  <li key={notif._id} className={`${styles.notificationItem} ${styles.read}`}>
                    {notif.message}
                    <span className={styles.readStatus}>Read</span>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;