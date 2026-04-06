import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import AddResourceModal from "../components/adminResourceLibrary/AddResourceModal";
import EditResourceModal from "../components/adminResourceLibrary/EditResourceModal";
import Pagination from "../components/adminResourceLibrary/Pagination";
import {
  Plus,
  Pencil,
  Trash2,
  BadgeCheck,
  BookOpen,
  Video,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { ResourceLibraryProvider } from "../context/adminResourceLibrary/adminResourceLibraryContext";
import { useadminResourceLibrary } from "../hooks/adminResourceLibrary/useadminResourceLibrary";

const AdminResourceLibraryInner = () => {
  const { user } = useContext(AuthContext);
  const {
    resources,
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
    currentRows,
    ROWS_PER_PAGE,
  } = useadminResourceLibrary();

  if (!user) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: "#EFF4FB",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <Navbar />
      <AdminSidebar user={user} />

      <main
        className="flex-1 ml-[260px] overflow-y-auto"
        style={{ paddingTop: "calc(72px + 1rem)" }}
      >
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {[
              {
                label: "Total Resources",
                value: resources.length,
                color: "#111827",
              },
              {
                label: "Counselor Recommended",
                value: priorityCount,
                color: "#059669",
              },
              {
                label: "Total Student Reactions",
                value: totalReactions,
                color: "#2563EB",
              },
            ].map(function (stat) {
              return (
                <div
                  key={stat.label}
                  className="bg-white border border-[#E5E9F2] px-6 py-5"
                >
                  <p className="text-[13px] font-medium text-[#6B7280] mb-1">
                    {stat.label}
                  </p>
                  <p
                    className="text-[32px] font-bold leading-none"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-[#E5E9F2] overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#E5E9F2]">
              <p className="text-[17px] font-bold text-[#0F172A]">
                All Resources
              </p>
              <button
                onClick={function () {
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white text-[13px] font-semibold hover:bg-[#1D4ED8] transition-colors"
              >
                <Plus size={15} strokeWidth={2.5} />
                Add Resource
              </button>
            </div>

            {resources.length === 0 && (
              <div className="py-32 flex items-center justify-center">
                <p className="text-[15px] font-medium text-[#9CA3AF]">
                  No resources yet. Click "Add Resource" to get started.
                </p>
              </div>
            )}

            {resources.length > 0 && (
              <>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-b border-[#E5E9F2]">
                      {[
                        "Title",
                        "Category",
                        "Type",
                        "Est. Time",
                        "Reactions",
                        "Priority",
                        "Actions",
                      ].map(function (h, idx, arr) {
                        return (
                          <th
                            key={h}
                            className={`px-6 py-3.5 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-widest ${
                              idx < arr.length - 1
                                ? "border-r border-[#E5E9F2]"
                                : ""
                            }`}
                          >
                            {h}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.map(function (resource) {
                      let typeIcon = null;
                      if (resource.type === "Video") {
                        typeIcon = <Video size={11} strokeWidth={2} />;
                      } else {
                        typeIcon = <BookOpen size={11} strokeWidth={2} />;
                      }

                      let priorityBadge = null;
                      if (resource.isPriority === true) {
                        priorityBadge = (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 w-fit">
                            <BadgeCheck size={11} />
                            Yes
                          </span>
                        );
                      } else {
                        priorityBadge = (
                          <span className="text-[12px] font-medium text-[#9CA3AF]">
                            No
                          </span>
                        );
                      }

                      return (
                        <tr
                          key={resource._id}
                          className="border-b border-[#F1F1F1] last:border-b-0 hover:bg-[#FAFBFE] transition-colors"
                        >
                          <td className="px-6 py-4 max-w-[200px] border-r border-[#E5E9F2]">
                            <p className="text-[14px] font-semibold text-[#111827] truncate">
                              {resource.title}
                            </p>
                          </td>
                          <td className="px-6 py-4 border-r border-[#E5E9F2]">
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-1 ${getCategoryColor(
                                resource.category,
                              )}`}
                            >
                              {resource.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-r border-[#E5E9F2]">
                            <div
                              className={`flex items-center gap-1 text-[11px] font-semibold w-fit px-2.5 py-1 ${getTypeClass(
                                resource.type,
                              )}`}
                            >
                              {typeIcon}
                              {resource.type}
                            </div>
                          </td>
                          <td className="px-6 py-4 border-r border-[#E5E9F2]">
                            {resource.type === "Video" ? (
                              <p className="text-[13px] font-medium text-[#6B7280]">
                                {resource.estimatedTime}
                              </p>
                            ) : (
                              <span className="text-[12px] font-medium text-[#9CA3AF]">
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 border-r border-[#E5E9F2]">
                            <div className="flex items-center gap-3 text-[12px] font-semibold text-[#6B7280]">
                              <span className="flex items-center gap-1">
                                <ThumbsUp
                                  size={12}
                                  className="text-[#9CA3AF]"
                                />
                                {resource.helpfulCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsDown
                                  size={12}
                                  className="text-[#9CA3AF]"
                                />
                                {resource.notHelpfulCount}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 border-r border-[#E5E9F2]">
                            {priorityBadge}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={function () {
                                  setSelectedResource(resource);
                                  setShowEditModal(true);
                                }}
                                className="p-2 bg-[#EEF2FF] text-[#2563EB] hover:bg-[#DBEAFE] transition-colors"
                              >
                                <Pencil size={13} strokeWidth={2} />
                              </button>
                              <button
                                onClick={function () {
                                  handleDelete(resource._id);
                                }}
                                className="p-2 bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FECACA] transition-colors"
                              >
                                <Trash2 size={13} strokeWidth={2} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={resources.length}
                    itemsPerPage={ROWS_PER_PAGE}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {showAddModal === true && (
        <AddResourceModal
          onClose={function () {
            setShowAddModal(false);
          }}
          onResourceAdded={handleResourceAdded}
        />
      )}

      {showEditModal === true && selectedResource !== null && (
        <EditResourceModal
          resource={selectedResource}
          onClose={function () {
            setShowEditModal(false);
            setSelectedResource(null);
          }}
          onResourceUpdated={handleResourceUpdated}
        />
      )}
    </div>
  );
};

const AdminResourceLibrary = () => {
  return (
    <ResourceLibraryProvider>
      <AdminResourceLibraryInner />
    </ResourceLibraryProvider>
  );
};

export default AdminResourceLibrary;