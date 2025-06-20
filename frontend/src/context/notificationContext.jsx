import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const NotificationContext = createContext();
const API_URL = import.meta.env.VITE_API_URL + '/api/notifications';

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(API_URL);
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();
  }, []);

  const addNotification = async (message) => {
    try {
      const res = await axios.post(API_URL, { message });
      setNotifications(prev => [res.data, ...prev].slice(0, 100));
    } catch (err) {
      console.error('Failed to add notification:', err);
    }
  };

  const removeNotification = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const clearNotifications = async () => {
    try {
      await axios.delete(API_URL);
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear notifications:', err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
