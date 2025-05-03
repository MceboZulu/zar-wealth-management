// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import WelcomeTutorial from './components/WelcomeTutorial';
import DashboardPage from './components/DashboardPage';
import TradePage from './components/Navigation/TradePage';
import PortfolioPage from './components/Navigation/PortfolioPage';
import WatchlistPage from './components/Navigation/WatchlistPage';
import TransactionsPage from './components/Navigation/TransactionsPage';
import ProfilePage from './components/Profile/ProfilePage';
import Navigation from './components/Navigation';
import FundsPage from './components/Funds/FundsPage';
import ReferralPage from './components/ReferralPage';

function App() {
  const [portfolio, setPortfolio] = useState({
    cashBalance: 100000, // Initial cash balance
    holdings: {}, // Object to store asset holdings (symbol: quantity)
  });

  const [transactions, setTransactions] = useState([]);

  const updatePortfolio = (newPortfolio) => {
    setPortfolio(newPortfolio);
  };

  const recordTransaction = (transaction) => {
    setTransactions([...transactions, { ...transaction, timestamp: new Date().toLocaleString() }]);
  };

  return (
    <Router>
      <div> {/* Wrap the content in a div if needed for styling */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/tutorial" element={<WelcomeTutorial />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/trade"
            element={<TradePage portfolio={portfolio} updatePortfolio={updatePortfolio} recordTransaction={recordTransaction} />}
          />
          <Route path="/portfolio" element={<PortfolioPage portfolio={portfolio} />} />
          <Route path="/watchlist" element={<WatchlistPage availableAssets={Object.keys(portfolio.holdings)} />} /> {/* Adjust prop as needed */}
          <Route path="/transactions" element={<TransactionsPage transactions={transactions} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/funds"
            element={<FundsPage portfolio={portfolio} updatePortfolio={updatePortfolio} />}
          />
          <Route path="/referral" element={<ReferralPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;