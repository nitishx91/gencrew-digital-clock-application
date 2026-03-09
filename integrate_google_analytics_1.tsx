import { useEffect } from 'react';
import { useAnalytics } from 'next/app';

const DigitalClock = () => {
  const analytics = useAnalytics();

  useEffect(() => {
    if (typeof window!== 'undefined') {
      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());

      gtag('config', 'G-XXXXXXXXXX'); // Replace with your GA tracking ID

      // Track page view
      gtag('config', 'G-XXXXXXXXXX', {
        page_path: window.location.pathname,
      });

      // Clean up on unmount
      return () => {
        window.dataLayer = [];
      };
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-4xl font-bold">Digital Clock</h1>
    </div>
  );
};

export default DigitalClock;