import React, { useState } from 'react';
import './FundsPage.css';
import Navigation from '../Navigation';

function FundsPage({ portfolio, updatePortfolio }) {
  const [transactionType, setTransactionType] = useState('deposit'); // 'deposit' or 'withdraw'
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value);
  };

  const handleSimulateFundsTransaction = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    const transactionAmount = parseFloat(amount);
    let newCashBalance = portfolio.cashBalance;

    if (transactionType === 'deposit') {
      newCashBalance += transactionAmount;
      updatePortfolio({ ...portfolio, cashBalance: newCashBalance });
      setMessage(`Successfully deposited ZAR ${transactionAmount.toFixed(2)}.`);
    } else if (transactionType === 'withdraw') {
      if (transactionAmount <= portfolio.cashBalance) {
        newCashBalance -= transactionAmount;
        updatePortfolio({ ...portfolio, cashBalance: newCashBalance });
        setMessage(`Successfully withdrew ZAR ${transactionAmount.toFixed(2)}.`);
      } else {
        setMessage('Insufficient funds for withdrawal.');
      }
    }

    // Clear the form
    setAmount('');
  };

  return (
    <div className="funds-page">
      <Navigation />
      <h2>Deposit & Withdrawal</h2>

      <div className="funds-form">
        <p className="balance">Current Balance: ZAR {portfolio.cashBalance.toFixed(2)}</p>

        <div className="form-group">
          <label htmlFor="transactionType">Transaction Type:</label>
          <select
            id="transactionType"
            value={transactionType}
            onChange={handleTransactionTypeChange}
          >
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (ZAR):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            min="0.01"
            step="0.01"
          />
        </div>

        <button onClick={handleSimulateFundsTransaction}>
          Simulate {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
        </button>

        {message && <p className="funds-message">{message}</p>}
      </div>
    </div>
  );
}

export default FundsPage;