import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage'; // <--- CHECK THIS LINE
import TeacherPage from './pages/TeacherPage';
import Navbar from './components/shared/Navbar';
import PrivateRoute from './components/shared/PrivateRoute';
import useAuth from './hooks/useAuth';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <LoginPage />} />
        <Route path="/admin" element={<PrivateRoute role="admin"><AdminPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute role="teacher"><TeacherPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} replace />} />
      </Routes>
    </div>
  );
}

export default App;