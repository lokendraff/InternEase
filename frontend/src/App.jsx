import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import MockInterview from './pages/MockInterview';
import Leaderboard from './pages/Leaderboard';

import Opportunities from './pages/Opportunities';
import MyApplications from './pages/MyApplications';
import OrganizerDashboard from './pages/OrganizerDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: '#1A1A1A', color: '#FFFBEB', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#FBBF24', secondary: '#0A0A0A' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#0A0A0A' } },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/applications" element={<MyApplications />} />
      </Routes>
    </BrowserRouter>
  );
}
