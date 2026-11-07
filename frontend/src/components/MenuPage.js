import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function MenuPage({ cart, setCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [cartNotice, setCartNotice] = useState('');

  useEffect(() => {
    api
      .get(`/restaurants/${id}`)
      .then((res) => setRestaurant(res.data))
      .catch(() => setError('Could not load restaurant menu.'));
  }, [id]);

  const addToCart = (item) => {
    const otherRestaurantItem = cart.find((cartItem) => cartItem.restaurantId !== id);
    if (otherRestaurantItem) {
      setCartNotice('Your cart has items from another restaurant. Clear it before adding these dishes.');
      return;
    }

    setCartNotice('');
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name && i.restaurantId === id);
      if (existing) {
        return prev.map((i) => (i.name === item.name && i.restaurantId === id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1, restaurantId: id, restaurantName: restaurant.name }];
    });
  };

  const changeQuantity = (item, quantity) => {
    setCart((previous) => previous
      .map((cartItem) => cartItem.name === item.name && cartItem.restaurantId === id
        ? { ...cartItem, qty: quantity }
        : cartItem)
      .filter((cartItem) => cartItem.qty > 0));
  };

  if (error) return <div className="container"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!restaurant) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h2>{restaurant.name}</h2>
      <p style={{ color: '#666' }}>{restaurant.cuisine} · ★ {restaurant.rating} · {restaurant.deliveryTimeMins} mins</p>
      {cartNotice && (
        <div className="cart-notice" role="status">
          <span>{cartNotice}</span>
          <button className="text-button" onClick={() => { setCart([]); setCartNotice(''); }}>Clear cart</button>
        </div>
      )}

      <div className="menu-list">
        {restaurant.menu.map((item) => {
          const cartItem = cart.find((entry) => entry.name === item.name && entry.restaurantId === id);
          return (
          <div className="menu-item" key={item.name}>
            <img
              className="menu-item-image"
              src={item.imageUrl || restaurant.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=320&h=240&q=80'}
              alt={item.name}
              loading="lazy"
            />
            <div className="menu-item-details">
              <strong>{item.name}</strong>
              <span className={`menu-item-type${item.isVeg ? ' veg' : ''}`} aria-label={item.isVeg ? 'Vegetarian' : 'Non-vegetarian'} />
              <div className="menu-item-price">₹{item.price}</div>
            </div>
            {cartItem ? (
              <div className="quantity-control menu-quantity-control" aria-label={`Quantity for ${item.name}`}>
                <button
                  type="button"
                  aria-label={`Decrease ${item.name} quantity`}
                  onClick={() => changeQuantity(item, cartItem.qty - 1)}
                >−</button>
                <span aria-live="polite">{cartItem.qty}</span>
                <button
                  type="button"
                  aria-label={`Increase ${item.name} quantity`}
                  onClick={() => addToCart(item)}
                >+</button>
              </div>
            ) : (
              <button className="btn" onClick={() => addToCart(item)}>Add</button>
            )}
          </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <button className="btn menu-cart-button" onClick={() => navigate('/checkout')}>
          View cart ({cart.reduce((s, i) => s + i.qty, 0)} items · ₹{cart.reduce((sum, i) => sum + i.price * i.qty, 0)})
        </button>
      )}
    </div>
  );
}
