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
  
  // Sample events data (in a real app, you would fetch from API)
  const sampleEvents = [
    {
      id: 1,
      title: 'Summer Music Festival 2025',
      description: 'Join us for three days of amazing live music performances featuring top artists from around the world. The festival will include multiple stages, food vendors, art installations, and camping options.',
      category: 'Music',
      date: '2025-06-15T18:00:00',
      time: '6:00 PM - 11:00 PM',
      location: 'Central Park, New York',
      ticketAvailability: 500,
      ticketPrice: 75,
      image: 'https://placehold.co/800x400/coral/white?text=Music+Event',
      organizer: {
        id: 'test123',
        name: 'NYC Events'
      }
    },
    {
      id: 2,
      title: 'Web Development Bootcamp',
      description: 'Intensive 2-day workshop covering the latest web development techniques and tools. Perfect for beginners and intermediate developers looking to enhance their skills.',
      category: 'Education',
      date: '2025-05-20T09:00:00',
      time: '9:00 AM - 5:00 PM',
      location: 'Tech Hub, San Francisco',
      ticketAvailability: 50,
      ticketPrice: 120,
      image: 'https://placehold.co/800x400/lightblue/black?text=Tech+Bootcamp',
      organizer: {
        id: 'test123',
        name: 'CodeMasters'
      }
    },
    {
      id: 3,
      title: 'Basketball Championship Finals',
      description: 'Watch the top two teams battle it out for the championship title in this exciting final game of the season.',
      category: 'Sports',
      date: '2025-04-30T19:30:00',
      time: '7:30 PM - 10:00 PM',
      location: 'Sports Arena, Chicago',
      ticketAvailability: 200,
      ticketPrice: 25,
      image: 'https://placehold.co/800x400/orange/white?text=Basketball+Event',
      organizer: {
        id: 'user456',
        name: 'Sports League'
      }
    },
    {
      id: 4,
      title: 'AI & Machine Learning Conference',
      description: 'Join industry leaders and researchers for talks, workshops, and networking focused on the latest advancements in AI and machine learning.',
      category: 'Technology',
      date: '2025-05-10T10:00:00',
      time: '10:00 AM - 6:00 PM',
      location: 'Convention Center, Seattle',
      ticketAvailability: 300,
      ticketPrice: 150,
      image: 'https://placehold.co/800x400/purple/white?text=Tech+Conference',
      organizer: {
        id: 'test123',
        name: 'TechTalks'
      }
    }
  ];
  
  useEffect(() => {
    // Fetch event details from API
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        
        // First try to fetch from API using the ID as is
        try {
          const eventData = await getEventById(id);
          console.log('Event data from API:', eventData);
          setEvent(eventData);
          setLoading(false);
          return; // Exit if successful
        } catch (apiError) {
          console.log('API fetch failed, trying sample data:', apiError.message);
          // Continue to sample data fallback
        }
        
        // Fallback to sample data
        const foundEvent = sampleEvents.find(e => String(e.id) === id || e.id === parseInt(id, 10));
        if (foundEvent) {
          console.log('Found event in sample data:', foundEvent);
          setEvent(foundEvent);
          setLoading(false);
        } else {
          console.log('Event not found in sample data');
          setError('Event not found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load event details:', error);
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
        // Call the API to delete the event
        await deleteEvent(id);
        alert('Event deleted successfully');
        navigate('/home');
      } catch (error) {
        alert('Failed to delete event. Please try again.');
        console.error('Error deleting event:', error);
        setLoading(false);
      }
    }
  };
  
  // Check if user is the organizer of the event
  const isOrganizer = () => {
    if (!user || !event) return false;
    
    const userId = user.id || user._id;
    
    // Handle different organizer data formats
    if (typeof event.organizer === 'object') {
      const organizerId = event.organizer.id || event.organizer._id;
      return userId === organizerId;
    } else {
      // If organizer is just an ID string
      return userId === event.organizer;
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/home')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="not-found-container">
        <h2>Event Not Found</h2>
        <p>The event you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/home')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="event-details-page">
      <header className="header">
        <div className="header-content">
          <Link to="/home" className="back-button">
            <span>←</span> Back to Events
          </Link>
          <h1 className="site-title">Event Finder</h1>
        </div>
      </header>
      
      <div className="event-details-container">
        <div className="event-header">
          <div className="event-title-section">
            <h1 className="event-title">{event.title}</h1>
            <p className="event-organizer">
              Organized by: {typeof event.organizer === 'object' ? event.organizer.name : (event.organizer || 'Unknown')}
            </p>
          </div>
          
          {isOrganizer() && (
            <div className="organizer-actions">
              <Link to={`/edit-event/${getEventId(event)}`} className="btn-secondary">
                Edit Event
              </Link>
              <button onClick={handleDelete} className="btn-danger">
                Delete Event
              </button>
            </div>
          )}
        </div>
        
        <div className="event-content">
          <div className="event-image-container">
            <ImageWithFallback 
              src={event.image} 
              alt={event.title} 
              className="event-image" 
            />
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
                  <p className="ticket-price">
                    {event.ticketPrice > 0 ? `$${event.ticketPrice}` : 'Free'}
                  </p>
                  <p className="ticket-availability">
                    {event.ticketAvailability} spots available
                  </p>
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
              <button className="btn-primary btn-large">
                Get Tickets
              </button>
            </div>
          </div>
        </div>
        
        <div className="event-description">
          <h2>About This Event</h2>
          <p>{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;