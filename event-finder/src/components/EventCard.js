// client/src/components/EventCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleClick = () => {
    navigate(`/events/${event._id}`);
  };
  
  return (
    <div 
      className="event-card" 
      onClick={handleClick}
    >
      <div className="event-image">
        <img src={event.image} alt={event.title} />
      </div>
      <div className="event-info">
        <h3 className="event-title">{event.title}</h3>
        <div className="event-details">
          <span className="event-category">{event.category}</span>
          <span className="event-date">{formatDate(event.date)}</span>
        </div>
        <div className="event-location">{event.location}</div>
        <div className="event-price">
          {event.ticketPrice > 0 ? `$${event.ticketPrice}` : 'Free'}
        </div>
      </div>
    </div>
  );
};

export default EventCard;