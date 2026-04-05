import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import OverviewCards from "../components/analytics/OverviewCards";
import SessionChart from "../components/analytics/SessionChart";
import MoodChart from "../components/analytics/MoodChart";
import ForumChart from "../components/analytics/ForumChart";
import CounselorTable from "../components/analytics/CounselorTable";
import { Download } from "lucide-react";
import { AdminAnalyticsProvider } from "../context/analytics/adminAnalyticsContext";
import { useadminAnalytics } from "../hooks/analytics/useadminAnalytics";

const AdminAnalyticsInner = () => {
  const { user } = useContext(AuthContext);
  const { overview, sessionData, userData, forumData, handleDownload } =
    useadminAnalytics();

  if (!user) {
    return null;
  }

  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="min-h-screen bg-[#EBF3FF] flex"
    >
      <Navbar />
      <AdminSidebar user={user} />
      <main className="flex-1 ml-[260px] pt-[72px] min-h-screen">
        <div className="px-8 py-8 flex flex-col gap-6">
          {overview && <OverviewCards data={overview} />}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {sessionData && (
              <SessionChart
                monthlyData={sessionData.monthlyData}
                statusBreakdown={sessionData.statusBreakdown}
              />
            )}
            {userData && <MoodChart moodBreakdown={userData.moodBreakdown} />}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {forumData && (
              <ForumChart
                topicData={forumData.topicData}
                totalPosts={forumData.totalPosts}
                totalReplies={forumData.totalReplies}
              />
            )}
            {userData && (
              <div className="flex flex-col gap-6">
                <CounselorTable counselorStats={userData.counselorStats} />
                <div className="bg-white border border-[#DBEAFE] overflow-hidden">
                  <div className="px-7 py-6">
                    <p className="text-[16px] font-semibold text-[#111827]">
                      Export Report
                    </p>
                    <p className="text-[13px] text-[#6B7280] mt-0.5">
                      Download the full platform analytics as a PDF
                    </p>
                  </div>
                  <div className="h-px w-full bg-[#F1F5F9]" />
                  <div className="px-7 py-6">
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[14px] font-semibold transition-colors"
                    >
                      <Download size={16} strokeWidth={2} />
                      Download Analytics PDF
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const AdminAnalytics = () => {
  return (
    <AdminAnalyticsProvider>
      <AdminAnalyticsInner />
    </AdminAnalyticsProvider>
  );
};

export default AdminAnalytics;
