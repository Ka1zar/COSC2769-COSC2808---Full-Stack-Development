import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import React from 'react';
import './App.css';

// Import các trang chung (không theo vai trò cụ thể)
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';

// Import các trang Admin từ folder pages/Admin
import AdminDashboard from './pages/Admin/AdminDashBoard.jsx';
import SystemSettingsPage from './pages/Admin/SystemSettingsPage.jsx';
import AdminDashboardLayout from './components/Layout/AdminDashboardLayout.jsx';
// Import component quản lý sự kiện riêng cho Admin (chỉ view/edit/delete)
import AdminEventManagementPage from './pages/Admin/AdminEventManagementPage.jsx';
import UserManagement from './pages/Admin/UserManagement.jsx';


// Import các trang User chung hoặc Attendee từ folder pages/User
import AttendeeDashboard from './pages/User/AttendeeDashboard.jsx';
import Notification from './pages/User/notification.jsx';
// Import the new EventDetailPage
import EventDetailPage from './pages/User/EventDetailPage.jsx'; // <-- EventDetailPage is imported here
import EventList from './pages/User/EventList.jsx'; // Import EventList nếu cần
import CreateEventPage from './pages/User/Organizer/CreateEventPage'; // Import CreateEventPage nếu cần



// Import các trang Organizer từ folder pages/User/Organizer (vị trí mới)
import OrganizerDashboard from './pages/User/Organizer/OrganizerDashboard.jsx';
import EventManagement from './pages/User/Organizer/EventManagement.jsx';


// Import UserContext (nếu cần sử dụng trong App.jsx để bọc)
import { UserContextProvider } from './UserContext'; // Đảm bảo đường dẫn đúng

import axios from 'axios';
import { Toaster } from 'react-hot-toast'; // Import Toaster


axios.defaults.baseURL = 'http://localhost:5000';
// Rất quan trọng để cho phép Axios gửi cookies/authorization headers qua các yêu cầu CORS
axios.defaults.withCredentials = true;
// --- KẾT THÚC ĐOẠN CODE ĐƯỢC THÊM HOẶC CẬP NHẬT ---
// Đoạn code này là một ví dụ về cách sử dụng React Router để định nghĩa các route cho ứng dụng của bạn.


function App() {
  return (
    <UserContextProvider> {/* Bọc UserContextProvider nếu bạn cần context cho toàn app */}
        {/* Add Toaster for notifications */}
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* Routes chung không yêu cầu xác thực hoặc layout đặc biệt (trừ Layout chung) */}
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
          <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />

          {/* Routes dành cho Admin (có Layout riêng của Admin) */}
          <Route element={<AdminDashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<SystemSettingsPage />} />
            {/* Sử dụng component AdminEventManagementPage cho route quản lý sự kiện của Admin */}
            <Route path="/admin/events" element={<AdminEventManagementPage />} />
            <Route path="/admin/users" element={<UserManagement />} />
            {/* Thêm các route admin khác ở đây */}
          </Route>

          {/* Routes dành cho User / Attendee (có thể dùng Layout chung) */}
          {/* Nhóm các route dùng chung Layout nếu có */}
          <Route element={<Layout />}> {/* Ví dụ: nếu các trang user dùng chung Layout */}
             <Route path="/user/attendee" element={<AttendeeDashboard />} />
             <Route path="/user/notification" element={<Notification />} />
             {/* Add the route for the Event Detail Page */}
             <Route path="/events/:eventId" element={<EventDetailPage />} /> {/* <-- The route for EventDetailPage */}
             {/* Thêm các route Attendee khác nếu có */}
          </Route>


          {/* Routes dành cho Organizer (có thể dùng Layout chung hoặc Layout riêng) */}
           {/* Ví dụ: nếu các trang organizer dùng chung Layout */}
           <Route element={<Layout />}> {/* Có thể đổi thành LayoutOrganizer nếu có */}
               <Route path="/user/organizer/dashboard" element={<OrganizerDashboard />} />
               <Route path="/user/organizer/event-management" element={<EventManagement />} />
               <Route path="/user/organizer/events" element={<EventList />} /> {/* Nếu cần danh sách sự kiện */}
          
               {/* Thêm route tạo sự kiện nếu nó là trang riêng */}
               <Route path="/user/organizer/create-event" element={<CreateEventPage />} /> 
               {/* Thêm các route Organizer khác */}
           </Route>


          {/* Route cho các trang khác (nếu có) */}
          {/* <Route path="/other" element={<OtherPage />} /> */}

           {/* Route xử lý các đường dẫn không tồn tại (Optional) */}
           {/* <Route path="*" element={<NotFoundPage />} /> */}


        </Routes>
      </UserContextProvider>
  );
}

export default App;