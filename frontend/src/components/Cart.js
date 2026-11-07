import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Cart({ cart, setCart }) {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const updateQuantity = (item, quantity) => {
    setCart((previous) => previous
      .map((current) => current.name === item.name && current.restaurantId === item.restaurantId
        ? { ...current, qty: quantity }
        : current)
      .filter((current) => current.qty > 0));
    setMessage('');
  };

  const removeItem = (item) => {
    setCart((previous) => previous.filter(
      (current) => current.name !== item.name || current.restaurantId !== item.restaurantId
    ));
    setMessage('');
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setSubmitting(true);
    setMessage('');
    try {
      await api.post('/orders', {
        restaurant: cart[0].restaurantId,
        items: cart.map(({ name, price, qty }) => ({ name, price, qty })),
        deliveryAddress: address.trim()
      });
      setCart([]);
      navigate('/orders', { state: { orderPlaced: true } });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="container cart-page">
        <section className="cart-empty">
          <span className="cart-empty-icon" aria-hidden="true">🛍️</span>
          <h1>Your cart is waiting</h1>
          <p>Find something delicious and it’ll show up here.</p>
          <button className="btn" onClick={() => navigate('/')}>Explore restaurants</button>
        </section>
      </main>
    );
  }

  return (
    <main className="container cart-page">
      <div className="cart-heading">
        <div>
          <span className="eyebrow section-eyebrow">READY WHEN YOU ARE</span>
          <h1>Your cart</h1>
          <p>{itemCount} {itemCount === 1 ? 'item' : 'items'}{cart[0].restaurantName ? ` from ${cart[0].restaurantName}` : ''}</p>
        </div>
        <button className="text-button cart-clear" onClick={() => { setCart([]); setMessage(''); }}>Clear cart</button>
      </div>

      <div className="cart-layout">
        <section className="cart-items" aria-label="Items in your cart">
          {cart.map((item) => (
            <article className="cart-item" key={`${item.restaurantId}-${item.name}`}>
              <img
                className="cart-item-image"
                src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=320&h=240&q=80'}
                alt=""
              />
              <div className="cart-item-info">
                <h2>{item.name}</h2>
                <p>₹{item.price} each</p>
                <button className="text-button remove-item" onClick={() => removeItem(item)}>Remove</button>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                  <button
                    type="button"
                    aria-label={`Decrease ${item.name} quantity`}
                    onClick={() => updateQuantity(item, item.qty - 1)}
                  >−</button>
                  <span aria-live="polite">{item.qty}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${item.name} quantity`}
                    onClick={() => updateQuantity(item, item.qty + 1)}
                  >+</button>
                </div>
                <strong className="cart-item-total">₹{item.price * item.qty}</strong>
              </div>
            </article>
          ))}
          <button className="continue-shopping" onClick={() => navigate(`/restaurant/${cart[0].restaurantId}`)}>← Continue shopping</button>
        </section>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-row"><span>Subtotal ({itemCount} items)</span><strong>₹{subtotal}</strong></div>
          <p className="summary-note">Delivery and taxes, if applicable, are confirmed by the restaurant.</p>
          <div className="summary-total"><span>Total</span><strong>₹{subtotal}</strong></div>
          <form onSubmit={placeOrder}>
            <label htmlFor="delivery-address">Delivery address</label>
            <textarea
              id="delivery-address"
              name="deliveryAddress"
              placeholder="Enter your full delivery address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
              rows={3}
            />
            {message && <p className="cart-error" role="alert">{message}</p>}
            <button className="btn checkout-button" type="submit" disabled={submitting}>
              {submitting ? 'Placing order…' : `Place order · ₹${subtotal}`}
            </button>
            <p className="secure-checkout">You’ll review your order before it’s prepared.</p>
          </form>
        </aside>
      </div>
    </main>
  );
}
