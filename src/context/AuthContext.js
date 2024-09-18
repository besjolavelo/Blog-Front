import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ token: null, user: null });
    console.log("here");
    
  useEffect(() => {
    console.log("here 1");
    const token = localStorage.getItem('token');
    console.log('Token on refresh:', token); // Debugging token retrieval

    if (token) {
        console.log("here 2");
      axios.get('http://localhost:5000/api/users/my-profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
            console.log("here 3");
          console.log('User profile:', response.data); // Debugging user profile fetch
          setAuthState({ token, user: response.data });
        })
        .catch(err => {
            console.log("here 4");
          console.error('Error fetching user profile:', err);
          localStorage.removeItem('token');
          setAuthState({ token: null, user: null });
        });
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    const userResponse = await axios.get('http://localhost:5000/api/users/my-profile', { headers: { Authorization: `Bearer ${token}` } });
    setAuthState({ token, user: userResponse.data });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
