import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";
import CounselorSidebar from "../components/CounselorSidebar";
import Navbar from "../components/Navbar";

const EditCounselorProfile = () => {
  const location = useLocation();

  const [user, setUser] = useState(location.state?.user || null);

  const [loading, setLoading] = useState(true);

  const defaultSpecialties = [
    "Stress & Anxiety",
    "Academic Pressure",
    "Depression",
    "Relationship Issues",
    "Self-Esteem",
    "Career Guidance",
  ];

  const [formData, setFormData] = useState({
    profTitle: "",
    experience: 0,
    bio: "",
    specializations: [],
    education: [],
    availability: [],
  });

  const [previewData, setPreviewData] = useState({
    profTitle: "",
    experience: 0,
    bio: "",
    specializations: [],
    education: [],
    availability: [],
  });

  const [newSpecialty, setNewSpecialty] = useState("");

  const [newEdu, setNewEdu] = useState("");

  const [selectedTime, setSelectedTime] = useState("09:00 AM - 10:00 AM");

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  // It loads the counselor's profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("token");
        const res = await axios.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        if (res.data.role !== "Counselor") {
          alert(
            "Access denied. Only counselors can edit professional profiles.",
          );
          window.history.back();
          return;
        }

        const specList = res.data.specialization
          ? res.data.specialization.split(", ")
          : defaultSpecialties;

        const eduList = res.data.qualifications
          ? res.data.qualifications.split(", ")
          : [];

        const initialData = {
          profTitle: res.data.profTitle || "",
          experience: res.data.experience || 0,
          bio: res.data.bio || "",
          specializations: specList,
          education: eduList,
          availability: res.data.availability || [],
        };

        setFormData(initialData);
        setPreviewData(initialData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // It updates the form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // It adds a specific time slot to the availability list
  const addSlot = (day) => {
    const exists = formData.availability.find(
      (s) => s.day === day && s.timeSlot === selectedTime,
    );
    if (exists) {
      alert("Slot already exists!");
      return;
    }
    const updatedList = [
      ...formData.availability,
      { day: day, timeSlot: selectedTime },
    ];
    updatedList.sort(
      (a, b) => timeSlots.indexOf(a.timeSlot) - timeSlots.indexOf(b.timeSlot),
    );
    setFormData({ ...formData, availability: updatedList });
  };

  // It removes a specific time slot from the availability list
  const removeSlot = (index) => {
    const updated = formData.availability.filter((_, i) => i !== index);
    setFormData({ ...formData, availability: updated });
  };

  // It adds a new tag to the specializations list
  const addSpecialty = () => {
    if (newSpecialty && !formData.specializations.includes(newSpecialty)) {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, newSpecialty],
      });
      setNewSpecialty("");
    }
  };

  // It adds a new degree to the education list
  const addEducation = () => {
    if (newEdu) {
      setFormData({ ...formData, education: [...formData.education, newEdu] });
      setNewEdu("");
    }
  };

  // It send the updated data to the backend
  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const payload = {
        profTitle: formData.profTitle,
        specialization: formData.specializations.join(", "),
        experience: formData.experience,
        bio: formData.bio,
        qualifications: formData.education.join(", "),
        availability: formData.availability,
      };

      await axios.put("/auth/edit-counselor-profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPreviewData({ ...formData });
      alert("Profile Saved Successfully!");
    } catch (err) {
      alert("Update Failed");
    }
  };

  // It show the days of the week in a proper order
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // It helps to renders the edit counselor page
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6]">
        <Navbar user={user} />
        <div className="flex">
          <CounselorSidebar user={user} />
          <main className="flex-1 p-10 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              Loading Editor...
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Navbar user={user} />
      <div className="flex">
        <CounselorSidebar user={user} />
        <main className="flex-1 p-10">
          {/* It is the title and description section */}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-800">
              Edit Your Professional Profile
            </h2>
            <p className="text-gray-500">
              Update your qualifications, specialty, and weekly availability for
              students.
            </p>
          </div>

          {/* It is the form section for title, experience and bio */}
          <div className="w-full flex flex-col gap-6">
            <div className="grid grid-cols-12 gap-6 items-start">
              <div className="col-span-7 flex flex-col gap-6">
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        name="profTitle"
                        value={formData.profTitle}
                        onChange={handleChange}
                        className="p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none focus:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase">
                      About Me (Bio)
                    </label>
                    <textarea
                      name="bio"
                      rows="4"
                      value={formData.bio}
                      onChange={handleChange}
                      className="p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-normal outline-none focus:bg-white min-h-[120px]"
                    />
                  </div>
                </section>

                {/* It is the section to add and remove counselor specializations */}
                <div className="grid grid-cols-2 gap-4">
                  <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[260px] overflow-hidden flex flex-col">
                    <label className="block text-xs font-black text-indigo-600 mb-3 uppercase">
                      Specializations
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {defaultSpecialties.map((tag) => (
                        <button
                          key={tag}
                          onClick={() =>
                            !formData.specializations.includes(tag) &&
                            setFormData({
                              ...formData,
                              specializations: [
                                ...formData.specializations,
                                tag,
                              ],
                            })
                          }
                          className="text-[9px] font-black px-2 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-indigo-100 hover:text-indigo-600"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        className="flex-1 p-3 rounded-xl border border-gray-100 bg-gray-50 text-xs font-bold"
                        placeholder="Add specialty..."
                      />
                      <button
                        onClick={addSpecialty}
                        className="bg-indigo-600 text-white px-4 rounded-xl font-black"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-1 flex flex-wrap gap-2">
                      {formData.specializations.map((s) => (
                        <span
                          key={s}
                          className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black border border-indigo-100 flex items-center gap-2 h-fit"
                        >
                          {s}{" "}
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                specializations:
                                  formData.specializations.filter(
                                    (x) => x !== s,
                                  ),
                              })
                            }
                            className="text-red-400"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* It is the section to add and remove counselor educations */}
                  <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[260px] overflow-hidden flex flex-col">
                    <label className="block text-xs font-black text-indigo-600 mb-3 uppercase">
                      Education
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newEdu}
                        onChange={(e) => setNewEdu(e.target.value)}
                        className="flex-1 p-3 rounded-xl border border-gray-100 bg-gray-50 text-xs font-bold"
                        placeholder="Add degree..."
                      />
                      <button
                        onClick={addEducation}
                        className="bg-indigo-600 text-white px-4 rounded-xl font-black"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                      {formData.education.map((e, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 p-3 rounded-xl text-[10px] font-black border border-gray-100 flex justify-between items-center shadow-sm"
                        >
                          <span className="truncate mr-2">{e}</span>
                          <button
                            onClick={() =>
                              setFormData({
                                ...formData,
                                education: formData.education.filter(
                                  (_, idx) => idx !== i,
                                ),
                              })
                            }
                            className="text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              {/* It is the section to add and remove the working hours of the counselor availability */}
              <div className="col-span-5">
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[555px]">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-black text-indigo-600 uppercase">
                      Availability
                    </h4>
                    <select
                      className="bg-gray-50 p-2 rounded-lg outline-none font-black text-indigo-600 text-[10px] border border-gray-100"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 space-y-4 overflow-y-auto pr-2 mb-4">
                    {daysOrder.map((day) => (
                      <div
                        key={day}
                        className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center min-h-[60px]"
                      >
                        <button
                          onClick={() => addSlot(day)}
                          className="w-7 h-7 bg-indigo-600 text-white rounded-lg font-black text-sm mr-3"
                        >
                          +
                        </button>
                        <span className="font-black text-gray-700 text-[9px] uppercase w-16">
                          {day}
                        </span>
                        <div className="flex flex-wrap gap-1 flex-1">
                          {formData.availability
                            .filter((s) => s.day === day)
                            .map((slot, idx) => (
                              <span
                                key={idx}
                                className="bg-white text-indigo-700 px-2 py-1 rounded-md text-[8px] font-black border border-indigo-100 flex items-center gap-1"
                              >
                                {slot.timeSlot}
                                <button
                                  onClick={() =>
                                    removeSlot(
                                      formData.availability.indexOf(slot),
                                    )
                                  }
                                  className="text-red-400"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleUpdate}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-base font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-[0.98]"
                  >
                    Save All Changes
                  </button>
                </section>
              </div>
            </div>

            {/* It is the student view preview section */}
            <div className="w-full mt-4">
              <div className="flex flex-col items-center mb-4 text-center">
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em]">
                  Student View Preview
                </span>
              </div>

              {/* It is the student view preview card */}
              <div className="bg-white rounded-[32px] border border-gray-200 overflow-hidden shadow-sm mb-10 w-full">
                <div className="flex justify-between items-center p-6 px-10 border-b border-gray-100 bg-white">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black border border-indigo-100">
                      {user?.name?.charAt(0)}
                    </div>
                    <div>
                      <h1 className="text-xl font-black text-gray-900 leading-tight">
                        {user?.name}
                      </h1>
                      <p className="text-gray-500 font-bold text-xs">
                        {previewData.profTitle || "Professional Counselor"}
                      </p>
                      <span className="text-emerald-600 text-[9px] font-black uppercase tracking-widest mt-1 block">
                        ● Available
                      </span>
                    </div>
                  </div>
                  <button className="bg-indigo-600 text-white px-10 py-3.5 rounded-2xl text-xs font-black shadow-lg opacity-60 cursor-not-allowed">
                    Request Session
                  </button>
                </div>

                {/* It is the experience, students helped, and rating in student view preview */}
                <div className="grid grid-cols-3 border-b border-gray-100 bg-[#f8fafc]">
                  <div className="flex flex-col items-center justify-center py-6 border-r border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎓</span>
                      <span className="text-base font-black text-gray-800">
                        {previewData.experience || 0}+ Yrs
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                      Experience
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center py-6 border-r border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🤝</span>
                      <span className="text-base font-black text-gray-800">
                        0
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                      Students Helped
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⭐</span>
                      <span className="text-base font-black text-gray-800">
                        0.0
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                      Rating
                    </p>
                  </div>
                </div>

                {/* It is the about counselor bio section in student view preview */}
                <div className="p-8 px-10 space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-3">
                      About Counselor
                    </h4>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <p className="text-gray-600 text-sm leading-relaxed font-medium">
                        {previewData.bio || "No biography provided."}
                      </p>
                    </div>
                  </div>

                  {/* It is the specialization and education section in student view preview */}
                  <div className="grid grid-cols-2 gap-16">
                    <div>
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-3">
                        Specialization
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {previewData.specializations.map((s, i) => (
                          <span
                            key={i}
                            className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-[11px] font-bold border border-indigo-100"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-3">
                        Education
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {previewData.education.map((e, i) => (
                          <span
                            key={i}
                            className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[11px] font-bold border border-emerald-100"
                          >
                            ✓ {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* It is the weekly schedule preview section in student view preview */}
                  <div className="pt-6 border-t border-gray-100 bg-[#f1f5f9] -mx-10 px-10 pb-8">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-5 text-center">
                      Weekly Consultation Schedule
                    </h4>
                    <div className="grid grid-cols-5 gap-6">
                      {daysOrder.map((day) => (
                        <div
                          key={day}
                          className="rounded-2xl p-4 border bg-white border-indigo-100 flex flex-col items-center"
                        >
                          <p className="text-[10px] font-black text-indigo-600 uppercase mb-4 text-center border-b-2 border-indigo-50 w-full pb-2">
                            {day}
                          </p>
                          <div className="space-y-2 w-full">
                            {timeSlots.map((slotTime, idx) => {
                              const hasSession = previewData.availability.find(
                                (s) => s.day === day && s.timeSlot === slotTime,
                              );
                              return hasSession ? (
                                <div
                                  key={idx}
                                  className="bg-indigo-600 text-white text-[8px] font-black p-2.5 rounded-xl text-center h-[38px] flex items-center justify-center"
                                >
                                  {slotTime}
                                </div>
                              ) : (
                                <div
                                  key={idx}
                                  className="bg-indigo-50 text-indigo-300 text-[8px] font-black p-2.5 rounded-xl text-center border border-dashed border-indigo-200 h-[38px] flex items-center justify-center"
                                >
                                  No Session
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditCounselorProfile;
