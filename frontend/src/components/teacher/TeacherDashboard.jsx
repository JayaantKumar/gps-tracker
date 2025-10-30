import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api';

const TeacherDashboard = ({ locationStatus }) => {
  const [loading, setLoading] = useState(false);
  const [teacherStatus, setTeacherStatus] = useState(null);

  // Function to get the teacher's full status (including buffer)
  const fetchTeacherStatus = async () => {
    try {
      const { data } = await api.get('/teachers/me');
      setTeacherStatus(data);
    } catch (error) {
      toast.error('Could not fetch teacher status.');
    }
  };

  // Fetch status on mount and when location status changes
  useEffect(() => {
    fetchTeacherStatus();
  }, [locationStatus]);

  const handleMarkAttendance = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/teachers/attendance/biometric');
      toast.success(data.message);
      fetchTeacherStatus(); // Refresh status after marking
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark attendance';
      toast.error(message);
    }
    setLoading(false);
  };

  const getBufferTime = () => {
    if (!teacherStatus || !teacherStatus.bufferExpiresAt) return null;
    const expires = new Date(teacherStatus.bufferExpiresAt).getTime();
    const now = new Date().getTime();
    const diff = expires - now;

    if (diff <= 0) return 'Buffer expired';

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s remaining`;
  };

  const bufferTime = getBufferTime();

  return (
    <div className="p-4 mt-4 border-t border-gray-200">
      <h2 className="mb-4 text-2xl font-semibold">My Attendance</h2>
      <div className="p-4 bg-gray-100 rounded-lg">
        {teacherStatus && (
          <div className="space-y-2">
            <p>
              <strong>Status:</strong>{' '}
              {teacherStatus.onPremises ? (
                <span className="font-semibold text-green-600">On Premises</span>
              ) : (
                <span className="font-semibold text-red-600">Off Premises</span>
              )}
            </p>
            {bufferTime && (
              <p>
                <strong>Attendance Buffer:</strong>{' '}
                <span className="font-semibold text-blue-600">{bufferTime}</span>
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleMarkAttendance}
          disabled={loading || !teacherStatus?.bufferExpiresAt || bufferTime === 'Buffer expired'}
          className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-600 rounded shadow hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Mark Biometric/Face Attendance (Mock)'}
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard;