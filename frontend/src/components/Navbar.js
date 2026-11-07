import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ cart = [] }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand"><span className="brand-mark">T</span> Tasty-Go</Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/" className="nav-link">Discover</Link>
          <Link to="/checkout" className="nav-link nav-cart" aria-label={`Cart, ${cartCount} items`}>
            Cart <span className="nav-cart-count">{cartCount}</span>
          </Link>
          {token ? (
            <>
              <Link to="/orders" className="nav-link">My Orders</Link>
              <button className="nav-login" onClick={logout}>Log out</button>
            </>
          ) : (
            <Link to="/login" className="nav-login">Log in <span aria-hidden="true">↗</span></Link>
          )}
        </nav>
      </div>
    </header>
  );
}
