import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import ResourceCard from "../components/resourceLibrary/ResourceCard";
import ResourceFilter from "../components/resourceLibrary/ResourceFilter";
import API from "../api/axios";

const CARDS_PER_PAGE = 6;

const ResourceLibrary = () => {
  const { user } = useContext(AuthContext);

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [activeTab, setActiveTab] = useState("all");
  const [activeTabApplied, setActiveTabApplied] = useState("all");

  const [searchDraft, setSearchDraft] = useState("");
  const [typeDraft, setTypeDraft] = useState("All");
  const [categoryDraft, setCategoryDraft] = useState("All");
  const [sortDraft, setSortDraft] = useState("None");
  const [counselorDraft, setCounselorDraft] = useState(false);

  const [searchApplied, setSearchApplied] = useState("");
  const [typeApplied, setTypeApplied] = useState("All");
  const [categoryApplied, setCategoryApplied] = useState("All");
  const [sortApplied, setSortApplied] = useState("None");
  const [counselorApplied, setCounselorApplied] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  function handleSearch() {
    setSearchApplied(searchDraft);
    setCurrentPage(1);
  }

  function handleClearSearch() {
    setSearchDraft("");
    setSearchApplied("");
    setCurrentPage(1);
  }

  function handleApplyFilter() {
    setTypeApplied(typeDraft);
    setCategoryApplied(categoryDraft);
    setSortApplied(sortDraft);
    setCounselorApplied(counselorDraft);
    setActiveTabApplied(activeTab);
    setCurrentPage(1);
  }

  function handleClearFilter() {
    setTypeDraft("All");
    setCategoryDraft("All");
    setSortDraft("None");
    setCounselorDraft(false);
    setTypeApplied("All");
    setCategoryApplied("All");
    setSortApplied("None");
    setCounselorApplied(false);
    setSearchDraft("");
    setSearchApplied("");
    setActiveTab("all");
    setActiveTabApplied("all");
    setCurrentPage(1);
  }

  function handleReactionUpdate(resourceId, updatedReactions) {
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
  }

  function handleBookmarkUpdate(resourceId, updatedBookmarks) {
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
  }

  function getFilteredResources() {
    const filtered = [];
    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];

      if (activeTabApplied === "bookmarked") {
        let isBookmarked = false;
        for (let j = 0; j < resource.bookmarks.length; j++) {
          if (resource.bookmarks[j] === user._id) {
            isBookmarked = true;
            break;
          }
        }
        if (isBookmarked === false) continue;
      }

      if (searchApplied !== "") {
        const titleLower = resource.title.toLowerCase();
        const searchLower = searchApplied.toLowerCase();
        if (titleLower.includes(searchLower) === false) continue;
      }

      if (categoryApplied !== "All" && resource.category !== categoryApplied)
        continue;
      if (typeApplied !== "All" && resource.type !== typeApplied) continue;
      if (counselorApplied === true && resource.isPriority !== true) continue;

      filtered.push(resource);
    }

    if (sortApplied === "Most Liked") {
      for (let i = 0; i < filtered.length - 1; i++) {
        for (let j = 0; j < filtered.length - 1 - i; j++) {
          if (filtered[j].helpfulCount < filtered[j + 1].helpfulCount) {
            const temp = filtered[j];
            filtered[j] = filtered[j + 1];
            filtered[j + 1] = temp;
          }
        }
      }
    }

    if (sortApplied === "Least Liked") {
      for (let i = 0; i < filtered.length - 1; i++) {
        for (let j = 0; j < filtered.length - 1 - i; j++) {
          if (filtered[j].helpfulCount > filtered[j + 1].helpfulCount) {
            const temp = filtered[j];
            filtered[j] = filtered[j + 1];
            filtered[j + 1] = temp;
          }
        }
      }
    }

    if (sortApplied === "Newest") {
      for (let i = 0; i < filtered.length - 1; i++) {
        for (let j = 0; j < filtered.length - 1 - i; j++) {
          if (
            new Date(filtered[j].createdAt) <
            new Date(filtered[j + 1].createdAt)
          ) {
            const temp = filtered[j];
            filtered[j] = filtered[j + 1];
            filtered[j + 1] = temp;
          }
        }
      }
    }

    if (sortApplied === "Oldest") {
      for (let i = 0; i < filtered.length - 1; i++) {
        for (let j = 0; j < filtered.length - 1 - i; j++) {
          if (
            new Date(filtered[j].createdAt) >
            new Date(filtered[j + 1].createdAt)
          ) {
            const temp = filtered[j];
            filtered[j] = filtered[j + 1];
            filtered[j + 1] = temp;
          }
        }
      }
    }

    return filtered;
  }

  const filteredResources = getFilteredResources();
  const totalPages = Math.ceil(filteredResources.length / CARDS_PER_PAGE);
  const currentCards = [];
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  for (let i = startIndex; i < endIndex; i++) {
    if (i < filteredResources.length) {
      currentCards.push(filteredResources[i]);
    }
  }

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex">
        <StudentSidebar user={user} />
        <main className="flex-1 ml-[280px] p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
            Loading Resources...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      <StudentSidebar user={user} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-200 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Resource Library
            </h2>
            <p className="text-gray-500">
              Browse mental health resources curated for Nepali students.
            </p>
          </div>
          <Navbar />
        </div>

        <ResourceFilter
          searchDraft={searchDraft}
          setSearchDraft={setSearchDraft}
          handleSearch={handleSearch}
          handleClearSearch={handleClearSearch}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counselorDraft={counselorDraft}
          setCounselorDraft={setCounselorDraft}
          typeDraft={typeDraft}
          setTypeDraft={setTypeDraft}
          categoryDraft={categoryDraft}
          setCategoryDraft={setCategoryDraft}
          sortDraft={sortDraft}
          setSortDraft={setSortDraft}
          handleApplyFilter={handleApplyFilter}
          handleClearFilter={handleClearFilter}
        />

        {filteredResources.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-lg">
              No resources found.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
              {currentCards.map(function (resource) {
                return (
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
                    currentUserId={user._id}
                    onReactionUpdate={handleReactionUpdate}
                    onBookmarkUpdate={handleBookmarkUpdate}
                  />
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 pb-4">
                <button
                  onClick={function () {
                    setCurrentPage(currentPage - 1);
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed bg-white"
                >
                  ← Prev
                </button>

                {pageNumbers.map(function (page) {
                  return (
                    <button
                      key={page}
                      onClick={function () {
                        setCurrentPage(page);
                      }}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all border ${
                        currentPage === page
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-gray-400 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={function () {
                    setCurrentPage(currentPage + 1);
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed bg-white"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ResourceLibrary;
