import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function handleForgotPassword(ev) {
    ev.preventDefault();
    try {
      await axios.post('/forgotpassword', { email });
      setMessage('Reset link sent to your email!');
    } catch (error) {
      setMessage('Failed to send reset link. Please try again.');
      console.error(error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Forgot Password</h1>
        <form className="flex flex-col" onSubmit={handleForgotPassword}>
          
          {/* Email */}
          <div className="input">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M2.25 6.75v10.5a..." clipRule="evenodd" />
            </svg>
            <input
              type="email"
              placeholder="Enter your email"
              className="input-et"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Send reset link Button */}
          <button type="submit" className="primary-btn">Send Reset Link</button>

          {/* Message */}
          {message && (
            <div className="text-center text-sm text-green-600 mt-2">{message}</div>
          )}

          {/* Back to Login */}
          <div className="text-center mt-3">
            <Link to="/login" className="text-primary text-sm">
              Back to Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
