import React, { useState, useEffect } from 'react';
import './PortfolioPage.css';
import Navigation from '../Navigation';
import { useNavigate } from 'react-router-dom';

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URL = 'http:192.168.68.104:2727'; 

function PortfolioPage() {
    const [portfolioData, setPortfolioData] = useState({ cashBalance: 0, holdings: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPortfolioData = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                navigate('/login', { replace: true });
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/portfolio`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPortfolioData(data);
                    setLoading(false);
                } else if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/login', { replace: true });
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to fetch portfolio data.');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
                setError('Failed to connect to the server.');
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, [navigate]);

    if (loading) {
        return <div>Loading portfolio data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="portfolio-page">
            <Navigation />
            <h2>Your Portfolio</h2>
            <p>Cash Balance: ZAR {portfolioData.cashBalance.toFixed(2)}</p>
            {portfolioData.holdings.length > 0 ? (
                <ul>
                    {portfolioData.holdings.map(holding => (
                        <li key={holding.asset_symbol}>
                            {holding.asset_symbol}: {holding.quantity} shares
                            {holding.name && ` (${holding.name})`}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your portfolio is currently empty.</p>
            )}
        </div>
    );
}

export default PortfolioPage;