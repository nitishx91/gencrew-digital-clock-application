import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTime } from '../store/timeSlice';
import { authenticate } from '../store/authSlice';
import { fetchTime } from '../api/timeService';
import { login } from '../api/authService';
import { motion } from 'framer-motion';
import { HiClock } from'react-icons/hi';

const Clock = () => {
  const dispatch = useDispatch();
  const time = useSelector((state) => state.time.value);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const authResponse = await login({ username: 'user', password: 'pass' });
        const timeResponse = await fetchTime(authResponse.token);
        dispatch(setTime(timeResponse.time));
        dispatch(authenticate(authResponse.token));
      } catch (error) {
        console.error('Error fetching time:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
      <div className="text-center">
        <HiClock size={100} className="mb-4" />
        <h1 className="text-4xl font-bold">{time}</h1>
      </div>
    </motion.div>
  );
};

export default Clock;