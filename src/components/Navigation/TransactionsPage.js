import React from 'react';
import './TransactionsPage.css';
import Navigation from '../Navigation';
// import { Oval } from 'react-loader-spinner';

function TransactionsPage({ transactions }) {

  // const [loading, setLoading] = useState(false);

  // if (loading) {
  //   return (
  //     <div
  //       style={{
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         height: '100vh',
  //       }}
  //     >
  //       <Oval color="#3498db" height={80} width={80} />
  //     </div>
  //   )
  // }
  return (
    <div className="transactions-page">
      <Navigation />
      <h2>Transaction History</h2>
      {transactions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.type}</td>
                <td>{transaction.symbol}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.price}</td>
                <td>{transaction.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions recorded yet.</p>
      )}
    </div>
  );
}

export default TransactionsPage;
