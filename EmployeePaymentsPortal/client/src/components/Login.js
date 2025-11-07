import React, { useState } from 'react';
import axios from 'axios';
export default function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setToken(res.data.token);
      alert('Login successful!');
    } catch (err) {
      const msg = err.response?.data?.msg || (err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : 'Login failed');
      alert(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <h2>Employee Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ display:'block', marginBottom:10, width:'100%' }} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ display:'block', marginBottom:10, width:'100%' }} />
      <button type="submit">Login</button>
    </form>
  );
}
