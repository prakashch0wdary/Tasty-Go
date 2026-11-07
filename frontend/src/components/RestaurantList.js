import React, { useCallback, useEffect, useState } from 'react';
import api from '../api';
import RestaurantCard from './RestaurantCard';

const cuisines = ['All', 'North Indian', 'Italian', 'Chinese', 'South Indian', 'Burgers', 'Japanese', 'Mexican', 'Healthy', 'Street Food'];

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRestaurants = useCallback(async (query = '', cuisine = 'All') => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (query.trim()) params.search = query.trim();
      if (cuisine !== 'All') params.cuisine = cuisine;
      const { data } = await api.get('/restaurants', { params });
      setRestaurants(data);
    } catch (err) {
      setError('Could not load restaurants. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants('', 'All');
  }, [fetchRestaurants]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(search);
  };

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" /> GOOD FOOD, GOOD MOOD</span>
            <h1>Your next<br />great meal is <span>here.</span></h1>
            <p>Local favorites, delivered fresh to your door.</p>
            <form className="search-form" onSubmit={handleSearch}>
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                aria-label="Search dishes, restaurants, or cuisines"
                placeholder="Search dishes, restaurants, cuisines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn search-button" type="submit">Find food</button>
            </form>
            <div className="hero-note"><span>✦</span> Fresh picks from your neighborhood</div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-food">🍜</div>
            <div className="floating-label label-top"><span>★</span> 4.9 rated</div>
            <div className="floating-label label-bottom">Made with <span>♥</span></div>
          </div>
        </div>
      </section>

      <section className="container discovery" id="restaurants">
        <div className="section-heading">
          <div>
            <span className="eyebrow section-eyebrow">A LITTLE SOMETHING FOR EVERYONE</span>
            <h2>Explore the menu</h2>
            <p className="section-description">Find something delicious for whatever you're craving.</p>
          </div>
          <span className="results-count">{restaurants.length} places to explore</span>
        </div>

        <div className="cuisine-list" aria-label="Filter by cuisine">
          {cuisines.map((cuisine) => (
            <button
              className={`cuisine-chip${activeCuisine === cuisine ? ' active' : ''}`}
              key={cuisine}
              onClick={() => {
                setActiveCuisine(cuisine);
                fetchRestaurants(search, cuisine);
              }}
              type="button"
            >
              {cuisine}
            </button>
          ))}
        </div>

        {loading && <div className="status-message"><span className="spinner" /> Finding your favorites...</div>}
        {error && <div className="status-message error-message">{error} <button className="text-button" onClick={() => fetchRestaurants(search, activeCuisine)}>Try again</button></div>}
        {!loading && !error && restaurants.length === 0 && (
          <div className="empty-state">
            <span aria-hidden="true">🥡</span>
            <h3>No restaurants found</h3>
            <p>Try a different search or choose another cuisine.</p>
            <button className="btn" onClick={() => { setSearch(''); setActiveCuisine('All'); fetchRestaurants('', 'All'); }}>Show all restaurants</button>
          </div>
        )}

        {!loading && !error && restaurants.length > 0 && (
          <div className="grid">
            {restaurants.map((r) => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
        )}
      </section>
      <footer className="site-footer">Made by Nandamuri&apos;s team mates</footer>
    </main>
  );
}
