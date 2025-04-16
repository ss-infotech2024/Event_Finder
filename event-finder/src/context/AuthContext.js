// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // Configure axios
  axios.defaults.baseURL = 'http://localhost:5000/api';
  axios.defaults.withCredentials = true; // Enable sending cookies with requests
  
  // Set auth token in axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);
  
  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/auth/register', userData);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        
        navigate('/home');
        setLoading(false);
        return response.data;
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
      throw error;
    }
  };
  
  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Trying to login with:', { email, password });
      
      const response = await axios.post('/auth/login', { email, password });
      
      console.log('Login response:', response.data);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        
        navigate('/home');
        setLoading(false);
        return response.data;
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error details:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
      throw error;
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Clear authentication headers
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };
  
  // Load user data if token exists
  const loadUser = async () => {
    if (token) {
      setLoading(true);
      try {
        // Ensure the token is in the headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/auth/me');
        
        if (response.data) {
          setUser(response.data);
        } else {
          throw new Error('No user data received');
        }
      } catch (error) {
        console.error('Load user error:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    }
  };
  
  // Load user on mount if token exists
  useEffect(() => {
    loadUser();
  }, []);
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};