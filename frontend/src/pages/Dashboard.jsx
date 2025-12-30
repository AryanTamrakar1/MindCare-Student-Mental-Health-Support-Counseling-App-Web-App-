import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  // Security Guard
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* --- SHARED HEADER --- */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome, {user.name}! 👋
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
              Online
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          
          {/* --- STUDENT VIEW --- */}
          {user.role === 'Student' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-white rounded-3xl p-16 shadow-sm border border-gray-100 text-center">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Your Student Account is Ready</h2>
              </div>
            </div>
          )}

          {/* --- COUNSELOR VIEW --- */}
          {user.role === 'Counselor' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {user.status !== 'Approved' ? (
                <div className="bg-orange-50 border border-orange-100 rounded-3xl p-16 text-center">
                  <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-orange-800 tracking-tight">Verification in Progress</h3>
                  <p className="text-orange-700 mt-4 max-w-lg mx-auto text-lg">
                    Thank you for applying. An admin is currently reviewing your professional credentials.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-16 shadow-sm border border-gray-100 text-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Your Counselor Account is Ready</h2>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;