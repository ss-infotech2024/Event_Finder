// client/src/pages/Register.js
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const { name, email, password, confirmPassword } = formData;
  const { register, loading, error } = useContext(AuthContext);
  const [formError, setFormError] = useState('');
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Form validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await register({ name, email, password });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Join the event finder community</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {(error || formError) && (
            <div className="form-error">
              {formError || error}
            </div>
          )}
          
          <div className="input-group">
            <label htmlFor="name" className="input-label">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="input-field"
              placeholder="Enter your full name"
              value={name}
              onChange={handleChange}
            />
          </div>
          
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
              placeholder="Create a password"
              value={password}
              onChange={handleChange}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="input-field"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleChange}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`auth-button ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="auth-link">
            Already have an account?{' '}
            <Link to="/login" className="link">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;