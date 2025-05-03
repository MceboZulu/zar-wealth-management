import React, { useState, useEffect } from 'react';
import './WatchlistPage.css'; // Create this CSS file

function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [availableAssets] = useState([ // Static list for now
    { symbol: 'JSE:NPN', name: 'Naspers Ltd', currentPrice: 2650.00, change: +15.50 },
    { symbol: 'JSE:AGL', name: 'Anglo American plc', currentPrice: 520.00, change: -5.00 },
    { symbol: 'JSE:SBK', name: 'Standard Bank Group Ltd', currentPrice: 185.20, change: +2.10 },
    { symbol: 'JSE:MTN', name: 'MTN Group Ltd', currentPrice: 110.75, change: -0.50 },
    // ... more simulated assets
  ]);

  useEffect(() => {
    // Simulate fetching user's watchlist from backend
    const initialWatchlist = [availableAssets[0].symbol, availableAssets[1].symbol];
    setWatchlist(initialWatchlist);
  }, [availableAssets]);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const results = availableAssets.filter(asset =>
      asset.name.toLowerCase().includes(query) || asset.symbol.toLowerCase().includes(query)
    );
    setSearchResults(results);
  };

  const handleAddToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      setSearchResults([]); // Clear search results after adding
      setSearchQuery('');
    }
  };

  const handleRemoveFromWatchlist = (symbol) => {
    const updatedWatchlist = watchlist.filter(item => item !== symbol);
    setWatchlist(updatedWatchlist);
  };

  return (
    <div className="watchlist-page">
      <h2>My Watchlist</h2>

      <div className="watchlist-search">
        <input
          type="text"
          placeholder="Search Assets to Add"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map(asset => (
              <li key={asset.symbol}>
                {asset.name} ({asset.symbol})
                <button onClick={() => handleAddToWatchlist(asset.symbol)}>Add</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="watched-assets">
        {watchlist.map(symbol => {
          const asset = availableAssets.find(a => a.symbol === symbol);
          if (asset) {
            return (
              <li key={asset.symbol}>
                {asset.name} ({asset.symbol}) - ZAR {asset.currentPrice.toFixed(2)}
                <span className={asset.change >= 0 ? 'positive' : 'negative'}>
                  ({asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)})
                </span>
                <button onClick={() => handleRemoveFromWatchlist(asset.symbol)}>Remove</button>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}

export default WatchlistPage;