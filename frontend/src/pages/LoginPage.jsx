import { useContext, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from "../../pages/User/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPass = localStorage.getItem('rememberedpass');
    if (storedEmail) {
      setEmail(storedEmail);
      setPassword(storedPass);
    }
  }, []);

  async function loginUser(ev) {
    ev.preventDefault();

    try {
      const { data } = await axios.post('/login', { email, password });
      setUser(data);
      alert('Login success');

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedpass', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedpass');
      }

      setRedirect(true);
    } catch (e) {
      alert('Login failed');
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Sign In</h1>
        <form className="flex flex-col" onSubmit={loginUser}>
          
          {/* Email Input */}
          <div className="input">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M17.834 6.166a8.25 8.25 0 100 11.668..." clipRule="evenodd" />
            </svg>
            <input type="email" placeholder="Email" className="input-et" value={email} onChange={ev => setEmail(ev.target.value)} />
          </div>

          {/* Password Input */}
          <div className="input">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906..." clipRule="evenodd" />
            </svg>
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="input-et" value={password} onChange={ev => setPassword(ev.target.value)} />
            <div type="button" className="cursor-pointer" onClick={() => setShowPassword(prev => !prev)}>
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5">
                  <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18..." />
                </svg>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="actions">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(prev => !prev)} />
              Remember Me
            </label>
            <Link to="/forgotpassword" className="text-primary">
              Forgot Password?
            </Link>
          </div>

          {/* Main Sign In Button */}
          <button type="submit" className="primary-btn">Sign In</button>

          {/* Secondary Actions: Sign Up and Back */}
          <div className="secondary-actions">
            <Link to="/register">
              <button type="button" className="secondary-btn">Sign Up</button>
            </Link>
            <Link to="/">
              <button type="button" className="secondary-btn">Back</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
