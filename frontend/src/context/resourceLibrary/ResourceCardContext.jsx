import { createContext, useContext, useState } from "react";
import API from "../../api/axios";

const ResourceCardContext = createContext(null);

export const ResourceCardProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const handleReaction = async (resourceId, reaction, onReactionUpdate) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await API.post(
        "/resources/" + resourceId + "/react",
        { reaction: reaction },
        { headers: { Authorization: "Bearer " + token } }
      );
      onReactionUpdate(resourceId, response.data.reactions);
    } catch (error) {
      console.log("Reaction error:", error);
    }
    setLoading(false);
  };

  const handleBookmark = async (resourceId, onBookmarkUpdate) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await API.post(
        "/resources/" + resourceId + "/bookmark",
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
      onBookmarkUpdate(resourceId, response.data.bookmarks);
    } catch (error) {
      console.log("Bookmark error:", error);
    }
    setLoading(false);
  };

  return (
    <ResourceCardContext.Provider
      value={{
        loading,
        handleReaction,
        handleBookmark,
      }}
    >
      {children}
    </ResourceCardContext.Provider>
  );
};

export const useResourceCardContext = () => {
  const ctx = useContext(ResourceCardContext);
  if (!ctx)
    throw new Error(
      "useResourceCardContext must be used inside ResourceCardProvider"
    );
  return ctx;
};