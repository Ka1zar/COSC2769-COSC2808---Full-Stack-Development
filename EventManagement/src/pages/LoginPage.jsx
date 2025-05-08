import { useContext, useEffect, useState } from 'react';
// Import Link and useNavigate
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';

// Decide whether to import CSS Modules (.module.css) or regular CSS (.css)
// If you use CSS Modules, rename the file to LoginPage.module.css
// and import like: import styles from './LoginPage.module.css';
import './LoginPage.css'; // <-- Import the CSS file (using .css name as in your code)

// If you are using the @fortawesome/react-fontawesome package, you need to import specific icons here:
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(''); // Add state for login errors

  // Use the useNavigate hook
  const navigate = useNavigate();

  // Get setUser from context to update global user state
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPass = localStorage.getItem('rememberedPass'); // Use a consistent key name
    if (storedEmail) {
      setEmail(storedEmail);
      setPassword(storedPass); // Be cautious about storing passwords in localStorage in a real application!
      setRememberMe(true); // Also set rememberMe state if loading from storage
    }
  }, []);

  async function loginUser(ev) {
    ev.preventDefault();
    setError(''); // Clear previous error message

    try {
      // Send a POST request to the backend login API
      // The '/login' endpoint should match your backend
      const response = await axios.post('/login', { email, password });

      // Assuming the backend returns user info in response.data.user
      const userData = response.data.user; // <--- Get user info, adjust if the structure is different

      if (userData) {
        // Update the UserContext with the received user data
        setUser(userData);
        alert('Login success'); // Success notification (consider replacing with a nicer popup)

        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPass', password); // Use a consistent key name
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPass'); // Use a consistent key name
        }

        // --- ROLE CHECK AND REDIRECTION LOGIC ---
        if (userData.role === 'admin') {
          navigate('/admin'); // Redirect to Admin Dashboard page (or correct path)
        } else if (userData.role === 'organizer') {
          navigate('/user/organizer'); // Redirect to Organizer Dashboard page (or correct path)
        } else if (userData.role === 'attendee') {
           navigate('/user/attendee'); // Redirect to Attendee Dashboard page (or correct path)
        } else {
           // Undefined or unexpected role, redirect to a default page
           navigate('/');
           console.warn('User logged in with unhandled role:', userData.role);
        }
        // --- END OF REDIRECTION LOGIC ---


      } else {
         // Successful response but no user data (backend handles specific error logic?)
         setError('Invalid login credentials or server response error.');
      }

    } catch (e) {
      // Handle errors from the backend (e.g., wrong password, user not found)
      console.error('Login failed:', e.response ? e.response.data : e.message); // Log a more detailed error
      // Display the error message to the user
      if (e.response && e.response.status === 401) { // Example handling for 401 Unauthorized
          setError('Invalid email or password.');
      } else {
          setError('Login failed. Please try again later.');
      }
    }
  }


  return (
    // Main container centered on the screen
    // If using CSS Modules, className would be {styles['login-page-container']}
    <div className="login-page-container auth-container"> {/* Add auth-container for common styles */}
      {/* Box containing the login form */}
      <div className="login-box auth-box"> {/* Add auth-box for common styles */}
        <h1 className="login-title auth-title">Sign In</h1> {/* Add auth-title for common styles */}
        {/* Display error message if there is one */}
        {error && <p className="error-message">{error}</p>} {/* Use common error-message class */}

        {/* Login Form */}
        <form className="login-form auth-form" onSubmit={loginUser}> {/* Add auth-form for common styles */}

          {/* Email input group */}
          <div className="input-group">
            {/* Email Icon (Font Awesome) */}
            {/* If using react-fontawesome package: <FontAwesomeIcon icon={faEnvelope} className="input-icon" /> */}
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" /> {/* <-- Replaced SVG */}
            <faEnvelope/>
            {/* <i className="fas fa-envelope input-icon"></i> */} {/* <-- Replaced SVG */}
            {/* If using react-fontawesome package: <FontAwesomeIcon icon={faEnvelope} className="input-icon" /> */}
            <i className="fas fa-envelope input-icon"></i> {/* <-- Replaced SVG */}
            {/* Email input field */}
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              value={email}
              onChange={ev => setEmail(ev.target.value)}
              required
            />
          </div>

          {/* Password input group */}
          <div className="input-group">
            {/* Lock Icon (Font Awesome) */}
            {/* If using react-fontawesome package: <FontAwesomeIcon icon={faLock} className="input-icon" /> */}
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <faLock/>
            {/* <i className="fas fa-lock input-icon"></i> */} {/* <-- Replaced SVG */}
            {/* If using react-fontawesome package: <FontAwesomeIcon icon={faLock} className="input-icon" /> */}
            
            <i className="fas fa-lock input-icon"></i> {/* <-- Replaced SVG */}
             {/* Password input field */}
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={ev => setPassword(ev.target.value)}
              required
            />
            {/* Show/Hide password button */}
            <div className="password-toggle" onClick={() => setShowPassword(prev => !prev)}>
              {/* Show/Hide password icon (Font Awesome) */}
               {showPassword ? (
                 // If using react-fontawesome package: <FontAwesomeIcon icon={faEyeSlash} className="toggle-icon" />
                 <i className="fas fa-eye-slash toggle-icon"></i> // Eye slash icon when password is hidden
               ) : (
                 // If using react-fontawesome package: <FontAwesomeIcon icon={faEye} className="toggle-icon" />
                 <i className="fas fa-eye toggle-icon"></i> // Eye icon when password is shown
               )}
            </div>
          </div>

          {/* Actions: Remember Me & Forgot Password */}
          <div className="actions"> {/* Class "actions" might need styling in LoginPage.css */}
            <label className="remember-me"> {/* Class "remember-me" might need styling */}
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(prev => !prev)}
                className="checkbox" 
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="forgot-password-link"> {/* Class "forgot-password-link" might need styling */}
              Forgot Password?
            </Link>
          </div>

          {/* Main Sign In button */}
          <button type="submit" className="btn primary-btn">Sign In</button> {/* Use common btn and primary-btn classes */}

          {/* Secondary buttons: Sign Up and Back */}
          <div className="secondary-actions"> {/* Class "secondary-actions" might need styling to arrange buttons side-by-side */}
            <Link to="/register">
              <button type="button" className="btn secondary-btn">Sign Up</button> {/* Use common btn and secondary-btn classes */}
            </Link>
            <Link to="/"> {/* Path "/" for the Back button (homepage) */}
              <button type="button" className="btn secondary-btn">Back</button> {/* Use common btn and secondary-btn classes */}
            </Link>
          </div>

          {/* Register link (if not using the Sign Up button above) */}
          <div className="register-link link-container"> {/* Class "register-link" and common link-container */}
             Don't have an account yet? <Link to="/register" className="auth-link">Register now</Link> {/* Use common auth-link class */}
          </div>

        </form>
      </div>
    </div>
  );
}