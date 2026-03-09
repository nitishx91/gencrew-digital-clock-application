import { useState, useEffect } from'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setTime } from '../store/timeSlice';
import { cacheGet, cacheSet } from '../utils/cache';

const TimeService = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchTime = async () => {
    setLoading(true);
    try {
      const cachedTime = await cacheGet('current_time');
      if (cachedTime) {
        dispatch(setTime(cachedTime));
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/time');
      const currentTime = response.data.time;
      await cacheSet('current_time', currentTime, 60); // Cache for 60 seconds
      dispatch(setTime(currentTime));
    } catch (error) {
      console.error('Error fetching time:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTime();
    const interval = setInterval(fetchTime, 60000); // Fetch time every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <h1 className="text-4xl font-bold">Current Time: {useSelector((state) => state.time)}</h1>
      )}
    </div>
  );
};

export default TimeService;