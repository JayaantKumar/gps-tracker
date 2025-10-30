import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api';
import { FaMapMarkerAlt, FaStopCircle } from 'react-icons/fa';

const PING_INTERVAL = 30000; // 30 seconds

const LocationTracker = ({ children }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [status, setStatus] = useState({
    onPremises: false,
    message: 'Location tracking is off.',
  });
  const [error, setError] = useState(null);

  const sendLocationPing = async (position) => {
    try {
      const { latitude, longitude } = position.coords;
      const { data } = await api.post('/location/ping', {
        lat: latitude,
        lng: longitude,
      });

      setStatus({
        onPremises: data.onPremises,
        message: data.onPremises
          ? `You are ON premises. (${data.distanceFromCenter}m from center)`
          : `You are OFF premises. (${data.distanceFromCenter}m from center)`,
      });
      setError(null);
    } catch (err) {
      console.error('Failed to send location ping:', err);
      const errorMessage = err.response?.data?.message || 'API Error';
      setError(errorMessage);
      setStatus((s) => ({ ...s, message: `Error: ${errorMessage}` }));
      toast.error(`Ping failed: ${errorMessage}`);
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      toast.error('Geolocation is not supported.');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    // Initial ping
    navigator.geolocation.getCurrentPosition(sendLocationPing, handleError, options);

    // Start watching
    const id = navigator.geolocation.watchPosition(
      sendLocationPing,
      handleError,
      options
    );
    setWatchId(id);
    setIsTracking(true);
    toast.success('Location tracking started!');
    setStatus({ onPremises: false, message: 'Starting tracking...' });
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
    setWatchId(null);
    setIsTracking(false);
    toast.success('Location tracking stopped.');
    setStatus({ onPremises: false, message: 'Location tracking is off.' });
  };

  const handleError = (err) => {
    let message = '';
    switch (err.code) {
      case err.PERMISSION_DENIED:
        message = 'User denied the request for Geolocation.';
        break;
      case err.POSITION_UNAVAILABLE:
        message = 'Location information is unavailable.';
        break;
      case err.TIMEOUT:
        message = 'The request to get user location timed out.';
        break;
      default:
        message = 'An unknown error occurred.';
    }
    setError(message);
    toast.error(message);
    setStatus((s) => ({ ...s, message: `Error: ${message}` }));
    setIsTracking(false);
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Location Status</h3>
          <p
            className={`text-lg ${
              status.onPremises ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status.message}
          </p>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </div>
        {!isTracking ? (
          <button
            onClick={startTracking}
            className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          >
            <FaMapMarkerAlt /> Start Tracking
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
          >
            <FaStopCircle /> Stop Tracking
          </button>
        )}
      </div>
      {/* Render the TeacherDashboard component, passing the status */}
      <div className="mt-6">{children(status)}</div>
    </div>
  );
};

export default LocationTracker;