import React, { useState, useEffect, useRef } from 'react';
import api from '../../api';
import TeacherTable from './TeacherTable';
import LocationMap from './LocationMap';
import StatCard from '../shared/StatCard';
import Loader from '../shared/Loader';
import AddTeacherModal from './AddTeacherModal'; // Import Modal
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { FaUsers, FaMapMarkedAlt, FaChartPie, FaCog, FaSignOutAlt, FaFileCsv, FaPlus } from 'react-icons/fa';

const POLLING_INTERVAL = 5000;

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState([]);
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // Navigation State
  const [isModalOpen, setIsModalOpen] = useState(false);   // Modal State

  const { logout, user } = useAuth();
  const intervalRef = useRef(null);

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
      if (err.response && err.response.status === 401) {
        clearInterval(intervalRef.current);
        logout();
        return;
      }
      // Only set error if it's NOT a 401 to avoid flickering during redirects
      if (!err.response || err.response.status !== 401) {
         setError(err.response?.data?.message || 'Failed to fetch data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, POLLING_INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // --- FEATURE: Generate CSV Report ---
  const generateReport = () => {
    if (teachers.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Name", "Email", "Status", "Last Seen", "Buffer Status"];
    const rows = teachers.map(t => [
      t.name,
      t.email,
      t.onPremises ? "Inside Campus" : "Outside",
      t.lastSeen ? new Date(t.lastSeen).toLocaleString() : "Never",
      t.bufferExpiresAt ? "Active Buffer" : "-"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report downloaded!");
  };

  // Calculate Stats
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.onPremises).length;
  const attendanceRate = totalTeachers > 0 ? Math.round((activeTeachers / totalTeachers) * 100) : 0;

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-gray-900">
      <AddTeacherModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full">
        <div className="p-6">
          <h1 className="text-xl font-bold text-indigo-900 tracking-tight">District HQ</h1>
          <p className="text-xs text-gray-500 mt-1">Command Center</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem 
            icon={FaMapMarkedAlt} 
            label="Command Center" 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={FaUsers} 
            label="Teachers List" 
            isActive={activeTab === 'teachers'} 
            onClick={() => setActiveTab('teachers')} 
          />
          {/* These can be placeholders for now */}
          <NavItem icon={FaChartPie} label="Attendance Records" onClick={() => toast('Feature coming soon')} />
          <NavItem icon={FaCog} label="System Settings" onClick={() => toast('Feature coming soon')} />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:ml-64">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200 sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'dashboard' ? 'District Command Center' : 'Teacher Management'}
          </h2>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
             </div>
             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                {user?.name?.charAt(0)}
             </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* VIEW: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map */}
                <div className="lg:col-span-2 bg-white p-1 border border-gray-100 rounded-2xl shadow-sm h-[400px] flex flex-col">
                   <div className="p-4 border-b border-gray-50 mb-1 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">Campus Attendance Hotspots</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">Live Updates</span>
                   </div>
                   <div className="flex-1 rounded-xl overflow-hidden relative">
                      <LocationMap teachers={teachers} geofences={geofences} />
                   </div>
                </div>

                {/* Stats */}
                <div className="space-y-6">
                  <StatCard title="Total Teachers" value={totalTeachers} icon={FaUsers} color="bg-indigo-500" />
                  <StatCard title="Active On-Premise" value={activeTeachers} icon={FaMapMarkedAlt} color="bg-green-500" />
                  <StatCard title="Attendance Rate" value={`${attendanceRate}%`} icon={FaChartPie} color="bg-blue-500" />
                  
                  {/* Quick Actions */}
                  <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
                     <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
                     <div className="space-y-2">
                        <button 
                          onClick={generateReport}
                          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                        >
                           <FaFileCsv className="mr-2 text-green-600" /> Generate Daily Report
                        </button>
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                        >
                           <FaPlus className="mr-2 text-indigo-600" /> Add New Teacher
                        </button>
                     </div>
                  </div>
                </div>
              </div>

              <TeacherTable teachers={teachers} />
            </>
          )}

          {/* VIEW: TEACHERS LIST */}
          {activeTab === 'teachers' && (
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-lg font-semibold">All Registered Teachers</h3>
                   <button 
                      onClick={() => setIsModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                   >
                      <FaPlus /> Add Teacher
                   </button>
                </div>
                <TeacherTable teachers={teachers} />
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

// Updated NavItem to handle Clicks and Active State
const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all ${
    isActive 
      ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  }`}>
    <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
    {label}
  </button>
);

export default AdminDashboard;