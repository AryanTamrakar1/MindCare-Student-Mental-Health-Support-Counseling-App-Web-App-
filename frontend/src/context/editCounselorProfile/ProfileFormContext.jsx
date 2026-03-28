import { createContext, useContext } from "react";
import { useEditCounselorProfileContext } from "./EditCounselorProfileContext";

const defaultSpecialties = [
  "Stress & Anxiety",
  "Academic Pressure",
  "Depression",
  "Relationship Issues",
  "Self-Esteem",
  "Career Guidance",
];

const ProfileFormContext = createContext(null);

export const ProfileFormProvider = ({ children }) => {
  const {
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
  } = useEditCounselorProfileContext();

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const addSpecialty = (newSpecialty, setNewSpecialty) => {
    if (!newSpecialty) return;
    if (specializations.includes(newSpecialty)) return;
    setSpecializations([...specializations, newSpecialty]);
    setNewSpecialty("");
  };

  const addDefaultSpecialty = (tag) => {
    if (specializations.includes(tag)) return;
    setSpecializations([...specializations, tag]);
  };

  const removeSpecialty = (specialty) => {
    const updated = [];
    for (let i = 0; i < specializations.length; i++) {
      if (specializations[i] !== specialty) {
        updated.push(specializations[i]);
      }
    }
    setSpecializations(updated);
  };

  const addEducation = (newEdu, setNewEdu) => {
    if (!newEdu) return;
    setEducation([...education, newEdu]);
    setNewEdu("");
  };

  const removeEducation = (index) => {
    const updated = [];
    for (let i = 0; i < education.length; i++) {
      if (i !== index) {
        updated.push(education[i]);
      }
    }
    setEducation(updated);
  };

  return (
    <ProfileFormContext.Provider
      value={{
        profTitle,
        setProfTitle,
        experience,
        setExperience,
        bio,
        setBio,
        specializations,
        education,
        handleBioChange,
        addSpecialty,
        addDefaultSpecialty,
        removeSpecialty,
        addEducation,
        removeEducation,
        defaultSpecialties,
      }}
    >
      {children}
    </ProfileFormContext.Provider>
  );
};

export const useProfileFormContext = () => {
  const ctx = useContext(ProfileFormContext);
  if (!ctx)
    throw new Error(
      "useProfileFormContext must be used inside ProfileFormProvider"
    );
  return ctx;
};