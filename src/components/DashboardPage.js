// src/components/DashboardPage.js
import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import Navigation from './Navigation';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaUser, FaChartLine, FaListAlt, FaHistory, FaArrowUp, FaArrowDown, FaLock, FaExchangeAlt, FaUsers, FaMoneyBill } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from './Layout/Footer';
import { Oval } from 'react-loader-spinner';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [portfolioOverviewData, setPortfolioOverviewData] = useState({ totalValue: 0, profitLoss: 0, profitLossPercentage: '0%', topHoldings: [] });
  const [watchlistData, setWatchlistData] = useState([]);
  const [marketNewsData, setMarketNewsData] = useState([]);
  const [recentTransactionsData, setRecentTransactionsData] = useState([]);
  const [keyPerformanceIndicators, setKeyPerformanceIndicators] = useState([]);
  const [marketIndicesData, setMarketIndicesData] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.user); // Assuming your API returns user data under a 'user' key
          setPortfolioOverviewData(data.portfolioOverview || { totalValue: 0, profitLoss: 0, profitLossPercentage: '0%', topHoldings: [] });
          setWatchlistData(data.watchlist || []);
          setMarketNewsData(data.marketNews || []);
          setRecentTransactionsData(data.recentTransactions || []);
          setKeyPerformanceIndicators(data.kpis || []);
          setMarketIndicesData(data.marketIndices || []);
          setLoading(false);
        } else if (response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch dashboard data.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to connect to the server.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const goToProfile = () => {
    navigate('/profile');
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (userData) {
    return (
      <div className="dashboard-page">
        <header className="dashboard-header">
          <div className="profile-section" onClick={goToProfile}>
            <FaUserCircle className="user-icon" />
            <span className="username">{userData.firstName} {userData.lastName}</span>
          </div>
          <Navigation />
          <button className="logout-button" onClick={handleLogout} setLoading={true}>Logout</button>
        </header>

        <div className="dashboard-header-secondary">
          <h1 className="greeting">{greeting}, {userData.firstName}!</h1> {/* Display first name */}
          <div className="news-ticker-container">
            <div className="news-ticker">
              {marketNewsData.map((news, index) => (
                <span key={index} className="news-item">{news.title}</span>
              ))}
            </div>
          </div>
        </div>

        <main className="dashboard-content">
          <section className="kpi-section">
            <h2>Key Metrics</h2>
            <ul className="kpi-list">
              {keyPerformanceIndicators.map(kpi => (
                <li key={kpi.label}>
                  <span className="kpi-label">{kpi.label}</span>
                  <div className="kpi-value">
                    {kpi.icon && <span className={`kpi-icon ${kpi.trend}`}><kpi.icon /></span>}
                    {kpi.value}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="market-indices-section">
            <h2>Simulated Market Indices</h2>
            <ul className="market-indices-list">
              {marketIndicesData.map(index => (
                <li key={index.name}>
                  <span className="index-name">{index.name}</span>
                  <span className="index-value">{index.value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className={`index-change ${index.change >= 0 ? 'positive' : 'negative'}`}>
                    {index.change >= 0 && <FaArrowUp className="index-icon" />}
                    {index.change < 0 && <FaArrowDown className="index-icon" />}
                    {index.change?.toFixed(2)} ({((index.change / index.value) * 100)?.toFixed(2)}%)
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="portfolio-overview-section">
            <h2>Portfolio Overview</h2>
            <div className="portfolio-summary">
              <p>Total Portfolio Value: <span className="value">ZAR {portfolioOverviewData.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
              <p>Simulated Profit/Loss: <span className={portfolioOverviewData.profitLoss >= 0 ? 'profit' : 'loss'}>ZAR {portfolioOverviewData.profitLoss?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({portfolioOverviewData.profitLossPercentage})</span></p>
            </div>
            <div className="portfolio-graphs-container">
              <div className="portfolio-bar-graph-placeholder">
                {/* Basic bar graph elements from before */}
                <div className="graph-bar" style={{ height: `${Math.random() * 60 + 40}%`, backgroundColor: 'var(--primary-color)' }}></div>
                <div className="graph-bar" style={{ height: `${Math.random() * 60 + 40}%`, backgroundColor: 'var(--accent-color)' }}></div>
                <div className="graph-bar" style={{ height: `${Math.random() * 60 + 40}%`, backgroundColor: 'var(--primary-color)' }}></div>
                <div className="graph-bar" style={{ height: `${Math.random() * 60 + 40}%`, backgroundColor: 'var(--secondary-color)' }}></div>
                <div className="graph-bar" style={{ height: `${Math.random() * 60 + 40}%`, backgroundColor: 'var(--accent-color)' }}></div>
              </div>
              <div className="portfolio-pie-chart-placeholder">
                {/* Placeholder for a pie chart */}
                {portfolioOverviewData.topHoldings.map((holding, index) => (
                  <div key={index} className="pie-slice" style={{ '--percentage': holding.weight.replace('%', ''), '--color': `hsl(${index * 60}, 70%, 60%)` }}></div>
                ))}
              </div>
            </div>
            <h3 className="section-subtitle">Top Holdings</h3>
            <ul className="top-holdings-list">
              {portfolioOverviewData.topHoldings.map(holding => (
                <li key={holding.symbol}>
                  {holding.name} ({holding.symbol}) - {holding.weight}
                </li>
              ))}
            </ul>
          </section>

          <section className="watchlist-section">
            <h2>Watchlist</h2>
            <ul className="watchlist-items">
              {watchlistData.map(item => (
                <li key={item.symbol}>
                  {item.symbol} - ZAR {item.currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className={item.change >= 0 ? 'positive' : 'negative'}>
                    ({item.change >= 0 ? '+' : ''}{item.change?.toFixed(2)} ({((item.change / item.currentPrice) * 100)?.toFixed(2)}%))
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="market-news-section">
            <h2>Simulated Market News</h2>
            <ul className="news-items">
              {marketNewsData.map((news, index) => (
                <li key={index}>{news.title}</li>
              ))}
            </ul>
          </section>

          <section className="announcements-section">
            <h2>Announcements</h2>
            <ul className="announcements-list">
              {announcements.map((announcement, index) => (
                <li key={index}>{announcement.message}</li>
              ))}
            </ul>
          </section>

          <section className="recent-transactions-section">
            <h2>Recent Transactions</h2>
            <ul className="transactions-list">
              {recentTransactionsData.map((transaction, index) => (
                <li key={index}>
                  <span className="transaction-type">{transaction.type}</span> {transaction.symbol} - {transaction.quantity} @ {transaction.price} ({transaction.date})
                </li>
              ))}
            </ul>
          </section>

          <section className="quick-actions-section">
            <h2>Quick Actions</h2>
            <ul className="quick-actions-list">
              {quickActions.map(action => (
                <li key={action.label}>
                  <Link to={action.to} className="quick-action-link">{action.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <footer className="dashboard-footer">
          <Footer />
        </footer>
      </div>
    );
  }

  return null; 
}

export default DashboardPage;