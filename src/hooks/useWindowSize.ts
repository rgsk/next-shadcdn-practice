'use client';

import { useEffect, useState } from 'react';

// Custom hook to determine window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial window size
    handleResize();

    // Add event listener to update window size on resize
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Only run effect once after mounting

  return { windowWidth: windowSize.width, windowHeight: windowSize.height };
};

export default useWindowSize;
