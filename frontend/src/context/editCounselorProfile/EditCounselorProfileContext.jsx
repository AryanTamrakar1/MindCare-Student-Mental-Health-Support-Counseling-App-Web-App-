import { createContext, useContext, useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const defaultSpecialties = [
  "Stress & Anxiety",
  "Academic Pressure",
  "Depression",
  "Relationship Issues",
  "Self-Esteem",
  "Career Guidance",
];

const EditCounselorProfileContext = createContext(null);

export const EditCounselorProfileProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
  const [selectedTime, setSelectedTime] = useState("09:00 AM - 10:00 AM");

  useEffect(() => {
    loadCounselorData();
  }, []);

  const loadCounselorData = async () => {
    try {
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
          if (rawSpecs[i].trim()) specList.push(rawSpecs[i].trim());
        }
      } else {
        specList = defaultSpecialties;
      }

      let eduList = [];
      if (res.data.qualifications) {
        const rawEdu = res.data.qualifications.split(", ");
        for (let i = 0; i < rawEdu.length; i++) {
          if (rawEdu[i].trim()) eduList.push(rawEdu[i].trim());
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
    } catch (err) {
      console.error("Error fetching profile", err);
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
  if (user && user.name && user.name.length > 0) userInitial = user.name.charAt(0);

  let userName = "";
  if (user && user.name) userName = user.name;

  return (
    <EditCounselorProfileContext.Provider
      value={{
        user,
        profTitle,
        setProfTitle,
        experience,
        setExperience,
        bio,
        setBio,
        specializations,
        setSpecializations,
        education,
        setEducation,
        availability,
        setAvailability,
        previewProfTitle,
        previewExperience,
        previewBio,
        previewSpecializations,
        previewEducation,
        previewAvailability,
        selectedTime,
        setSelectedTime,
        handleUpdate,
        userInitial,
        userName,
      }}
    >
      {children}
    </EditCounselorProfileContext.Provider>
  );
};

export const useEditCounselorProfileContext = () => {
  const ctx = useContext(EditCounselorProfileContext);
  if (!ctx)
    throw new Error(
      "useEditCounselorProfileContext must be used inside EditCounselorProfileProvider"
    );
  return ctx;
};