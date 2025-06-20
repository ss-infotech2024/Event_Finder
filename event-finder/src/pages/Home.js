import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/home.css';
import '../styles/components.css';
import { getEvents, getTrendingEvents, getRecommendedEvents } from '../services/eventService';
import { getEventId } from '../utils/idUtils';
import { processEventsWithImages } from '../utils/imageUtils';
import ImageWithFallback from '../components/ImageWithFallback';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  
  const [dateFilter, setDateFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showCategoryEvents, setShowCategoryEvents] = useState(false);
  
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  
  // Sample categories
  const categories = [
    { id: 1, name: 'Music', icon: '🎵' },
    { id: 2, name: 'Education', icon: '📚' },
    { id: 3, name: 'Sports', icon: '⚽' },
    { id: 4, name: 'Technology', icon: '💻' },
    { id: 5, name: 'Arts', icon: '🎨' },
    { id: 6, name: 'Food', icon: '🍔' },
    { id: 7, name: 'Business', icon: '💼' },
    { id: 8, name: 'Health', icon: '🏥' }
  ];
  
  // Sample events data (in real app, this would come from your API)
  const sampleEvents = [
    {
      id: 1,
      title: 'Summer Music Festival 2025',
      category: 'Music',
      date: '2025-06-15T18:00:00',
      location: 'Central Park, New York',
      image: 'https://placehold.co/300x160/coral/white?text=Music+Event',
      organizer: 'NYC Events'
    },
    {
      id: 2,
      title: 'Web Development Bootcamp',
      category: 'Education',
      date: '2025-05-20T09:00:00',
      location: 'Tech Hub, San Francisco',
      image: 'https://placehold.co/300x160/lightblue/black?text=Tech+Bootcamp',
      organizer: 'CodeMasters'
    },
    {
      id: 3,
      title: 'Basketball Championship Finals',
      category: 'Sports',
      date: '2025-04-30T19:30:00',
      location: 'Sports Arena, Chicago',
      image: 'https://placehold.co/300x160/orange/white?text=Basketball+Event',
      organizer: 'Sports League'
    },
    {
      id: 4,
      title: 'AI & Machine Learning Conference',
      category: 'Technology',
      date: '2025-05-10T10:00:00',
      location: 'Convention Center, Seattle',
      image: 'https://placehold.co/300x160/purple/white?text=Tech+Conference',
      organizer: 'TechTalks'
    }
  ];
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowFilters(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Fetch events from API when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Fetch events from API
        const recommended = await getRecommendedEvents();
        const trending = await getTrendingEvents();
        
        console.log('Events fetched successfully');
        
        if (recommended.length > 0 && trending.length > 0) {
          // Ensure each event has an id property for key prop
          const processedRecommended = recommended.map(event => ({
            ...event,
            id: event._id || event.id // Use _id from MongoDB or fallback to id
          }));
          
          const processedTrending = trending.map(event => ({
            ...event,
            id: event._id || event.id // Use _id from MongoDB or fallback to id
          }));
          
          setRecommendedEvents(processedRecommended);
          setTrendingEvents(processedTrending);
        } else {
          // Fallback to sample data if API returns empty results
          console.log('Using sample events data as fallback');
          // Process sample events to ensure they have valid images
          const processedSamples = processEventsWithImages(sampleEvents);
          setRecommendedEvents(processedSamples);
          setTrendingEvents([...processedSamples].reverse());
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Fallback to sample data if API fails
        console.log('Using sample events data due to API error');
        // Process sample events to ensure they have valid images
        const processedSamples = processEventsWithImages(sampleEvents);
        setRecommendedEvents(processedSamples);
        setTrendingEvents([...processedSamples].reverse());
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return '';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create filters object for API
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (dateFilter) filters.date = dateFilter;
      if (locationFilter) filters.location = locationFilter;
      
      // Fetch filtered events from API
      const filteredResults = await getEvents(filters);
      
      if (filteredResults.length > 0) {
        // Ensure each event has an id property for key prop
        const processedResults = filteredResults.map(event => ({
          ...event,
          id: event._id || event.id // Use _id from MongoDB or fallback to id
        }));
        
        setFilteredEvents(processedResults);
        setShowCategoryEvents(true); // Reuse the category events section to show search results
      } else {
        setFilteredEvents([]);
        setShowCategoryEvents(true);
      }
      
      setShowFilters(false);
    } catch (error) {
      console.error('Error searching events:', error);
      alert('Error searching events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryClick = async (categoryId) => {
    if (activeCategory === categoryId) {
      // Unselect category
      setActiveCategory(null);
      setShowCategoryEvents(false);
    } else {
      // Select category
      setActiveCategory(categoryId);
      setLoading(true);
      
      try {
        const categoryName = categories.find(cat => cat.id === categoryId)?.name;
        
        if (categoryName) {
          // Fetch events filtered by category from API
          const filteredResults = await getEvents({ category: categoryName });
          
          if (filteredResults.length > 0) {
            // Ensure each event has an id property for key prop
            const processedResults = filteredResults.map(event => ({
              ...event,
              id: event._id || event.id // Use _id from MongoDB or fallback to id
            }));
            
            setFilteredEvents(processedResults);
          } else {
            setFilteredEvents([]);
          }
          setShowCategoryEvents(true);
        }
      } catch (error) {
        console.error('Error filtering by category:', error);
        // Fallback to client-side filtering if API fails
        const categoryName = categories.find(cat => cat.id === categoryId)?.name;
        if (categoryName) {
          const filtered = sampleEvents.filter(event => event.category === categoryName);
          setFilteredEvents(filtered);
          setShowCategoryEvents(true);
        }
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/home" className="nav-logo">Event Finder</Link>
          
          <div className="nav-search-container" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                className="nav-search"
                placeholder="Search for events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowFilters(true)}
              />
              <button type="submit" className="search-icon">🔍</button>
            </form>
            
            <div className={`search-filters ${showFilters ? 'active' : ''}`}>
              <div className="filter-group">
                <label className="filter-label">Date</label>
                <input
                  type="date"
                  className="filter-input"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Location</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="City, State or Venue"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              
              <button className="filter-button" onClick={handleSearch}>Apply Filters</button>
            </div>
          </div>
          
          <div className="nav-actions">
            <div className="profile-dropdown" ref={profileRef}>
              <button
                className="profile-button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-avatar">{getUserInitials()}</div>
                <span>{user?.name}</span>
              </button>
              
              <div className={`dropdown-menu ${showProfileMenu ? 'active' : ''}`}>
                <div className="dropdown-item">
                  <span>👤</span> Profile
                </div>
                <div className="dropdown-item">
                  <span>📅</span> My Events
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout-item" onClick={logout}>
                  <span>🚪</span> Logout
                </div>
              </div>
            </div>
            
            <Link to="/create-event">
              <button className="create-event-button">+</button>
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="main-content">
        <section>
          <h2 className="section-title">Categories</h2>
          <div className="categories-container">
            {categories.map(category => (
              <div
                key={category.id}
                className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-name">{category.name}</div>
              </div>
            ))}
          </div>
        </section>
        
        {showCategoryEvents ? (
          <section>
            <div className="section-header">
              <h2 className="section-title">{categories.find(cat => cat.id === activeCategory)?.name} Events</h2>
              <button onClick={() => setActiveCategory(null)} className="view-all">Show All Categories</button>
            </div>
            
            {filteredEvents.length > 0 ? (
              <div className="events-grid">
                {filteredEvents.map(event => (
                  <Link to={`/events/${getEventId(event)}`} key={getEventId(event)}>
                    <div className="event-card">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="event-image"
                      />
                      <div className="event-content">
                        <div className="event-category">{event.category}</div>
                        <h3 className="event-title">{event.title}</h3>
                        <div className="event-details">
                          <div className="event-detail">
                            <i>📅</i> {formatDate(event.date)}
                          </div>
                          <div className="event-detail">
                            <i>📍</i> {event.location}
                          </div>
                          <div className="event-detail">
                            <i>👤</i> {typeof event.organizer === 'object' ? event.organizer.name : event.organizer}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-events-message">
                <p>No events found in this category</p>
              </div>
            )}
          </section>
        ) : (
          <>
            <section>
              <div className="section-header">
                <h2 className="section-title">Recommended For You</h2>
                <Link to="/events?type=recommended" className="view-all">View All</Link>
              </div>
              
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="events-grid">
                  {recommendedEvents.map(event => (
                    <Link to={`/events/${getEventId(event)}`} key={getEventId(event)}>
                      <div className="event-card">
                        <ImageWithFallback
                          src={event.image}
                          alt={event.title}
                          className="event-image"
                        />
                        <div className="event-content">
                          <div className="event-category">{event.category}</div>
                          <h3 className="event-title">{event.title}</h3>
                          <div className="event-details">
                            <div className="event-detail">
                              <i>📅</i> {formatDate(event.date)}
                            </div>
                            <div className="event-detail">
                              <i>📍</i> {event.location}
                            </div>
                            <div className="event-detail">
                              <i>👤</i> {typeof event.organizer === 'object' ? event.organizer.name : event.organizer}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
            
            <section>
              <div className="section-header">
                <h2 className="section-title">Trending Events</h2>
                <Link to="/events?type=trending" className="view-all">View All</Link>
              </div>
              
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="events-grid">
                  {trendingEvents.map(event => (
                    <Link to={`/events/${getEventId(event)}`} key={getEventId(event)}>
                      <div className="event-card">
                        <ImageWithFallback
                          src={event.image}
                          alt={event.title}
                          className="event-image"
                        />
                        <div className="event-content">
                          <div className="event-category">{event.category}</div>
                          <h3 className="event-title">{event.title}</h3>
                          <div className="event-details">
                            <div className="event-detail">
                              <i>📅</i> {formatDate(event.date)}
                            </div>
                            <div className="event-detail">
                              <i>📍</i> {event.location}
                            </div>
                            <div className="event-detail">
                              <i>👤</i> {typeof event.organizer === 'object' ? event.organizer.name : event.organizer}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;