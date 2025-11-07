import React, { useState } from 'react';
import Login from './components/Login';
import Balance from './components/Balance';
import Transfer from './components/Transfer';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  const handleLogin = newToken => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Employee Payments Portal</h1>
      {!token ? (
        <Login setToken={handleLogin} />
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
          <Balance token={token} />
          <Transfer token={token} />
        </div>
      )}
    </div>
  );
}
