import React, { useEffect, useState } from'react';
import { useSelector, useDispatch } from'react-redux';
import { setTime } from '../store/timeSlice';
import { authenticate } from '../store/authSlice';
import { motion } from 'framer-motion';
import { useTimeService } from '../hooks/useTimeService';
import { useAuthService } from '../hooks/useAuthService';

const Clock = () => {
  const dispatch = useDispatch();
  const time = useSelector((state) => state.time.value);
  const [authenticated, setAuthenticated] = useState(false);

  const { getTime } = useTimeService();
  const { login } = useAuthService();

  useEffect(() => {
    const fetchTime = async () => {
      const currentTime = await getTime();
      dispatch(setTime(currentTime));
    };

    const authenticateUser = async () => {
      const token = await login();
      if (token) {
        setAuthenticated(true);
      }
    };

    fetchTime();
    authenticateUser();
  }, [dispatch, getTime, login]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center h-screen"
    >
      {authenticated? (
        <div className="text-4xl font-bold">
          {time}
        </div>
      ) : (
        <div className="text-red-500 text-2xl">
          Please authenticate to see the time.
        </div>
      )}
    </motion.div>
  );
};

export default Clock;