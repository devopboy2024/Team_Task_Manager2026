import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/Projects';
import AdminTasks from './pages/admin/Tasks';
import AdminMembers from './pages/admin/Members';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';

// Member Pages
import MemberDashboard from './pages/member/Dashboard';
import MemberTasks from './pages/member/Tasks';
import MemberProjects from './pages/member/Projects';
import MemberCalendar from './pages/member/Calendar';
import MemberProfile from './pages/member/Profile';

// Error Pages
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
          
          {/* Member Routes */}
          <Route path="/member" element={<ProtectedRoute allowedRoles={['member', 'admin']} />}>
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="tasks" element={<MemberTasks />} />
            <Route path="projects" element={<MemberProjects />} />
            <Route path="calendar" element={<MemberCalendar />} />
            <Route path="profile" element={<MemberProfile />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;