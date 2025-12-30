import React, { useState } from 'react';
import API from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/register', formData);
      alert(response.data.message); 
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">Join FYP</h2>
        
        <input 
          type="text" placeholder="Full Name" required
          className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        
        <input 
          type="email" placeholder="Email" required
          className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        
        <input 
          type="password" placeholder="Password" required
          className="w-full p-3 mb-4 border rounded-lg"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />

        <select 
          className="w-full p-3 mb-6 border rounded-lg"
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="Student">Student</option>
          <option value="Counselor">Counselor</option>
        </select>
        
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;