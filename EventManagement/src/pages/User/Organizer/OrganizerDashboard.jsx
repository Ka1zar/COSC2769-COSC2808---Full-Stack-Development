import React, { useEffect, useState, useCallback } from 'react'; // <-- Import useCallback
import axios from 'axios';
import toast from 'react-hot-toast'; // <-- Import toast mặc định
import styles from './OrganizerDashboard.module.css'; // Import CSS module
import { useNavigate } from 'react-router-dom'; // If using React Router

// Import the EventList component (Adjust path if needed)
// Dựa trên cấu trúc thư mục thông thường, EventList nên ở trong components
import EventList from '../EventList';// <-- Điều chỉnh đường dẫn EventList

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true); // Add loading state
  const [eventsError, setEventsError] = useState(null); // Add error state
  const navigate = useNavigate(); // If using React Router

  // --- Định nghĩa hàm Fetch sử dụng useCallback ---
  // Hàm fetchEvents này chỉ dùng các hàm set state và axios (thường không thay đổi).
  // Dependency array của useCallback có thể rỗng.
  const fetchEvents = useCallback(async () => {
    setLoadingEvents(true); // Set loading to true before fetch
    setEventsError(null); // Clear previous errors
    try {
      // CẬP NHẬT API URL: Endpoint backend để lấy sự kiện do Organizer hiện tại tạo ra
      // Ví dụ: GET /api/organizer/events hoặc /api/events/my-events
      const { data } = await axios.get('/api/events/my-events'); // Sử dụng /api prefix và endpoint phù hợp
      setEvents(data); // Giả định backend trả về mảng sự kiện
      setLoadingEvents(false); // Set loading to false after fetch
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setEventsError('Failed to load your events.'); // Set error message
      toast.error('Failed to load your events.'); // Sử dụng toast mặc định
      setLoadingEvents(false); // Set loading to false on error
    }
  }, [setEvents, setLoadingEvents, setEventsError]); // Dependencies là các hàm set state

  // --- useEffect để gọi hàm Fetch ---
  useEffect(() => {
    fetchEvents(); // Gọi hàm fetchEvents

    // Hàm fetchEvents được thêm vào dependency array.
    // Vì nó được bọc bởi useCallback và không có dependencies nội bộ,
    // nó sẽ không thay đổi giữa các lần render, loại bỏ cảnh báo.
  }, [fetchEvents]); // <-- Thêm fetchEvents vào dependency array

  // --- Các hàm xử lý hành động của Organizer ---

  const handleCreateNewEvent = () => {
    // Điều hướng đến trang tạo sự kiện
    // Đảm bảo route này tồn tại trong App.jsx
    navigate('/user/organizer/create-event');
  };

  // Hàm này được gọi khi click vào một Event Card trong EventList
  const handleViewDetails = (eventId) => {
      // Điều hướng đến trang chi tiết sự kiện
      if (eventId) {
          navigate(`/events/${eventId}`); // Đảm bảo route này tồn tại trong App.jsx
      } else {
          toast.error("Event ID not available.");
      }
  };

  // Các hàm xử lý hành động cụ thể trên từng sự kiện (Edit, Delete, View RSVPs, etc.)
  // Đây là các hàm bạn có thể muốn gọi từ các nút bấm bên trong mỗi Event Card
  // (nếu bạn chỉnh sửa component EventList để hiển thị các nút này)
  // hoặc từ một danh sách các hành động riêng.

  const handleEditEvent = (eventId) => {
    // Điều hướng đến trang chỉnh sửa sự kiện
    // Bạn cần tạo component EditEventPage.jsx và cấu hình route tương ứng
     console.log("Edit event:", eventId); // Console log cho mục đích debug
     navigate(`/user/organizer/edit-event/${eventId}`); // Ví dụ route: /user/organizer/edit-event/:eventId
     // toast.info(`Maps to edit event ${eventId}`); // Thông báo tùy chọn
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // CẬP NHẬT API URL: Endpoint backend để xóa sự kiện
        await axios.delete(`/api/events/${eventId}`); // Sử dụng /api prefix

        // Cập nhật state để xóa sự kiện đã xóa khỏi danh sách hiển thị ngay lập tức
        setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));

        toast.success('Event deleted successfully.');
      } catch (err) {
        console.error('Failed to delete event:', err);
        toast.error('Failed to delete the event.');
      }
    }
  };

  const handleViewRsvps = (eventId) => {
    // Điều hướng đến trang quản lý RSVP cho sự kiện này
    // Bạn cần tạo component RsvpManagementPage.jsx và cấu hình route tương ứng
     console.log("View RSVPs for event:", eventId); // Console log cho mục đích debug
     navigate(`/user/organizer/event/${eventId}/rsvps`); // Ví dụ route: /user/organizer/event/:eventId/rsvps
     // toast.info(`Maps to RSVPs for event ${eventId}`); // Thông báo tùy chọn
  };

  const handleViewDiscussion = (eventId) => {
    // Điều hướng đến bảng thảo luận cho sự kiện này.
    // Bảng thảo luận thường nằm trên trang chi tiết sự kiện.
    // Có thể điều hướng đến trang chi tiết và cuộn xuống phần discussion.
     console.log("View discussion for event:", eventId); // Console log cho mục đích debug
     navigate(`/events/${eventId}#discussion`); // Ví dụ: điều hướng đến trang chi tiết và dùng hash để nhảy đến phần discussion
     // toast.info(`Maps to discussion for event ${eventId}`); // Thông báo tùy chọn
  };

  const handleDeleteDiscussion = async (eventId) => {
    if (window.confirm('Are you sure you want to delete the discussion for this event? This will remove all messages.')) {
      try {
        // CẬP NHẬT API URL: Endpoint backend để xóa bảng thảo luận của sự kiện
        await axios.delete(`/api/events/${eventId}/discussions`); // Sử dụng /api prefix
        toast.success('Discussion deleted successfully.');
        // Nếu bạn muốn hiển thị trạng thái "đã xóa" trên Event Detail Page,
        // có thể cần cập nhật state hoặc refetch discussion data sau khi xóa.
      } catch (err) {
        console.error('Failed to delete discussion:', err);
        toast.error('Failed to delete the discussion.');
      }
    }
  };

  const handleNotifyAttendees = async (eventId) => {
    const notificationMessage = prompt('Enter the notification message for attendees:');
    if (notificationMessage) {
      try {
        // CẬP NHẬT API URL: Endpoint backend để gửi thông báo cho người tham dự sự kiện
        await axios.post(`/api/events/${eventId}/notify`, { message: notificationMessage }); // Sử dụng /api prefix
        toast.success('Notification sent to attendees.');
      } catch (err) {
        console.error('Failed to notify attendees:', err);
        toast.error('Failed to notify the attendees.');
      }
    }
  };


  return (
    // Sử dụng class từ CSS Module cho container chính
    <div className={styles.organizerDashboard}>
      {/* Tiêu đề Dashboard */}
      <h1 className={styles.dashboardTitle}>My Created Events</h1> {/* Sử dụng class từ CSS Module */}

      {/* Nút tạo sự kiện mới */}
      {/* Sử dụng class từ CSS Module */}
      <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleCreateNewEvent}>+ Create New Event</button> {/* Ví dụ class cho button */}


      {/* Sử dụng EventList component để hiển thị danh sách sự kiện */}
      <EventList
          events={events} // Truyền danh sách sự kiện của organizer
          loading={loadingEvents} // Truyền trạng thái loading
          error={eventsError} // Truyền trạng thái lỗi
          title="" // Tiêu đề đã ở h1 rồi
          emptyMessage="You haven't created any events yet." // Thông báo khi trống
          showAttendeeCount={true} // Organizer có thể muốn xem số lượng người tham dự
          showResponseStatus={false} // Trạng thái phản hồi là cho góc nhìn của Attendee
          onEventClick={handleViewDetails} // Click vào card điều hướng đến Event Detail Page
          // Nếu muốn hiển thị các nút hành động (Edit, Delete...) trong EventList,
          // bạn sẽ cần chỉnh sửa component EventList để nhận và hiển thị các nút này
          // và truyền các hàm xử lý tương ứng xuống (handleEditEvent, handleDeleteEvent, v.v.)
      />

      {/*
          Các nút hành động Edit/Delete/v.v. cho từng sự kiện.
          Bạn có thể chọn một trong hai cách:
          1. Hiển thị các nút này BÊN TRONG mỗi Event Card (Yêu cầu chỉnh sửa EventList)
          2. Hiển thị các nút này BÊN DƯỚI danh sách EventList hoặc trong một phần riêng
             và cần người dùng chọn sự kiện trước khi thực hiện hành động.
          Dựa trên code ban đầu của bạn, bạn có các hàm xử lý riêng.
          Nếu bạn muốn hiển thị chúng bên dưới danh sách, bạn có thể render chúng ở đây,
          có thể dùng state để theo dõi sự kiện nào đang được chọn để thao tác.
          Hoặc đơn giản nhất là thêm chúng vào trong component EventList.jsx.
      */}
       {/* Ví dụ hiển thị các nút dưới dạng một danh sách (Nếu không nhúng vào EventList) */}
       {/*
       <div className={styles.eventActionsBelowList}>
           <h3>Actions for Selected Event:</h3>
           // Bạn sẽ cần logic để xác định sự kiện nào đang được chọn
           <button onClick={() => handleEditEvent(selectedEventId)}>Edit Selected</button>
           // ... các nút khác ...
       </div>
       */}

    </div>
  );
}