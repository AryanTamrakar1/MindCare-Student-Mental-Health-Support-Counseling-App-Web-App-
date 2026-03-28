import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import StudentSidebar from "../components/Sidebars/StudentSidebar";
import Navbar from "../components/Navbar";
import ResourceCard from "../components/resourceLibrary/ResourceCard";
import ResourceFilter from "../components/resourceLibrary/ResourceFilter";
import SmartResourceCard from "../components/recommendations/SmartResourceCard";
import { ResourceLibraryProvider } from "../context/resourceLibrary/ResourceLibraryContext";
import { ResourceFilterProvider } from "../context/resourceLibrary/ResourceFilterContext";
import { ResourceCardProvider } from "../context/resourceLibrary/ResourceCardContext";
import { useResourceLibrary } from "../hooks/resourceLibrary/useResourceLibrary";
import { useResourceFilter } from "../hooks/resourceLibrary/useResourceFilter";

const CARDS_PER_PAGE = 9;

const ResourceLibraryInner = () => {
  const { user } = useContext(AuthContext);
  const {
    resources,
    currentPage,
    setCurrentPage,
    handleReactionUpdate,
    handleBookmarkUpdate,
  } = useResourceLibrary();
  const {
    searchApplied,
    typeApplied,
    categoryApplied,
    sortApplied,
    counselorApplied,
    activeTabApplied,
  } = useResourceFilter();

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

    if (sortApplied === "A-Z") {
      for (let i = 0; i < filtered.length - 1; i++) {
        for (let j = 0; j < filtered.length - 1 - i; j++) {
          if (
            filtered[j].title.toLowerCase() >
            filtered[j + 1].title.toLowerCase()
          ) {
            const temp = filtered[j];
            filtered[j] = filtered[j + 1];
            filtered[j + 1] = temp;
          }
        }
      }
    }

    if (sortApplied === "Z-A") {
      for (let i = 0; i < filtered.length - 1; i++) {
        for (let j = 0; j < filtered.length - 1 - i; j++) {
          if (
            filtered[j].title.toLowerCase() <
            filtered[j + 1].title.toLowerCase()
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

  if (!user) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-[#EFF6FF]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <StudentSidebar user={user} />
      <Navbar />

      <main className="ml-[260px] pt-[72px] overflow-y-auto">
        <div className="p-8 flex flex-col gap-6">
          <div style={{ border: "1px solid #E5E7EB", background: "#fff" }}>
            <div
              style={{
                padding: "12px 20px",
                borderBottom: "1px solid #E5E7EB",
                background: "#f9fafb",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#111827",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: 0,
                }}
              >
                Recommended For You
              </p>
            </div>
            <div style={{ padding: "20px" }}>
              <SmartResourceCard />
            </div>
          </div>

          <ResourceFilter />

          {filteredResources.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                background: "#fff",
                border: "2px dashed #E5E7EB",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#9CA3AF",
                }}
              >
                No resources found.
              </p>
            </div>
          )}

          {filteredResources.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                    paddingBottom: "16px",
                  }}
                >
                  <button
                    onClick={function () {
                      setCurrentPage(currentPage - 1);
                    }}
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      background: "#fff",
                      border: "1px solid #E5E7EB",
                      cursor: "pointer",
                      opacity: currentPage === 1 ? 0.4 : 1,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Prev
                  </button>

                  {pageNumbers.map(function (page) {
                    return (
                      <button
                        key={page}
                        onClick={function () {
                          setCurrentPage(page);
                        }}
                        style={{
                          width: "36px",
                          height: "36px",
                          fontSize: "14px",
                          fontWeight: "600",
                          background: currentPage === page ? "#2563EB" : "#fff",
                          color: currentPage === page ? "#fff" : "#374151",
                          border:
                            currentPage === page
                              ? "1px solid #2563EB"
                              : "1px solid #E5E7EB",
                          cursor: "pointer",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
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
                    style={{
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      background: "#fff",
                      border: "1px solid #E5E7EB",
                      cursor: "pointer",
                      opacity: currentPage === totalPages ? 0.4 : 1,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const ResourceLibrary = () => {
  return (
    <ResourceLibraryProvider>
      <ResourceFilterProvider>
        <ResourceCardProvider>
          <ResourceLibraryInner />
        </ResourceCardProvider>
      </ResourceFilterProvider>
    </ResourceLibraryProvider>
  );
};

export default ResourceLibrary;