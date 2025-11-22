import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import TeacherTable from './TeacherTable';
import LocationMap from './LocationMap';
import Loader from '../shared/Loader';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth'; // Import useAuth to handle logout

const POLLING_INTERVAL = 5000; // 5 seconds

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth(); // Get logout function
  const intervalRef = useRef(null); // Use ref to control the interval

  const fetchData = async () => {
    try {
      const [teacherRes, geofenceRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/geofences'),
      ]);

      setTeachers(teacherRes.data);
      setGeofences(geofenceRes.data);
      setError(null);
    } catch (err) {
      console.error("Dashboard Error:", err);
      
      // CRITICAL FIX: If 401 (Unauthorized), stop polling and logout
      if (err.response && err.response.status === 401) {
        clearInterval(intervalRef.current); // Stop the loop
        toast.error("Session expired. Please login again.");
        logout(); // Log the user out
        return;
      }

      const message = err.response?.data?.message || 'Failed to fetch data';
      setError(message);
      // We don't toast here to avoid spamming errors every 5 seconds
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    
    // Start polling and save the ID to the ref
    intervalRef.current = setInterval(fetchData, POLLING_INTERVAL);

    // Cleanup function
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (loading) return <Loader />;
  
  // Don't show error UI for 401s, as we are redirecting. Only show for real errors.
  if (error && !error.includes("401")) {
    return <div className="p-4 text-red-500">Error loading dashboard: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="h-[400px] w-full bg-white rounded-lg shadow overflow-hidden">
        <LocationMap teachers={teachers} geofences={geofences} />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <TeacherTable teachers={teachers} />
      </div>
    </div>
  );
};

export default AdminDashboard;