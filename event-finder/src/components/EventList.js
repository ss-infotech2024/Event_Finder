// client/src/components/EventList.js
import React from 'react';
import EventCard from './EventCard';

const EventList = ({ title, events, loading, error }) => {
  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;
  if (events.length === 0) return <div className="no-events">No events found.</div>;
  
  return (
    <div className="event-list-container">
      <h2>{title}</h2>
      <div className="event-list">
        {events.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventList;