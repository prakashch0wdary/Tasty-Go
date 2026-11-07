import React, { useEffect, useState } from 'react';
import api from '../api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/my')
      .then((res) => setOrders(res.data))
      .catch(() => setError('Could not load orders. Please log in.'));
  }, []);

  return (
    <div className="container">
      <h2>My Orders</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {orders.map((order) => (
        <div className="card" key={order._id} style={{ padding: 14, marginBottom: 12 }}>
          <strong>{order.restaurant?.name}</strong>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.totalAmount}</p>
          <p style={{ color: '#888', fontSize: 13 }}>
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
      {orders.length === 0 && !error && <p>No orders yet.</p>}
    </div>
  );
}
