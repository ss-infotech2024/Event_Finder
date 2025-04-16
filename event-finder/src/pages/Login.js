// client/src/pages/Login.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  const { email, password } = formData;
  const { login, loading, error, token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to home
  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear errors when user starts typing again
    if (loginAttempted) {
      setLocalError(null);
      setLoginAttempted(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginAttempted(true);
    
    // Basic validation
    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }
    
    if (!password) {
      setLocalError('Password is required');
      return;
    }
    
    try {
      console.log('Submitting login with:', { email, password });
      await login(email, password);
    } catch (err) {
      console.error('Login submission error:', err);
      setLocalError(err.message || 'Failed to login. Please try again.');
    }
  };
  
  const displayError = localError || error;
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account</p>
          <p className="test-credentials">
            Test account: test@example.com / password123
          </p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {displayError && (
            <div className="form-error">
              {displayError}
            </div>
          )}
          
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-field"
              placeholder="Enter your email"
              value={email}
              onChange={handleChange}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`auth-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="auth-link">
            Don't have an account?{' '}
            <Link to="/register" className="link">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;