import React from 'react';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminPage = () => {
  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-3xl font-bold">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;