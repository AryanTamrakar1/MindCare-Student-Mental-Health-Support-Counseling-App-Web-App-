import { createContext, useContext, useState, useEffect } from "react";
import API from "../../api/axios";

const ResourceLibraryContext = createContext(null);

export const ResourceLibraryProvider = ({ children }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ROWS_PER_PAGE = 10;

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await API.get("/resources", {
        headers: { Authorization: "Bearer " + token },
      });
      const sortedResources = [];
      for (let i = 0; i < response.data.length; i++) {
        sortedResources.push(response.data[i]);
      }
      sortedResources.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setResources(sortedResources);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching resources:", error);
      setLoading(false);
    }
  };

  const handleResourceAdded = (newResource) => {
    setResources([newResource, ...resources]);
    setCurrentPage(1);
  };

  const handleResourceUpdated = (updatedResource) => {
    const updated = [];
    for (let i = 0; i < resources.length; i++) {
      if (resources[i]._id === updatedResource._id) {
        updated.push(updatedResource);
      } else {
        updated.push(resources[i]);
      }
    }
    setResources(updated);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this resource? This cannot be undone."
      )
    )
      return;
    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/resources/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      const updated = [];
      for (let i = 0; i < resources.length; i++) {
        if (resources[i]._id !== id) {
          updated.push(resources[i]);
        }
      }
      setResources(updated);
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  const getCategoryColor = (category) => {
    if (category === "General Mental Health")
      return "bg-sky-50 text-sky-600 border border-sky-100";
    if (category === "Exam & Academic Pressure")
      return "bg-red-50 text-red-600 border border-red-100";
    if (category === "Skill Gap & Career Fear")
      return "bg-orange-50 text-orange-600 border border-orange-100";
    if (category === "Family Expectation Burden")
      return "bg-amber-50 text-amber-600 border border-amber-100";
    if (category === "Sleep & Energy")
      return "bg-blue-50 text-blue-600 border border-blue-100";
    if (category === "Social Isolation")
      return "bg-violet-50 text-violet-600 border border-violet-100";
    if (category === "Low Motivation")
      return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    return "bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]";
  };

  const getTypeClass = (type) => {
    if (type === "Video") {
      return "bg-[#EEF2FF] text-[#2563EB] border border-[#C7D2FE]";
    } else {
      return "bg-teal-50 text-teal-600 border border-teal-100";
    }
  };

  let priorityCount = 0;
  for (let i = 0; i < resources.length; i++) {
    if (resources[i].isPriority === true) priorityCount = priorityCount + 1;
  }

  let totalReactions = 0;
  for (let i = 0; i < resources.length; i++) {
    totalReactions = totalReactions + resources[i].reactions.length;
  }

  const totalPages = Math.ceil(resources.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const currentRows = [];
  for (let i = startIndex; i < startIndex + ROWS_PER_PAGE; i++) {
    if (i < resources.length) {
      currentRows.push(resources[i]);
    }
  }
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <ResourceLibraryContext.Provider
      value={{
        resources,
        loading,
        showAddModal,
        setShowAddModal,
        selectedResource,
        setSelectedResource,
        showEditModal,
        setShowEditModal,
        currentPage,
        setCurrentPage,
        handleResourceAdded,
        handleResourceUpdated,
        handleDelete,
        getCategoryColor,
        getTypeClass,
        priorityCount,
        totalReactions,
        totalPages,
        startIndex,
        currentRows,
        pageNumbers,
        ROWS_PER_PAGE,
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