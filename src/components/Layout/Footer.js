import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} ZAR Asset Management. All rights reserved.</p>
      <ul>
        <li>
          <Link to="/terms">Terms of Service</Link>
        </li>
        <li>
          <Link to="/privacy">Privacy Policy</Link>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
