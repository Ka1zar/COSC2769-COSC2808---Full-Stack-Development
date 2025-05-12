import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './RegisterPage.css'; // <-- Import the CSS file

// Ensure Font Awesome is set up in your project.
// If you are using a CDN, just include the link in index.html.
// If you are using packages, you need to import specific icons here and use them
// with a component like FontAwesomeIcon. Example:
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUsers } from '@fortawesome/free-solid-svg-icons';


export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default value for role
  const [error, setError] = useState('');   // State for errors

  async function handleRegister(ev) {
    ev.preventDefault();
    setError(''); // Reset error state

    // (Add input validation steps here if needed, e.g., username/password length checks)

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role });
      alert('Registration successful!'); // Consider replacing with a toast message
      navigate('/login'); // Redirect to the login page
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage); // Update error state
      alert(errorMessage); // Display error to the user (consider using toast)
      console.error("Registration failed:", e);
    }
  }

  return (
    // Main container centered on the page
    <div className="auth-container">
      {/* Box containing the form */}
      <div className="auth-box">
        <h1 className="auth-title">Sign Up</h1>
        {/* Registration Form */}
        <form className="auth-form" onSubmit={handleRegister}>

          {/* Display error message if there is one */}
          {error && <div className="error-message">{error}</div>}

          {/* Input Group: Username */}
          <div className="input-group">
             {/* Font Awesome User Icon */}
             {/* If using react-fontawesome package: <FontAwesomeIcon icon={faUser} className="input-icon" /> */}
             <FontAwesomeIcon icon={faUser} className="input-icon" /> {/* <-- Corrected syntax */}
             <faUser/>
            <i className="fas fa-user input-icon"></i> {/* <-- Corrected class name syntax */}
            <input
              type="text"
              placeholder="Username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Input Group: Email */}
          <div className="input-group">
             {/* Font Awesome Envelope Icon */}
             {/* If using react-fontawesome package: <FontAwesomeIcon icon={faEnvelope} className="input-icon" /> */}
             <FontAwesomeIcon icon={faEnvelope} className="input-icon" /> {/* <-- Corrected syntax */}
             <faEnvelope/>
            <i className="fas fa-envelope input-icon"></i> {/* <-- Corrected syntax */}
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Input Group: Password */}
          <div className="input-group">
             {/* Font Awesome Lock Icon */}
             {/* If using react-fontawesome package: <FontAwesomeIcon icon={faLock} className="input-icon" /> */}
             <FontAwesomeIcon icon={faLock} className="input-icon" /> {/* <-- Corrected syntax */}

             <faLock/>
            <i className="fas fa-lock input-icon"></i> {/* <-- Corrected syntax */}
            <input
              type="password" // Kept type password
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Input Group: Role (Dropdown) */}
          <div className="input-group">
            {/* Font Awesome Users Icon (for Role/Group) */}
            {/* If using react-fontawesome package: <FontAwesomeIcon icon={faUsers} className="input-icon" /> */}
            <FontAwesomeIcon icon={faUsers} className="input-icon" /> {/* <-- Corrected syntax */}
            <faUsers/>
            <i className="fas fa-users input-icon"></i> {/* <-- Corrected syntax */}
            {/* Select Dropdown */}
            <select
              className="select-field" // Using a separate class for select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              {/* Add other roles if needed */}
            </select>
            {/* Optional: You can add a dropdown arrow icon here if you want custom styling */}
          </div>

          {/* Register Button */}
          <button type="submit" className="btn primary-btn">Register</button>

          {/* Link to Login Page */}
          <div className="link-container">
            <Link to="/login" className="auth-link">
              Already have an account? Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}