import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/register/student" element={<StudentRegister />} />
            <Route path="/register/counselor" element={<CounselorRegister />} />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselor-approvals"
              element={
                <ProtectedRoute>
                  <CounselorApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselor-dashboard"
              element={
                <ProtectedRoute>
                  <CounselorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselors"
              element={
                <ProtectedRoute>
                  <CounselorDirectory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/counselor/:id"
              element={
                <ProtectedRoute>
                  <CounselorProfileView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditCounselorProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pending-requests"
              element={
                <ProtectedRoute>
                  <PendingRequests />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
