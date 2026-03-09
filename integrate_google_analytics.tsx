import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAnalytics } from '../store/analyticsSlice';

const GoogleAnalytics = () => {
  const dispatch = useDispatch();
  const analyticsInitialized = useSelector((state) => state.analytics.initialized);

  useEffect(() => {
    if (!analyticsInitialized) {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());

      gtag('config', 'YOUR_GA_TRACKING_ID');

      dispatch(initializeAnalytics());
    }
  }, [analyticsInitialized, dispatch]);

  return null;
};

export default GoogleAnalytics;