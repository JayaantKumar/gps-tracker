import React, { useState, useEffect } from 'react';
import api from '../../api';
import TeacherTable from './TeacherTable';
import LocationMap from './LocationMap';
import Loader from '../shared/Loader';
import toast from 'react-hot-toast';

const POLLING_INTERVAL = 5000; // 5 seconds

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch in parallel
      const [teacherRes, geofenceRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/geofences'),
      ]);

      setTeachers(teacherRes.data);
      setGeofences(geofenceRes.data);
      setError(null);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch data';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, POLLING_INTERVAL); // Start polling
    return () => clearInterval(intervalId); // Cleanup
  }, []);

  if (loading) return <Loader />;
  if (error)
    return <div className="text-red-500">Error loading dashboard: {error}</div>;

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