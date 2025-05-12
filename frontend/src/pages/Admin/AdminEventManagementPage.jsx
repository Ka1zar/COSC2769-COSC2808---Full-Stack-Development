import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Để chuyển hướng đến trang chỉnh sửa hoặc chi tiết
import styles from './AdminEventManagementPage.module.css'; // Import CSS module

const AdminEventManagementPage = () => {
  const navigate = useNavigate(); // Hook để điều hướng

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // API để lấy TẤT CẢ sự kiện. Có thể dùng lại endpoint '/events' nếu nó trả về tất cả,
        // hoặc dùng endpoint riêng cho admin như '/api/admin/events'
        const { data } = await axios.get('/api/admin/events'); // Ví dụ endpoint admin
        setEvents(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events for admin:', error);
        setError('Failed to load events.');
        toast.error('Failed to load events.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []); // Chạy 1 lần khi component mount

  const handleViewDetails = (eventId) => {
    // Logic để chuyển hướng Admin đến trang chi tiết sự kiện
    console.log(`Admin viewing details for event ID: ${eventId}`);
    // Ví dụ: navigate(`/admin/events/${eventId}`); // Tạo route riêng cho chi tiết sự kiện Admin
     toast.info(`Viewing details for event ID: ${eventId}`);
  };

  const handleEditEvent = (eventId) => {
    // Logic để chuyển hướng Admin đến trang chỉnh sửa sự kiện
    console.log(`Admin editing event with ID: ${eventId}`);
    // Ví dụ: navigate(`/admin/events/${eventId}/edit`); // Tạo route riêng cho trang chỉnh sửa Admin
     toast.info(`Editing event with ID: ${eventId}`);
     // Trong ứng dụng thực tế, bạn sẽ load dữ liệu sự kiện vào form chỉnh sửa
  };


  const handleDeleteEvent = async (eventId, eventName) => {
    if (window.confirm(`Are you sure you want to delete the event "${eventName}"?`)) {
      try {
        // API để xóa sự kiện bởi Admin. Có thể dùng endpoint '/events/:id'
        // hoặc endpoint riêng cho admin như '/api/admin/events/:id'
        await axios.delete(`/api/admin/events/${eventId}`); // Ví dụ endpoint admin delete
        setEvents(events.filter((event) => event._id !== eventId)); // Cập nhật UI
        toast.success('Event deleted successfully!');
      } catch (error) {
        console.error('Error deleting event by admin:', error);
        toast.error('Failed to delete event.');
      }
    }
  };

  return (
    <div className={styles.adminEventManagementPage}>
      <h1 className={styles.pageTitle}>Event Management (Admin)</h1>
      <p className={styles.pageDescription}>View and manage all events in the system.</p>

      {loading && <p className={styles.loading}>Loading events...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && events.length === 0 && (
          <p className={styles.emptyState}>No events found in the system.</p>
      )}

      <div className={styles.eventList}>
        {events.map((event) => (
          <div key={event._id} className={styles.eventCard}>
            {/* Có thể thêm hình ảnh sự kiện ở đây nếu dữ liệu có */}
            {/* {event.eventImageUrl && <img src={event.eventImageUrl} alt={event.name} className={styles.eventImage} />} */}

            <div className={styles.eventInfo}>
              <h3 className={styles.eventName}>{event.name || 'Unnamed Event'}</h3> {/* Sử dụng event.name thay vì event.title nếu API trả về name */}
              <p><strong>Organizer:</strong> {event.organizerName || 'N/A'}</p> {/* Hiển thị Organizer */}
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
              {/* Thêm các thông tin khác Admin cần xem (ví dụ: Public/Private, Capacity, Status) */}
               <p><strong>Type:</strong> {event.isPublic ? 'Public' : 'Private'}</p>
               <p><strong>Capacity:</strong> {event.capacity || 'Unlimited'}</p>
            </div>

            <div className={styles.adminActions}>
              <button
                className={`${styles.button} ${styles.viewButton}`}
                onClick={() => handleViewDetails(event._id)}
              >
                View
              </button>
              <button
                className={`${styles.button} ${styles.editButton}`}
                onClick={() => handleEditEvent(event._id)}
              >
                Edit
              </button>
              <button
                className={`${styles.button} ${styles.deleteButton}`}
                onClick={() => handleDeleteEvent(event._id, event.name || 'Unnamed Event')}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEventManagementPage;