// client/src/App.js (updated)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import './styles/auth.css';
import './styles/home.css';
import './styles/components.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import NotFound from './pages/NotFound';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={
            <ProtectedRoute>
             
              <Home />
            </ProtectedRoute>
            
          } />
          <Route path="/create-event" element={
            <ProtectedRoute>
              <CreateEvent />
           
            </ProtectedRoute>
          } />
          <Route path="/events/:id" element={
            <ProtectedRoute>
        
              <EventDetails />
            </ProtectedRoute>
          } />
          <Route path="/edit-event/:id" element={
            <ProtectedRoute>
              <CreateEvent isEditing={true} />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;