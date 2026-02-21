const AccountOverview = ({
  currentUser,
  onPhotoUpload,
  getProfilePhotoUrl,
}) => {
  return (
    <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col justify-between">
      <div>
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h3 className="text-lg font-bold text-gray-900">Account Overview</h3>
          <p className="text-sm text-gray-500 mt-1">
            View your account information and status
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-40 h-40 rounded-full relative overflow-hidden border-4 border-indigo-100">
            <img
              src={getProfilePhotoUrl()}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || "User")}&background=4f46e5&color=fff&size=200`;
              }}
            />
          </div>
          <label className="bg-gray-100 border border-gray-300 px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:bg-gray-200 transition">
            Update Photo
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onPhotoUpload}
            />
          </label>
        </div>
        <div className="w-full flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className="text-gray-500 text-base font-semibold">
              Full Name
            </span>
            <span className="text-gray-900 font-bold text-base">
              {currentUser.name}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className="text-gray-500 text-base font-semibold">
              Email Address
            </span>
            <span className="text-gray-900 font-bold text-base">
              {currentUser.email}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className="text-gray-500 text-base font-semibold">
              System Role
            </span>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
              {currentUser.role}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className="text-gray-500 text-base font-semibold">
              Member Since
            </span>
            <span className="text-gray-900 font-bold text-base">
              Dec 15, 2025
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className="text-gray-500 text-base font-semibold">
              Last Login
            </span>
            <span className="text-gray-900 font-bold text-base">
              Feb 16, 2026
            </span>
          </div>
          <div className="flex justify-between items-center pb-4">
            <span className="text-gray-500 text-base font-semibold">
              Account Status
            </span>
            <span className="text-green-600 font-bold text-base">
              ● Verified Account
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountOverview;
