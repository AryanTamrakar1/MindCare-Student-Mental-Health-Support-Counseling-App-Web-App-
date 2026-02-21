const defaultSpecialties = [
  "Stress & Anxiety",
  "Academic Pressure",
  "Depression",
  "Relationship Issues",
  "Self-Esteem",
  "Career Guidance",
];

const ProfileForm = ({
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
  newSpecialty,
  setNewSpecialty,
  newEdu,
  setNewEdu,
}) => {

  const handleBioChange = (e) => {
    setBio(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const addSpecialty = () => {
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
    setSpecializations(specializations.filter((s) => s !== specialty));
  };

  const addEducation = () => {
    if (!newEdu) return;
    setEducation([...education, newEdu]);
    setNewEdu("");
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  return (
    <div className="col-span-7 flex flex-col gap-6">
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              Professional Title
            </label>
            <input
              type="text"
              value={profTitle}
              onChange={(e) => setProfTitle(e.target.value)}
              placeholder="e.g., Clinical Psychologist"
              className="p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase">
              Years of Experience
            </label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold outline-none focus:bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase">
            About Me (Bio)
          </label>
          <textarea
            value={bio}
            onChange={handleBioChange}
            placeholder="Write a brief description about yourself..."
            className="p-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-normal outline-none focus:bg-white resize-none"
            style={{ minHeight: "120px" }}
          />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[260px] overflow-hidden flex flex-col">
          <label className="block text-xs font-black text-indigo-600 mb-3 uppercase">
            Specializations
          </label>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {defaultSpecialties.map((tag) => (
              <button
                key={tag}
                onClick={() => addDefaultSpecialty(tag)}
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
              placeholder="Add custom specialty..."
              className="flex-1 p-3 rounded-xl border border-gray-100 bg-gray-50 text-xs font-bold"
            />
            <button
              onClick={addSpecialty}
              className="bg-indigo-600 text-white px-4 rounded-xl font-black"
            >
              +
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 flex flex-wrap gap-2">
            {specializations.map((s) => (
              <span
                key={s}
                className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black border border-indigo-100 flex items-center gap-2 h-fit"
              >
                {s}
                <button
                  onClick={() => removeSpecialty(s)}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[260px] overflow-hidden flex flex-col">
          <label className="block text-xs font-black text-indigo-600 mb-3 uppercase">
            Education
          </label>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newEdu}
              onChange={(e) => setNewEdu(e.target.value)}
              placeholder="e.g., PhD in Psychology"
              className="flex-1 p-3 rounded-xl border border-gray-100 bg-gray-50 text-xs font-bold"
            />
            <button
              onClick={addEducation}
              className="bg-indigo-600 text-white px-4 rounded-xl font-black"
            >
              +
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {education.map((e, i) => (
              <div
                key={i}
                className="bg-gray-50 p-3 rounded-xl text-[10px] font-black border border-gray-100 flex justify-between items-center shadow-sm"
              >
                <span className="truncate mr-2">{e}</span>
                <button
                  onClick={() => removeEducation(i)}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileForm;