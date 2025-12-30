import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import StudentRegister from './pages/StudentRegister';
import CounselorRegister from './pages/CounselorRegister';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard'; 
import RoleSelection from './pages/RoleSelection'; 

// --- 1. ADD THIS NEW IMPORT ---
import OTPVerification from './pages/OTPVerification'; 

function App() {
  return (
    <GoogleOAuthProvider clientId="1031518555366-ublv8f30hd667415mmq2m2gnjh4dr6s0.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/role-selection" element={<RoleSelection />} />

          {/* --- 2. ADD THIS NEW ROUTE --- */}
          <Route path="/verify-otp" element={<OTPVerification />} />

          <Route path="/register/student" element={<StudentRegister />} />
          <Route path="/register/counselor" element={<CounselorRegister />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;