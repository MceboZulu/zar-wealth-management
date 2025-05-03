// src/components/SignUpPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUpPage.css';
import { Oval } from 'react-loader-spinner';

const API_BASE_URL = 'http://192.168.68.104:2727';  

function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(false);

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password, referralCode: referralLink }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        alert('Account created successfully! Please log in.');
        navigate('/login');
        setLoading(true);
      } else {
        console.error('Registration failed:', data);
        setError(data.message || 'Registration failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Failed to connect to the server. Please try again later.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Oval color="#3498db" height={80} width={80} />
      </div>
    )
  }

  return (
    <div className="signup-page landing-page">
      <div className="landing-overlay">
        <div className="signup-form-container">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUp} className="signup-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="referralLink">Referral Link (Optional):</label>
              <input
                type="text"
                id="referralLink"
                value={referralLink}
                onChange={(e) => setReferralLink(e.target.value)}
                placeholder="Enter if you were referred"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <p>Already have an account? <Link to="/login">Log In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;