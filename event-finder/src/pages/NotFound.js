// client/src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const NotFound = () => {
  return (
    <div className="home-container">
      <div className="main-content" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Page Not Found</h2>
        <p style={{ marginBottom: '2rem' }}>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/home" style={{ 
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '500'
        }}>
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;