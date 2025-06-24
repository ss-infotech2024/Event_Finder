// client/src/pages/EventDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getEventById, deleteEvent } from '../services/eventService';
import { getEventId, isValidId } from '../utils/idUtils';
import ImageWithFallback from '../components/ImageWithFallback';
import '../styles/eventDetails.css';
import '../styles/components.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const sampleEvents = [
    {
      id: 1,
      title: 'Summer Music Festival 2025',
      description: 'Join us for three days of amazing live music...',
      category: 'Music',
      date: '2025-06-15T18:00:00',
      time: '6:00 PM - 11:00 PM',
      location: 'Central Park, New York',
      ticketAvailability: 500,
      ticketPrice: 75,
      image: 'https://placehold.co/800x400/coral/white?text=Music+Event',
      organizer: { id: 'test123', name: 'NYC Events' },
    },
    // ... other sample events ...
  ];

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        try {
          const eventData = await getEventById(id);
          setEvent(eventData);
          setLoading(false);
          return;
        } catch (apiError) {
          console.log('API fetch failed, trying sample data:', apiError.message);
        }
        const foundEvent = sampleEvents.find(e => String(e.id) === id || e.id === parseInt(id, 10));
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Event not found');
        }
        setLoading(false);
      } catch (error) {
        setError('Error loading event details');
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setLoading(true);
        await deleteEvent(id);
        alert('Event deleted successfully');
        navigate('/home');
      } catch (error) {
        alert('Failed to delete event. Please try again.');
        setLoading(false);
      }
    }
  };

  const isOrganizer = () => {
    if (!user || !event) return false;
    const userId = user.id || user._id;
    const organizerId = typeof event.organizer === 'object' ? event.organizer.id || event.organizer._id : event.organizer;
    return userId === organizerId;
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }
    setTimeout(() => {
      setPaymentSuccess(true);
    }, 1000);
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div><p>Loading event details...</p></div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/home')} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="not-found-container">
        <h2>Event Not Found</h2>
        <p>The event you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/home')} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <header className="header">
        <div className="header-content">
          <Link to="/home" className="back-button">← Back to Events</Link>
          <h1 className="site-title">Event Finder</h1>
        </div>
      </header>

      <div className="event-details-container">
        <div className="event-header">
          <div className="event-title-section">
            <h1 className="event-title">{event.title}</h1>
            <p className="event-organizer">Organized by: {typeof event.organizer === 'object' ? event.organizer.name : (event.organizer || 'Unknown')}</p>
          </div>

          {isOrganizer() && (
            <div className="organizer-actions">
              <Link to={`/edit-event/${getEventId(event)}`} className="btn-secondary">Edit Event</Link>
              <button onClick={handleDelete} className="btn-danger">Delete Event</button>
            </div>
          )}
        </div>

        <div className="event-content">
          <div className="event-image-container">
            <ImageWithFallback src={event.image} alt={event.title} className="event-image" />
          </div>

          <div className="event-info-container">
            <div className="event-info">
              <div className="info-item">
                <div className="info-icon">📅</div>
                <div className="info-text">
                  <h3>Date & Time</h3>
                  <p>{formatDate(event.date)}</p>
                  <p>{event.time}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div className="info-text">
                  <h3>Location</h3>
                  <p>{event.location}</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🎟️</div>
                <div className="info-text">
                  <h3>Tickets</h3>
                  <p className="ticket-price">{event.ticketPrice > 0 ? `₹${event.ticketPrice}` : 'Free'}</p>
                  <p className="ticket-availability">{event.ticketAvailability} spots available</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🏷️</div>
                <div className="info-text">
                  <h3>Category</h3>
                  <p>{event.category}</p>
                </div>
              </div>
            </div>

            <div className="ticket-action">
              <button className="btn-primary btn-large" onClick={() => setShowPaymentModal(true)}>Get Tickets</button>
            </div>
          </div>
        </div>

        <div className="event-description">
          <h2>About This Event</h2>
          <p>{event.description}</p>
        </div>
      </div>

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Choose Payment Method</h2>
            {!paymentSuccess ? (
              <>
               <img src="/payment_qr.png" alt="QR Code" className="qr-image" />
               <button className="btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>

              </>
            ) : (
              <>
                <p className="success-text">✅ Payment successful! See you at the event.</p>
                <button className="btn-primary" onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentSuccess(false);
                }}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
