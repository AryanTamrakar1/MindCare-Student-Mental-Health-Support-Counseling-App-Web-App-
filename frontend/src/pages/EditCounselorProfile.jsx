import React from "react";
import CounselorSidebar from "../components/Sidebars/CounselorSidebar";
import Navbar from "../components/Navbar";
import ProfileForm from "../components/counselorProfile/ProfileForm";
import AvailabilitySection from "../components/counselorProfile/AvailabilitySection";
import ProfilePreview from "../components/counselorProfile/ProfilePreview";
import { EditCounselorProfileProvider } from "../context/editCounselorProfile/EditCounselorProfileContext";
import { ProfileFormProvider } from "../context/editCounselorProfile/ProfileFormContext";
import { useEditCounselorProfile } from "../hooks/editCounselorProfile/useEditCounselorProfile";

const EditCounselorProfileInner = () => {
  const {
    user,
    availability,
    setAvailability,
    selectedTime,
    setSelectedTime,
    handleUpdate,
    userInitial,
    userName,
    previewProfTitle,
    previewExperience,
    previewBio,
    previewSpecializations,
    previewEducation,
    previewAvailability,
  } = useEditCounselorProfile();

  if (!user) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "#EEF4FF",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <CounselorSidebar user={user} />
      <Navbar />

      <main className="flex-1 ml-[260px] pt-[88px] pb-8 px-8 overflow-x-hidden">
        <div className="flex flex-col gap-6">
          <div
            className="grid gap-6 items-start"
            style={{ gridTemplateColumns: "3fr 2fr" }}
          >
            <ProfileFormProvider>
              <ProfileForm />
            </ProfileFormProvider>

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

const EditCounselorProfile = () => {
  return (
    <EditCounselorProfileProvider>
      <EditCounselorProfileInner />
    </EditCounselorProfileProvider>
  );
};

export default EditCounselorProfile;
