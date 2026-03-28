import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const AdminAnalyticsContext = createContext(null);

export const AdminAnalyticsProvider = ({ children }) => {
  const [overview, setOverview] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [forumData, setForumData] = useState(null);

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
    }
  };

  const handleDownload = () => {
    const token = sessionStorage.getItem("token");
    const baseURL = API.defaults.baseURL;
    window.open(
      `${baseURL}/analytics/report/download?format=pdf&token=${token}`,
      "_blank"
    );
  };

  return (
    <AdminAnalyticsContext.Provider
      value={{
        overview,
        sessionData,
        userData,
        forumData,
        handleDownload,
      }}
    >
      {children}
    </AdminAnalyticsContext.Provider>
  );
};

export const useAdminAnalyticsContext = () => {
  const ctx = useContext(AdminAnalyticsContext);
  if (!ctx)
    throw new Error(
      "useAdminAnalyticsContext must be used inside AdminAnalyticsProvider"
    );
  return ctx;
};