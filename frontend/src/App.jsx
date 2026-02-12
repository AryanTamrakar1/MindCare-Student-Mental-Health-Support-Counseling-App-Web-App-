import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./pages/Login";
import StudentRegister from "./pages/StudentRegister";
import CounselorRegister from "./pages/CounselorRegister";
import AdminDashboard from "./pages/AdminDashboard";
import RoleSelection from "./pages/RoleSelection";
import UserManagement from "./pages/UserManagement";
import OTPVerification from "./pages/OTPVerification";
import CounselorApprovals from "./pages/CounselorApprovals";
import StudentDashboard from "./pages/StudentDashboard";
import CounselorDashboard from "./pages/CounselorDashboard";
import ProfileSettings from "./pages/ProfileSettings";
import CounselorDirectory from "./pages/CounselorDirectory";
import CounselorProfileView from "./pages/CounselorProfileView";
import EditCounselorProfile from "./pages/EditCounselorProfile";
import PendingRequests from "./pages/PendingRequests";

function App() {
  return (
    <GoogleOAuthProvider clientId="1031518555366-ublv8f30hd667415mmq2m2gnjh4dr6s0.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/register/student" element={<StudentRegister />} />
          <Route path="/register/counselor" element={<CounselorRegister />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/counselor-approvals" element={<CounselorApprovals />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/counselors" element={<CounselorDirectory />} />
          <Route path="/counselor/:id" element={<CounselorProfileView />} />
          <Route path="/edit-profile" element={<EditCounselorProfile />} />
          <Route path="/pending-requests" element={<PendingRequests />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
