import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";
import ProfileForm from "../components/counselorProfile/ProfileForm";
import AvailabilitySection from "../components/counselorProfile/AvailabilitySection";
import ProfilePreview from "../components/counselorProfile/ProfilePreview";

const defaultSpecialties = [
  "Stress & Anxiety",
  "Academic Pressure",
  "Depression",
  "Relationship Issues",
  "Self-Esteem",
  "Career Guidance",
];

const EditCounselorProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profTitle, setProfTitle] = useState("");
  const [experience, setExperience] = useState(0);
  const [bio, setBio] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [education, setEducation] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [previewProfTitle, setPreviewProfTitle] = useState("");
  const [previewExperience, setPreviewExperience] = useState(0);
  const [previewBio, setPreviewBio] = useState("");
  const [previewSpecializations, setPreviewSpecializations] = useState([]);
  const [previewEducation, setPreviewEducation] = useState([]);
  const [previewAvailability, setPreviewAvailability] = useState([]);

  const [newSpecialty, setNewSpecialty] = useState("");
  const [newEdu, setNewEdu] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00 AM - 10:00 AM");

  useEffect(() => {
    loadCounselorData();
  }, []);

  const loadCounselorData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const res = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);

      if (res.data.role !== "Counselor") {
        alert("Access denied. Only counselors can edit professional profiles.");
        window.history.back();
        return;
      }

      let specList = [];
      if (res.data.specialization) {
        const rawSpecs = res.data.specialization.split(", ");
        for (let i = 0; i < rawSpecs.length; i++) {
          if (rawSpecs[i].trim()) {
            specList.push(rawSpecs[i].trim());
          }
        }
      } else {
        specList = defaultSpecialties;
      }

      let eduList = [];
      if (res.data.qualifications) {
        const rawEdu = res.data.qualifications.split(", ");
        for (let i = 0; i < rawEdu.length; i++) {
          if (rawEdu[i].trim()) {
            eduList.push(rawEdu[i].trim());
          }
        }
      }

      const loadedProfTitle = res.data.profTitle || "";
      const loadedExperience = res.data.experience || 0;
      const loadedBio = res.data.bio || "";
      const loadedAvailability = res.data.availability || [];

      setProfTitle(loadedProfTitle);
      setExperience(loadedExperience);
      setBio(loadedBio);
      setSpecializations(specList);
      setEducation(eduList);
      setAvailability(loadedAvailability);

      setPreviewProfTitle(loadedProfTitle);
      setPreviewExperience(loadedExperience);
      setPreviewBio(loadedBio);
      setPreviewSpecializations(specList);
      setPreviewEducation(eduList);
      setPreviewAvailability(loadedAvailability);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile", err);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = sessionStorage.getItem("token");
      let specializationString = "";
      for (let i = 0; i < specializations.length; i++) {
        if (i > 0) specializationString = specializationString + ", ";
        specializationString = specializationString + specializations[i];
      }

      let qualificationsString = "";
      for (let i = 0; i < education.length; i++) {
        if (i > 0) qualificationsString = qualificationsString + ", ";
        qualificationsString = qualificationsString + education[i];
      }

      const payload = {
        profTitle: profTitle,
        specialization: specializationString,
        experience: experience,
        bio: bio,
        qualifications: qualificationsString,
        availability: availability,
      };

      await axios.put("/auth/edit-counselor-profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPreviewProfTitle(profTitle);
      setPreviewExperience(experience);
      setPreviewBio(bio);
      setPreviewSpecializations(specializations);
      setPreviewEducation(education);
      setPreviewAvailability(availability);

      alert("Profile Saved Successfully!");
    } catch (err) {
      alert("Update Failed");
      console.error(err);
    }
  };

  let userInitial = "";
  if (user && user.name && user.name.length > 0) {
    userInitial = user.name.charAt(0);
  }

  let userName = "";
  if (user && user.name) {
    userName = user.name;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex">
        <CounselorSidebar user={user} />
        <main className="flex-1 ml-[280px] p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Loading Editor...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      <CounselorSidebar user={user} />

      <main className="flex-1 ml-[280px] p-10">
        <div className="mb-8 border-b-2 border-slate-300 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Edit Your Professional Profile
            </h2>
            <p className="text-gray-500">
              Update your qualifications, specialty, and weekly availability for
              students.
            </p>
          </div>
          <Navbar />
        </div>

        <div className="w-full flex flex-col gap-6">
          <div className="grid grid-cols-12 gap-6 items-start">
            <ProfileForm
              profTitle={profTitle}
              setProfTitle={setProfTitle}
              experience={experience}
              setExperience={setExperience}
              bio={bio}
              setBio={setBio}
              specializations={specializations}
              setSpecializations={setSpecializations}
              education={education}
              setEducation={setEducation}
              newSpecialty={newSpecialty}
              setNewSpecialty={setNewSpecialty}
              newEdu={newEdu}
              setNewEdu={setNewEdu}
            />

            <AvailabilitySection
              availability={availability}
              setAvailability={setAvailability}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              handleUpdate={handleUpdate}
            />
          </div>

          <ProfilePreview
            userInitial={userInitial}
            userName={userName}
            previewProfTitle={previewProfTitle}
            previewExperience={previewExperience}
            previewBio={previewBio}
            previewSpecializations={previewSpecializations}
            previewEducation={previewEducation}
            previewAvailability={previewAvailability}
          />
        </div>
      </main>
    </div>
  );
};

export default EditCounselorProfile;
