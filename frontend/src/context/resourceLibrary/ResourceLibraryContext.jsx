import { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";

const ResourceLibraryContext = createContext(null);

export const ResourceLibraryProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(function () {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await API.get("/resources", {
        headers: { Authorization: "Bearer " + token },
      });
      setResources(response.data);
    } catch (error) {
      console.log("Error fetching resources:", error);
    }
  };

  const handleReactionUpdate = (resourceId, updatedReactions) => {
    const updatedResources = [];
    for (let i = 0; i < resources.length; i++) {
      if (resources[i]._id === resourceId) {
        let helpfulCount = 0;
        let notHelpfulCount = 0;
        for (let j = 0; j < updatedReactions.length; j++) {
          if (updatedReactions[j].reaction === "helpful") {
            helpfulCount = helpfulCount + 1;
          } else {
            notHelpfulCount = notHelpfulCount + 1;
          }
        }
        updatedResources.push({
          ...resources[i],
          reactions: updatedReactions,
          helpfulCount: helpfulCount,
          notHelpfulCount: notHelpfulCount,
        });
      } else {
        updatedResources.push(resources[i]);
      }
    }
    setResources(updatedResources);
  };

  const handleBookmarkUpdate = (resourceId, updatedBookmarks) => {
    const updatedResources = [];
    for (let i = 0; i < resources.length; i++) {
      if (resources[i]._id === resourceId) {
        updatedResources.push({
          ...resources[i],
          bookmarks: updatedBookmarks,
          bookmarkCount: updatedBookmarks.length,
        });
      } else {
        updatedResources.push(resources[i]);
      }
    }
    setResources(updatedResources);
  };

  return (
    <ResourceLibraryContext.Provider
      value={{
        resources,
        currentPage,
        setCurrentPage,
        handleReactionUpdate,
        handleBookmarkUpdate,
        user,
      }}
    >
      {children}
    </ResourceLibraryContext.Provider>
  );
};

export const useResourceLibraryContext = () => {
  const ctx = useContext(ResourceLibraryContext);
  if (!ctx)
    throw new Error(
      "useResourceLibraryContext must be used inside ResourceLibraryProvider"
    );
  return ctx;
};