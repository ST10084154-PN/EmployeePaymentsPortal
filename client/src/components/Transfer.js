import React, { useState } from 'react';
import axios from 'axios';
export default function Transfer({ token }) {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/payments/transfer', { recipientEmail: email, amount }, { headers: { Authorization: `Bearer ${token}` } });
      alert(res.data.msg);
    } catch (err) {
      const msg = err.response?.data?.msg || (err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : 'Transfer failed');
      alert(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h3>Send Payment</h3>
      <input placeholder="Recipient Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ display:'block', marginBottom:10, width:'100%' }} />
      <input placeholder="Amount" type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required style={{ display:'block', marginBottom:10, width:'100%' }} />
      <button type="submit">Send</button>
    </form>
  );
}
