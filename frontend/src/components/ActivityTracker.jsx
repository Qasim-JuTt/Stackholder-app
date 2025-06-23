import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageVisit } from '../../api/trackerApi';

const ActivityTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Get or create sessionId
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('sessionId', sessionId);
    }

    // Get userId from localStorage
    const storedUser = localStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser)?.id : null;

    logPageVisit(location.pathname, userId, sessionId);
  }, [location.pathname]);

  return null;
};

export default ActivityTracker;
