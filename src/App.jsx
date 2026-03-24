import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ComplaintProvider } from './context/ComplaintContext';

import Landing from './pages/Landing';
import Login from './pages/Login';

import CitizenDashboard from './pages/CitizenDashboard';
import MyComplaints from './pages/MyComplaints';
import SubmitComplaint from './pages/SubmitComplaint';
import Tracking from './pages/Tracking';

import OfficerDashboard from './pages/OfficerDashboard';
import Assigned from './pages/Assigned';
import Resolved from './pages/Resolved';
import OfficerAnalytics from './pages/OfficerAnalytics';

import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';
import Departments from './pages/Departments';
import Reports from './pages/Reports';

function App() {
  return (
    <ComplaintProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<CitizenDashboard />} />
          <Route path="/my-complaints" element={<MyComplaints />} />
          <Route path="/submit" element={<SubmitComplaint />} />
          <Route path="/tracking/:id" element={<Tracking role="citizen" />} />

          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/officer/assigned" element={<Assigned />} />
          <Route path="/officer/resolved" element={<Resolved />} />
          <Route path="/officer/analytics" element={<OfficerAnalytics />} />
          <Route path="/officer/tracking/:id" element={<Tracking role="officer" />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<AdminComplaints />} />
          <Route path="/admin/departments" element={<Departments />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/tracking/:id" element={<Tracking role="admin" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ComplaintProvider>
  );
}

export default App;
