import React, { useState, useEffect } from 'react';
import './TradePage.css';
import Navigation from '../Navigation';
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function TradePage() {
    const [selectedAsset, setSelectedAsset] = useState('');
    const [tradeType, setTradeType] = useState('buy');
    const [quantity, setQuantity] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [estimatedValue, setEstimatedValue] = useState(0);
    const [tradeMessage, setTradeMessage] = useState('');
    const [availableAssets, setAvailableAssets] = useState([]);
    const [userCashBalance, setUserCashBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssets = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${API_BASE_URL}/api/assets`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setAvailableAssets(data);
                    setLoading(false);
                } else if (response.status === 401) {
                    navigate('/login', { replace: true });
                } else {
                    const errorData = await response.json();
                    setTradeMessage({ text: errorData.message || 'Failed to fetch available assets.', type: 'error' });
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching assets:', error);
                setTradeMessage({ text: 'Failed to connect to the server.', type: 'error' });
                setLoading(false);
            }
        };

        fetchAssets();
    }, [navigate]);

    useEffect(() => {
        const fetchPrice = async () => {
            if (selectedAsset) {
                const token = localStorage.getItem('authToken');
                try {
                    const response = await fetch(`${API_BASE_URL}/api/market-data/${selectedAsset}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setCurrentPrice(parseFloat(data.currentPrice));
                        setLoading(false);
                    } else if (response.status === 401) {
                        navigate('/login', { replace: true });
                    } else if (response.status === 404) {
                        setCurrentPrice(0);
                        setTradeMessage({ text: `Price data not found for ${selectedAsset}.`, type: 'warning' });
                    } else {
                        const errorData = await response.json();
                        setTradeMessage({ text: errorData.message || `Failed to fetch price for ${selectedAsset}.`, type: 'error' });
                        setLoading(false);
                    }
                } catch (error) {
                    console.error('Error fetching price:', error);
                    setTradeMessage({ text: 'Failed to connect to the server.', type: 'error' });
                    setLoading(false);
                }
            } else {
                setCurrentPrice(0);
            }
        };

        fetchPrice();
    }, [selectedAsset, navigate]);

    useEffect(() => {
        setEstimatedValue((quantity * currentPrice).toFixed(2));
    }, [quantity, currentPrice]);

    // Fetch user's cash balance on component mount
    useEffect(() => {
        const fetchCashBalance = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await fetch(`${API_BASE_URL}/api/user/balance`, { // New endpoint to get balance
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserCashBalance(parseFloat(data.cashBalance));
                    setLoading(false);
                } else if (response.status === 401) {
                    navigate('/login', { replace: true });
                } else {
                    const errorData = await response.json();
                    console.error('Failed to fetch cash balance:', errorData);
                    setTradeMessage({ text: errorData.message || 'Failed to fetch available balance.', type: 'error' });
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching cash balance:', error);
                setTradeMessage({ text: 'Failed to connect to the server.', type: 'error' });
                setLoading(false);
            }
        };

        fetchCashBalance();
    }, [navigate]);

    const handleAssetChange = (event) => {
        setSelectedAsset(event.target.value);
    };

    const handleTradeTypeChange = (event) => {
        setTradeType(event.target.value);
    };

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setQuantity(isNaN(value) ? 0 : value);
    };

    const handleSimulateTrade = async () => {
        if (!selectedAsset) {
            setTradeMessage({ text: 'Please select an asset.', type: 'error' });
            return;
        }
        if (quantity <= 0) {
            setTradeMessage({ text: 'Please enter a valid quantity.', type: 'error' });
            return;
        }

        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`${API_BASE_URL}/api/trade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    assetSymbol: selectedAsset,
                    tradeType,
                    quantity,
                    price: currentPrice, // Include current price in the order
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setTradeMessage({ text: data.message || `Successfully executed ${tradeType} order.`, type: 'success' });
                setSelectedAsset('');
                setQuantity(0);
                setLoading(true); // Reset loading state to fetch new data
                // Optionally trigger a refresh of portfolio data on dashboard
                // You might use a context or a state management solution for this
                // For now, a simple reload might suffice if it's crucial to see immediate changes
                // window.location.reload();
                // Or navigate back to dashboard and it will fetch fresh data
                navigate('/dashboard');
            } else if (response.status === 401) {
                navigate('/login', { replace: true });
            } else {
                const errorData = await response.json();
                setTradeMessage({ text: errorData.message || 'Failed to execute trade.', type: 'error' });
                setLoading(false);
            }
        } catch (error) {
            console.error('Error executing trade:', error);
            setTradeMessage({ text: 'Failed to connect to the server.', type: 'error' });
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
        <div className="trade-page">
            <Navigation />
            <h2>Simulated Trading</h2>

            <div className="trade-form">
                <p className="balance">Available Balance: ZAR {userCashBalance.toFixed(2)}</p>

                <div>
                    <label htmlFor="asset">Select Asset:</label>
                    <select id="asset" value={selectedAsset} onChange={handleAssetChange}>
                        <option value="">-- Select an Asset --</option>
                        {availableAssets.map(asset => (
                            <option key={asset.symbol} value={asset.symbol}>{asset.name} ({asset.symbol})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Trade Type:</label>
                    <div>
                        <input
                            type="radio"
                            id="buy"
                            value="buy"
                            checked={tradeType === 'buy'}
                            onChange={handleTradeTypeChange}
                        />
                        <label htmlFor="buy">Buy</label>
                        <input
                            type="radio"
                            id="sell"
                            value="sell"
                            checked={tradeType === 'sell'}
                            onChange={handleTradeTypeChange}
                        />
                        <label htmlFor="sell">Sell</label>
                    </div>
                </div>

                <div>
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="1"
                    />
                </div>

                <div>
                    <label>Current Price:</label>
                    <input type="text" value={`ZAR ${currentPrice.toFixed(2)}`} readOnly />
                </div>

                <div>
                    <label>Estimated {tradeType === 'buy' ? 'Cost' : 'Proceeds'}:</label>
                    <input type="text" value={`ZAR ${estimatedValue}`} readOnly />
                </div>

                <button onClick={handleSimulateTrade}>{tradeType === 'buy' ? 'Buy' : 'Sell'}</button>

                {tradeMessage && (
                    <p className={`trade-message ${tradeMessage.type}`}>
                        {tradeMessage.text}
                    </p>
                )}
            </div>
        </div>
    );
}

export default TradePage;