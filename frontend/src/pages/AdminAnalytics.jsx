import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import OverviewCards from "../components/analytics/OverviewCards";
import SessionChart from "../components/analytics/SessionChart";
import MoodChart from "../components/analytics/MoodChart";
import ForumChart from "../components/analytics/ForumChart";
import CounselorTable from "../components/analytics/CounselorTable";
import { Download } from "lucide-react";

const AdminAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [overview, setOverview] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [forumData, setForumData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const overviewRes = await API.get("/analytics/overview", { headers });
      const sessionRes = await API.get("/analytics/sessions", { headers });
      const userRes = await API.get("/analytics/users", { headers });
      const forumRes = await API.get("/analytics/forum", { headers });

      setOverview(overviewRes.data);
      setSessionData(sessionRes.data);
      setUserData(userRes.data);
      setForumData(forumRes.data);
    } catch (error) {
      console.log("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const token = sessionStorage.getItem("token");
    window.open(
      `http://127.0.0.1:5050/api/analytics/report/download?format=pdf&token=${token}`,
      "_blank",
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex">
        <AdminSidebar user={user} />
        <main className="flex-1 ml-[280px] p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Loading Analytics...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      <AdminSidebar user={user} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-200 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Platform Analytics
            </h2>
            <p className="text-gray-500">
              Overview of platform activity and performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-700 transition"
            >
              <Download size={14} />
              DOWNLOAD PDF
            </button>
            <Navbar />
          </div>
        </div>

        {overview && <OverviewCards data={overview} />}

        <div className="flex gap-6 mb-6 items-stretch">
          <div className="flex-1">
            {sessionData && (
              <SessionChart
                monthlyData={sessionData.monthlyData}
                statusBreakdown={sessionData.statusBreakdown}
              />
            )}
          </div>
          <div className="flex-1">
            {userData && <MoodChart moodBreakdown={userData.moodBreakdown} />}
          </div>
        </div>

        <div className="flex gap-6 items-stretch">
          <div className="flex-1">
            {forumData && (
              <ForumChart
                topicData={forumData.topicData}
                totalPosts={forumData.totalPosts}
                totalReplies={forumData.totalReplies}
              />
            )}
          </div>
          <div className="flex-1">
            {userData && (
              <CounselorTable counselorStats={userData.counselorStats} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
