import React from 'react';
import TeacherDashboard from '../components/teacher/TeacherDashboard';
import LocationTracker from '../components/teacher/LocationTracker';

const TeacherPage = () => {
  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-3xl font-bold">Teacher Dashboard</h1>
      <LocationTracker>
        {/* Pass status down to TeacherDashboard */}
        {(status) => <TeacherDashboard locationStatus={status} />}
      </LocationTracker>
    </div>
  );
};

export default TeacherPage;