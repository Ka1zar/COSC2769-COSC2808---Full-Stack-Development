import React from "react";
import { useNavigate } from "react-router-dom";
import styles from './LandingPage.module.css'; // <-- Import CSS Module trong cùng folder 'pages'

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.landingPageContainer}> // 
      <div className={styles.contentWrapper}> // 
        {/* Text Section */}
        <div className={styles.textSection}> //
          <h1 className={styles.mainHeading}> 
            Welcome to Event Management System
          </h1>
          <p className={styles.subHeading}> // 
            Effortlessly manage events, track attendees, and gain insights with our powerful dashboard.
          </p>
          <div className={styles.buttonGroup}> // 
            <button
              onClick={() => navigate("/login")}
              className={styles.loginButton} // <-- Using styles.class here
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/register")}
              className={styles.signupButton} // <-- Using styles.class here
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className={styles.imageSection}>
          {/* Bạn cần đảm bảo đường dẫn hình ảnh này là đúng */}
          <img
            src="/assets/hero-event.svg" // <-- Đường dẫn hình ảnh tương đối từ thư mục public
            alt="Event management illustration"
            className={styles.heroImage} // <-- Using styles.class here
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;