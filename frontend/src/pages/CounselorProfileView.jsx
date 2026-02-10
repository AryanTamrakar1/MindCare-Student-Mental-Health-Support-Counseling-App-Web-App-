import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import StudentSidebar from '../components/StudentSidebar';
import Navbar from '../components/Navbar';

const CounselorProfileView = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state?.user;

    const [counselor, setCounselor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [bookingData, setBookingData] = useState({
        reason: "",
        date: "",
        timeSlot: "",
        specialization: ""
    });

    useEffect(() => {
        const fetchCounselorData = async () => {
            try {
                const response = await axios.get('/api/auth/counselors');
                const found = response.data.find(c => c._id === id);
                setCounselor(found);
            } catch (error) {
                console.error("Error loading counselor profile", error);
            }
        };
        fetchCounselorData();
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/appointments/request', {
                counselorId: id,
                date: bookingData.date,
                timeSlot: bookingData.timeSlot,
                reason: `${bookingData.specialization}: ${bookingData.reason}`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(response.data.message);
            setIsModalOpen(false); 
        } catch (error) {
            alert(error.response?.data?.message || "Booking failed");
        }
    };

    if (!counselor) return <div className="p-10">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className={`dashboard-container ${isModalOpen ? 'blur-bg' : ''}`}>
                <Navbar user={user} />
                <div className="flex">
                    <StudentSidebar user={user} />
                    
                    <main className="main-content flex-1 p-10">
                        <header className="top-bar flex justify-between items-center mb-8">
                            <div className="page-title">
                                <button className="back-btn text-[#4f46e5] font-bold mb-2" onClick={() => navigate(-1)}>
                                    ← Back to Directory
                                </button>
                                <h2 className="text-2xl font-black">Counselor Profile</h2>
                            </div>
                        </header>

                        <div className="unified-profile-box bg-white rounded-[24px] border border-gray-200 overflow-hidden max-w-[900px] mx-auto shadow-sm">
                            <div className="profile-header flex justify-between items-center p-10 border-b border-gray-100">
                                <div className="header-left flex items-center gap-6">
                                    <div className="profile-avatar-large w-[90px] h-[90px] bg-indigo-50 text-[#4f46e5] rounded-[20px] flex items-center justify-center text-3xl font-black">
                                        {counselor.name.charAt(0)}
                                    </div>
                                    <div className="header-text">
                                        <h1 className="text-2xl font-bold text-gray-900">{counselor.name}</h1>
                                        <p className="text-gray-500 font-semibold">{counselor.specialization}</p>
                                        <span className="status-pill available bg-green-100 text-green-700 text-[11px] font-black px-3 py-1 rounded-full uppercase">Available for Sessions</span>
                                    </div>
                                </div>
                                <button 
                                    className="main-request-btn bg-[#4f46e5] text-white px-7 py-3 rounded-xl font-bold"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Request a Session
                                </button>
                            </div>

                            <div className="stats-grid grid grid-cols-3 p-6 bg-gray-50 gap-5 border-b border-gray-100">
                                <div className="stat-card bg-white p-4 rounded-2xl flex items-center gap-3 border border-gray-200">
                                    <div className="stat-icon text-xl">🎓</div>
                                    <div className="stat-info">
                                        <span className="stat-val font-black block">10+</span>
                                        <span className="stat-lbl text-[11px] text-gray-400 font-bold uppercase">Years Exp.</span>
                                    </div>
                                </div>
                                <div className="stat-card bg-white p-4 rounded-2xl flex items-center gap-3 border border-gray-200">
                                    <div className="stat-icon text-xl">🤝</div>
                                    <div className="stat-info">
                                        <span className="stat-val font-black block">500+</span>
                                        <span className="stat-lbl text-[11px] text-gray-400 font-bold uppercase">Students</span>
                                    </div>
                                </div>
                                <div className="stat-card bg-white p-4 rounded-2xl flex items-center gap-3 border border-gray-200">
                                    <div className="stat-icon text-xl">⭐</div>
                                    <div className="stat-info">
                                        <span className="stat-val font-black block">4.9</span>
                                        <span className="stat-lbl text-[11px] text-gray-400 font-bold uppercase">Rating</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-body-content p-10">
                                <div className="info-section mb-10">
                                    <h4 className="text-[#4f46e5] text-xs font-black uppercase mb-3">About Me</h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        {counselor.bio || "No bio information provided."}
                                    </p>
                                </div>
                                <div className="info-section">
                                    <h4 className="text-[#4f46e5] text-xs font-black uppercase mb-3">Specializations</h4>
                                    <div className="specialty-pills flex gap-3 flex-wrap">
                                        {counselor.specialization?.split(',').map((s, i) => (
                                            <span key={i} className="bg-gray-100 text-gray-600 font-bold px-4 py-2 rounded-lg text-sm border border-gray-200">{s.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
                    <div className="modal-box bg-white w-[90%] max-w-[550px] rounded-[28px] p-9 shadow-2xl">
                        <div className="modal-header flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-bold">Request a Session</h3>
                                <p className="text-sm text-gray-500">Book your session with <strong className="text-[#4f46e5]">{counselor.name}</strong></p>
                            </div>
                            <button className="text-2xl text-gray-400" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        
                        <form className="modal-form" onSubmit={handleBooking}>
                            <div className="form-group mb-5">
                                <label className="block text-sm font-bold mb-2">Topic of Discussion</label>
                                <select 
                                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#4f46e5]"
                                    required
                                    onChange={(e) => setBookingData({...bookingData, specialization: e.target.value})}
                                >
                                    <option value="" disabled selected>-- Choose Topic --</option>
                                    {counselor.specialization?.split(',').map((s, i) => (
                                        <option key={i} value={s.trim()}>{s.trim()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row grid grid-cols-2 gap-5 mb-5">
                                <div className="form-group">
                                    <label className="block text-sm font-bold mb-2">Preferred Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                                        required
                                        onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-sm font-bold mb-2">Preferred Time</label>
                                    <select 
                                        className="w-full p-3 border border-gray-200 rounded-xl outline-none"
                                        required
                                        onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})}
                                    >
                                        <option value="" disabled selected>Select a Slot</option>
                                        <option>09:00 AM - 10:00 AM</option>
                                        <option>11:00 AM - 12:00 PM</option>
                                        <option>02:00 PM - 03:00 PM</option>
                                        <option>04:00 PM - 05:00 PM</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group mb-8">
                                <label className="block text-sm font-bold mb-2">Reason for Session</label>
                                <textarea 
                                    placeholder="Describe what's on your mind..." 
                                    className="w-full p-3 border border-gray-200 rounded-xl h-24 outline-none"
                                    required
                                    onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                                ></textarea>
                            </div>

                            <div className="form-footer flex gap-4">
                                <button type="button" className="flex-1 bg-gray-100 p-3 rounded-xl font-bold text-gray-600" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="flex-[2] bg-[#4f46e5] text-white p-3 rounded-xl font-bold">Send Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CounselorProfileView;