import React, { useState, useEffect, useCallback } from 'react'; // <-- Import useCallback
import axios from 'axios';
import toast from 'react-hot-toast'; // <-- Import toast mặc định
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

// Import the new CSS Module file
import styles from './AdminDashBoard.module.css';
// Import the EventList component (Adjust path if needed)
// Dựa trên cấu trúc thư mục thông thường, EventList nên ở trong components
import EventList from '../User/EventList';// <-- Điều chỉnh đường dẫn EventList

// You might need to import your icon components here if you are using a library like react-icons
import { FaCalendarAlt, FaClock, FaCheckCircle, FaComments, FaUsers, FaListAlt } from 'react-icons/fa';


const AdminDashboard = () => {
  const navigate = useNavigate(); // Hook for navigation

  // State cho các số liệu thống kê
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [pendingInvitations, setPendingInvitations] = useState(0);
  const [eventsThisWeek, setEventsThisWeek] = useState(0);
  const [totalRsvps, setTotalRsvps] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  // State cho danh sách tất cả sự kiện
  const [allEvents, setAllEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  // --- Định nghĩa các hàm Fetch sử dụng useCallback ---
  // useCallback giúp đảm bảo hàm chỉ được tạo lại khi các dependencies của nó thay đổi.
  // Vì các hàm fetch này chỉ dùng các hàm set state và axios (thường không thay đổi),
  // dependency array của useCallback có thể rỗng hoặc chỉ chứa các hàm set state nếu cần thiết.

  const fetchDashboardData = useCallback(async () => {
    try {
      // CẬP NHẬT API URL: Endpoint backend cho thống kê Admin
      const { data } = await axios.get('/api/admin/statistics'); // Ví dụ: GET /api/admin/statistics

      // Cập nhật state cho các số liệu thống kê dựa trên phản hồi
      setUpcomingEvents(data.upcomingEvents || 0);
      setPendingInvitations(data.pendingInvitations || 0);
      setEventsThisWeek(data.eventsThisWeek || 0);
      setTotalRsvps(data.totalRsvps || 0);
      setTotalUsers(data.totalUsers || 0);
      setTotalEvents(data.totalEvents || 0);

    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      // Sử dụng toast mặc định
      toast.error('Failed to load dashboard statistics.');
    }
  }, [setUpcomingEvents, setPendingInvitations, setEventsThisWeek, setTotalRsvps, setTotalUsers, setTotalEvents]); // Dependencies là các hàm set state

  const fetchAllEvents = useCallback(async () => {
      setLoadingEvents(true);
      setEventsError(null);
      try {
          // CẬP NHẬT API URL: Endpoint backend để lấy TẤT CẢ sự kiện (cần quyền Admin)
          // Ví dụ: GET /api/events (hoặc /api/admin/events nếu bạn có endpoint riêng cho admin)
          const { data } = await axios.get('/api/events'); // Giả định backend trả về mảng sự kiện
          setAllEvents(data);
          setLoadingEvents(false);
      } catch (error) {
          console.error('Error fetching all events:', error);
          setEventsError('Failed to load all events.');
          // Sử dụng toast mặc định
          toast.error('Failed to load all events.');
          setLoadingEvents(false);
      }
  }, [setAllEvents, setLoadingEvents, setEventsError]); // Dependencies là các hàm set state và error state

  // --- useEffect để gọi các hàm Fetch ---
  useEffect(() => {
    fetchDashboardData();
    fetchAllEvents(); // Gọi hàm fetch tất cả sự kiện

    // Các hàm fetch được thêm vào dependency array
    // Vì chúng được bọc bởi useCallback và không có dependencies nội bộ,
    // chúng sẽ không thay đổi giữa các lần render, tránh infinite loop.
  }, [fetchDashboardData, fetchAllEvents]); // <-- Thêm các hàm fetch vào dependency array


  // --- Navigation to Event Detail Page (for EventList card click) ---
  const handleViewDetails = (eventId) => {
      // Điều hướng đến trang chi tiết sự kiện
      if (eventId) {
          navigate(`/events/${eventId}`); // Đảm bảo route này tồn tại trong App.jsx
      } else {
          toast.error("Event ID not available.");
      }
  };

  // Các hàm xử lý navigation khác cho Admin
  const handleManageUsers = () => {
      navigate('/admin/users'); // Ví dụ route cho quản lý người dùng
  };

  // Hàm này chỉ là placeholder, việc quản lý sự kiện chính là danh sách EventList bên dưới
  // const handleManageEvents = () => {
  //      toast.info("Viewing all events below.");
  // };


  return (
    // Sử dụng class từ CSS Module cho container chính
    <div className={styles.dashboardContainer}>
      {/* Sử dụng class từ CSS Module cho tiêu đề và mô tả */}
      <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
      <p className={styles.dashboardDescription}>Overview and management panel</p>


      {/* Lưới hiển thị các số liệu thống kê */}
      <div className={styles.statsGrid}>

        {/* Hộp số liệu: Upcoming Events */}
        <div className={`${styles.statBox} ${styles.upcoming}`}>
          <div>
            <h3 className={styles.statBoxTitle}>Upcoming Events</h3>
            <p className={styles.statBoxValue}>{upcomingEvents}</p>
          </div>
          <div className={styles.statBoxIcon}>
            <FaCalendarAlt />
          </div>
        </div>

        {/* Hộp số liệu: Pending Invitations */}
        <div className={`${styles.statBox} ${styles.pending}`}>
          <div>
            <h3 className={styles.statBoxTitle}>Pending Invitations</h3>
            <p className={styles.statBoxValue}>{pendingInvitations}</p>
          </div>
          <div className={styles.statBoxIcon}>
            <FaClock />
          </div>
        </div>

        {/* Hộp số liệu: Events This Week */}
        <div className={`${styles.statBox} ${styles.thisWeek}`}>
          <div>
            <h3 className={styles.statBoxTitle}>Events This Week</h3>
            <p className={styles.statBoxValue}>{eventsThisWeek}</p>
          </div>
          <div className={styles.statBoxIcon}>
            <FaCheckCircle />
          </div>
        </div>

        {/* Hộp số liệu: Total RSVPs */}
        <div className={`${styles.statBox} ${styles.totalRsvps}`}>
          <div>
            <h3 className={styles.statBoxTitle}>Total RSVPs</h3>
            <p className={styles.statBoxValue}>{totalRsvps}</p>
          </div>
          <div className={styles.statBoxIcon}>
            <FaComments />
          </div>
        </div>

        {/* Hộp số liệu: Total Users */}
        <div className={`${styles.statBox} ${styles.totalUsers}`}>
          <div>
            <h3 className={styles.statBoxTitle}>Total Users</h3>
            <p className={styles.statBoxValue}>{totalUsers}</p>
          </div>
          <div className={styles.statBoxIcon}>
            <FaUsers />
          </div>
        </div>

        {/* Hộp số liệu: Total Events */}
        <div className={`${styles.statBox} ${styles.totalEvents}`}>
          <div>
            <h3 className={styles.statBoxTitle}>Total Events</h3>
            <p className={styles.statBoxValue}>{totalEvents}</p>
          </div>
          <div className={styles.statBoxIcon}>
            <FaListAlt />
          </div>
        </div>

      </div> {/* Kết thúc Stats Summary Grid */}

        {/* Các hành động/điều hướng của Admin */}
        <div className={styles.adminActions}>
            <button className={styles.actionButton} onClick={handleManageUsers}>Manage Users</button>
            {/* Bạn có thể thêm các nút hành động Admin khác ở đây */}
        </div>


      {/* Phần hiển thị TẤT CẢ sự kiện - Sử dụng EventList component */}
      <div className={`${styles.section} ${styles.allEventsSection}`}>
        <h2 className={styles.sectionTitle}>All Events</h2>
        <p className={styles.sectionDescription}>Overview of all events in the system</p>

        {/* Sử dụng EventList component để hiển thị tất cả sự kiện */}
        <EventList
            events={allEvents} // Truyền danh sách tất cả sự kiện
            loading={loadingEvents} // Truyền trạng thái loading
            error={eventsError} // Truyền trạng thái lỗi
            title="" // Tiêu đề đã ở phần header của section rồi
            emptyMessage="No events found in the system."
            showAttendeeCount={true} // Admin có thể muốn xem số lượng người tham dự
            showResponseStatus={false} // Trạng thái phản hồi là cho góc nhìn của Attendee
            onEventClick={handleViewDetails} // Click vào card điều hướng đến Event Detail Page
        />

      </div>

        {/* Các phần khác đã bị xóa hoặc di chuyển (ví dụ: Recipients, RSVP Responses) */}


    </div>
  );
};

export default AdminDashboard;