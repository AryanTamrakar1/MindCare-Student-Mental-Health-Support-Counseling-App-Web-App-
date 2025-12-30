import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Student',
    studentId: '', phone: '', dob: '', gender: ''
  });
  
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    if (photo) {
      data.append('verificationPhoto', photo);
    } else {
      return alert("Please upload your ID photo for verification.");
    }

    try {
      await API.post('/auth/register', data);
      alert("Registration Successful! Please verify your OTP.");
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      alert(err.response?.data?.message || "Error registering student");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition"
        >
          ← Back to Login
        </button>
      </div>

      <div className="bg-white py-10 px-8 sm:px-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] max-w-2xl mx-auto w-full border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Student Enrollment</h2>
          <p className="text-gray-400 font-medium mt-2">Enter your academic details to get started.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none" 
                required 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">University Email</label>
              <input 
                type="email" 
                placeholder="john@university.edu" 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none" 
                required 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Student ID </label>
              <input 
                type="text" 
                placeholder="202350999" 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none" 
                required 
                onChange={(e) => setFormData({...formData, studentId: e.target.value})} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
              <input 
                type="text" 
                placeholder="+977 1234567890" 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none" 
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
              <input 
                type="date" 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none" 
                onChange={(e) => setFormData({...formData, dob: e.target.value})} 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
              <select 
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none appearance-none"
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Upload Student ID Photo</label>
            <div className="relative">
              <input 
                type="file" 
                accept="image/*"
                required
                className="w-full p-8 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer text-transparent file:hidden" 
                onChange={(e) => setPhoto(e.target.files[0])} 
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2">
                {photo ? (
                  <div className="flex items-center gap-4 w-full h-full px-4">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Preview"
                      className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-900">Photo selected</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{photo.name}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-400">Click to select or drag photo here</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Set Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none" 
              required 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold mt-4 hover:bg-indigo-700 shadow-[0_10px_25px_rgba(79,70,229,0.2)] transition-all active:scale-[0.98] text-lg">
            Create Student Account
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <p className="text-sm text-gray-400 font-medium">
            Already have an account? 
            <button onClick={() => navigate('/')} className="text-indigo-600 font-bold ml-1 hover:underline underline-offset-4 transition">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;