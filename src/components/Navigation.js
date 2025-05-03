import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';
import { FaTachometerAlt, FaChartLine, FaBriefcase, FaListAlt, FaHistory, FaUser, FaGift } from 'react-icons/fa';

function Navigation() {
  return (
    <nav className="app-navigation">
      <ul>
        <li>
          <Link to="/dashboard" className="nav-link">
            <FaTachometerAlt className="nav-icon" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/trade" className="nav-link">
            <FaChartLine className="nav-icon" /> Trade
          </Link>
        </li>
        <li>
          <Link to="/portfolio" className="nav-link">
            <FaBriefcase className="nav-icon" /> Portfolio
          </Link>
        </li>
        <li>
          <Link to="/watchlist" className="nav-link">
            <FaListAlt className="nav-icon" /> Watchlist
          </Link>
        </li>
        <li>
          <Link to="/transactions" className="nav-link">
            <FaHistory className="nav-icon" /> Transactions
          </Link>
        </li>
        <li>
          <Link to="/funds" className="nav-link">
            <FaUser className="nav-icon" /> Funds
          </Link>
        </li>
        {/* <li>
          <Link to="/profile" className="nav-link">
            <FaUser className="nav-icon" /> Profile
          </Link>
        </li> */}
        <li>
          <Link to="/referral" className="nav-link">
            <FaGift className="nav-icon" /> Refer & Earn
            </Link>
        </li> {/* Add the Referral link */}
        {/* Add more links as needed */}
      </ul>
    </nav>
  );
}

export default Navigation;