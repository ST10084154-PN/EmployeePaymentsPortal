import React, { useEffect, useState } from 'react';
import axios from 'axios';
export default function Balance({ token }) {
  const [balance, setBalance] = useState(0);
  const [info, setInfo] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/api/payments/balance', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setBalance(res.data.balance); setInfo({ email: res.data.email, username: res.data.username }); })
      .catch(err => console.log(err));
  }, [token]);

  return (
    <div>
      <h3>Welcome, {info.username || 'Employee'}</h3>
      <p>Email: {info.email}</p>
      <h2>Your Balance: ${balance.toFixed(2)}</h2>
    </div>
  );
}
