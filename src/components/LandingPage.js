// src/components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
// import Footer from './Layout/Footer';

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-overlay">
      <header className="landing-header">
          <h1 className="company-name">ZAR Asset Management</h1>
          {/* You can add your logo here if you have one */}
          {/* <img src="/path/to/your/logo.png" alt="Company Logo" className="company-logo" /> */}
        </header>
        <div className="landing-content">
          <h1>Welcome to Our Trading Platform</h1>
          <p>Simulate, learn, and grow your investment skills.</p>
          <div className="landing-buttons">
            <Link to="/signup" className="signup-button">Sign Up</Link>
            <Link to="/login" className="login-button">Log In</Link>
          </div>
          <Link to="/tutorial" className="tutorial-button">Learn More</Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
