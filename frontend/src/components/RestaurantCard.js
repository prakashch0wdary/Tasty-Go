import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  return (
    <article
      className="card"
      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/restaurant/${restaurant._id}`);
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View ${restaurant.name} menu`}
    >
      <div className="card-image-wrap">
        <img src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85'} alt={restaurant.name} loading="lazy" />
        {restaurant.offer && <span className="offer-badge">{restaurant.offer}</span>}
        <span className="image-cuisine">{restaurant.cuisine}</span>
      </div>
      <div className="card-body">
        <div className="card-title-row">
          <h3>{restaurant.name}</h3>
          <span className="rating"><span>★</span> {restaurant.rating}</span>
        </div>
        <p className="card-address">{restaurant.address}</p>
        <div className="card-meta">
          <span><span className="meta-icon">◷</span> {restaurant.deliveryTimeMins} min</span>
          <span className="meta-separator" />
          <span>₹{restaurant.priceForTwo || 300} for two</span>
        </div>
      </div>
    </article>
  );
}
