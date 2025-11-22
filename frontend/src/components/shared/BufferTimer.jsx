import React, { useState, useEffect } from 'react';

const BufferTimer = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    if (!expiresAt) return null;
    
    const difference = new Date(expiresAt).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return 0;
    }

    return {
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    // Update the timer every 1 second
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      // Stop the timer if time is up
      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  // Render logic
  if (!expiresAt) {
    return <span className="text-gray-400 text-xs">Inactive</span>;
  }

  if (timeLeft === 0) {
    return <span className="text-red-500 font-bold text-xs">Expired</span>;
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md font-mono text-sm font-bold border border-indigo-100">
        {timeLeft.minutes.toString().padStart(2, '0')}:
        {timeLeft.seconds.toString().padStart(2, '0')}
      </div>
      <span className="text-xs text-indigo-400 animate-pulse">left</span>
    </div>
  );
};

export default BufferTimer;