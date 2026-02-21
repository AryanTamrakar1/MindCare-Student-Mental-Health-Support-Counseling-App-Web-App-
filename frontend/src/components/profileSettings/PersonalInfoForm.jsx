const PersonalInfoForm = ({ name, setName, email, onSave }) => {
  return (
    <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          Personal Information
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Update your personal details here
        </p>
      </div>
      <form className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="pt-4">
          <button
            type="button"
            onClick={onSave}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
};

export default PersonalInfoForm;
