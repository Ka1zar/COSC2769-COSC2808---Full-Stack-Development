import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  async function handleRegister(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post('/register', { username, email, password, role });
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
      console.error(error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Sign Up</h1>
        <form className="flex flex-col" onSubmit={handleRegister}>
          
          {/* Username */}
          <div className="input">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M17.834 6.166a8.25 8.25 0 100 11.668..." clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Username"
              className="input-et"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="input">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M2.25 6.75v10.5a..." clipRule="evenodd" />
            </svg>
            <input
              type="email"
              placeholder="Email"
              className="input-et"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75..." clipRule="evenodd" />
            </svg>
            <input
              type="password"
              placeholder="Password"
              className="input-et"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div className="input">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 2a10..." clipRule="evenodd" />
            </svg>
            <select
              className="input-et"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Register Button */}
          <button type="submit" className="primary-btn">Register</button>

          {/* Link to Login */}
          <div className="text-center mt-3">
            <Link to="/login" className="text-primary text-sm">
              Already have an account? Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
