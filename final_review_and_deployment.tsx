import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ClockIcon } from '@radix-ui/react-icons';
import { fetchTime } from '../api/timeService';
import { RootState } from '../store';
import { Container, Flex, Text, Button } from '../components';

const DigitalClock = () => {
  const [time, setTime] = useState('');
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        const currentTime = await fetchTime();
        setTime(currentTime);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Flex justify="center" align="center" direction="column">
          <ClockIcon className="text-6xl mb-4" />
          <Text variant="h1" className="mb-2">
            Current Time
          </Text>
          <Text variant="h2">{time}</Text>
          {isAuthenticated ? (
            <Button variant="secondary" onClick={() => {}}>
              Logout
            </Button>
          ) : (
            <Button onClick={() => {}}>Login</Button>
          )}
        </Flex>
      </motion.div>
    </Container>
  );
};

export default DigitalClock;