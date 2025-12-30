import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";

const CounselorRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const googleUser = location.state?.user;

  const [formData, setFormData] = useState({
    name: googleUser?.name || "",
    email: googleUser?.email || "",
    password: "",
    role: "Counselor",
    phone: "",
    qualifications: "",
    experience: "",
    specialization: "",
    licenseNo: "",
    bio: "",
  });

  const [photo, setPhoto] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (photo) {
      data.append("verificationPhoto", photo);
    }

    try {
      if (googleUser) {
        await API.put("/auth/update-role", data);
        alert("Application Submitted! Please wait for Admin approval.");
      } else {
        await API.post("/auth/register", data);
        alert("Application Submitted! Admin will review your credentials.");
      }
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting application");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600 transition"
        >
          ← Back to Login
        </button>
      </div>

      <div className="bg-white py-10 px-10 shadow-xl rounded-[2.5rem] max-w-2xl mx-auto w-full border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Counselor Application
          </h2>
          {googleUser ? (
            <p className="text-emerald-600 font-bold mt-2">
              Completing profile for: {googleUser.email}
            </p>
          ) : (
            <p className="text-gray-500 mt-2 font-medium">
              Join our network of professional counselors
            </p>
          )}
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {!googleUser && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. John Doe"
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+60 12-345 6789"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                License No.
              </label>
              <input
                type="text"
                placeholder="e.g. LKM-12345"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
                onChange={(e) =>
                  setFormData({ ...formData, licenseNo: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Highest Qualification
              </label>
              <input
                type="text"
                placeholder="e.g. PhD in Clinical Psychology"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
                onChange={(e) =>
                  setFormData({ ...formData, qualifications: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Years of Exp.
              </label>
              <input
                type="number"
                placeholder="e.g. 5"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Specialization
              </label>
              <input
                type="text"
                placeholder="e.g. Anxiety, Stress Management, CBT"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Upload Identification Photo (IC/License)
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="w-full p-8 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer text-transparent file:hidden"
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
                        <p className="text-sm font-bold text-gray-900">
                          Photo selected
                        </p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                          {photo.name}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-gray-400">
                      Click to select or drag photo here
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Statement of Purpose / Bio
              </label>
              <textarea
                rows="4"
                placeholder="Describe your motivation..."
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition text-sm font-medium"
                required
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              ></textarea>
            </div>
          </div>

          {!googleUser && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Create Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          )}

          <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start gap-3">
            <span className="text-emerald-600 mt-0.5">ⓘ</span>
            <p className="text-xs text-emerald-800 font-medium leading-relaxed">
              <strong>Application Process:</strong> Your account will remain{" "}
              <strong>Pending</strong>. You will be able to log in once our
              Admin team has verified your credentials.
            </p>
          </div>

          <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 active:scale-95 transition-all text-lg">
            {googleUser
              ? "Complete & Submit Application"
              : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CounselorRegister;
