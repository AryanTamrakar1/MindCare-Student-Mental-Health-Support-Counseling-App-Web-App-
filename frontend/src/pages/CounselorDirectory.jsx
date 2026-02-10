import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import StudentSidebar from '../components/StudentSidebar';
import Navbar from '../components/Navbar';

const CounselorDirectory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user; 

    const [counselors, setCounselors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("All");

    const specialties = [
        "All", "Anxiety", "Depression", "Academic Stress", 
        "Career Pressure", "Relationship", "Social Anxiety", 
        "Self-Esteem", "Grief", "Sleep Issues", "Focus & ADHD"
    ];

    useEffect(() => {
        fetchCounselors();
    }, []);

    const fetchCounselors = async () => {
        try {
            const response = await axios.get('/api/auth/counselors');
            setCounselors(response.data);
        } catch (error) {
            console.error("Error fetching counselors", error);
        }
    };

    const handleSearch = async () => {
        try {
            const specParam = selectedSpecialty === "All" ? "" : selectedSpecialty;
            const response = await axios.get(`/api/auth/search?name=${searchTerm}&specialization=${specParam}`);
            setCounselors(response.data);
        } catch (error) {
            console.error("Search failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />

            <div className="flex">
                <StudentSidebar user={user} />
                
                <main className="flex-1 p-10">
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-gray-800">Find Your Counselor</h2>
                        <p className="text-gray-500">Connect with professionals specialized in student well-being.</p>
                    </div>

                    <section className="mb-6">
                        <div className="flex bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                            <input 
                                type="text" 
                                placeholder="Search by name..." 
                                className="flex-1 p-3 outline-none text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button 
                                onClick={handleSearch}
                                className="bg-[#4f46e5] text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                            >
                                Search
                            </button>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Filter by Specialization:</p>
                            <div className="flex gap-2">
                                <button className="text-[12px] font-bold bg-[#4f46e5] text-white px-4 py-1.5 rounded-md" onClick={handleSearch}>Apply</button>
                                <button className="text-[12px] font-bold bg-gray-100 text-gray-600 px-4 py-1.5 rounded-md border border-gray-200" onClick={() => {setSelectedSpecialty("All"); fetchCounselors();}}>Clear</button>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {specialties.map(spec => (
                                <button 
                                    key={spec}
                                    onClick={() => setSelectedSpecialty(spec)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                                        selectedSpecialty === spec 
                                        ? 'bg-[#4f46e5] text-white' 
                                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-[#4f46e5]'
                                    }`}
                                >
                                    {spec}
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {counselors.map((cslr) => (
                            <div key={cslr._id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition relative">
                                <div className="flex justify-end mb-2">
                                    <span className="text-[10px] font-black px-3 py-1 rounded-full bg-green-100 text-green-700 uppercase">Available</span>
                                </div>
                                
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-indigo-50 text-[#4f46e5] rounded-xl flex items-center justify-center font-black text-xl">
                                        {cslr.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{cslr.name}</h3>
                                        <p className="text-xs font-semibold text-gray-400">{cslr.specialization}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 line-clamp-2 mb-6 h-10">
                                    {cslr.bio || "Helping students find peace and balance in their academic journey."}
                                </p>
                                
                                <button 
                                    onClick={() => navigate(`/counselor/${cslr._id}`, { state: { user } })}
                                    className="w-full py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-[#4f46e5] hover:text-white hover:border-[#4f46e5] transition"
                                >
                                    View Profile
                                </button>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CounselorDirectory;