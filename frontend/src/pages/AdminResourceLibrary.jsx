import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminSidebar from "../components/Sidebars/AdminSidebar";
import Navbar from "../components/Navbar";
import AddResourceModal from "../components/resourceLibrary/AddResourceModal";
import EditResourceModal from "../components/resourceLibrary/EditResourceModal";
import API from "../api/axios";
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

const ROWS_PER_PAGE = 10;

function AdminResourceLibrary() {
  const { user: currentUser } = useContext(AuthContext);

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(function () {
    fetchResources();
  }, []);

  async function fetchResources() {
    try {
      setLoading(true);
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
  }

  function handleResourceAdded(newResource) {
    setResources([newResource, ...resources]);
    setCurrentPage(1);
  }

  function handleResourceUpdated(updatedResource) {
    const updated = [];
    for (let i = 0; i < resources.length; i++) {
      if (resources[i]._id === updatedResource._id) {
        updated.push(updatedResource);
      } else {
        updated.push(resources[i]);
      }
    }
    setResources(updated);
  }

  async function handleDelete(id) {
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
      setDeleteId(null);
    } catch (error) {
      console.log("Delete error:", error);
    }
  }

  function getCategoryColor(category) {
    if (category === "General Mental Health") return "bg-sky-100 text-sky-700";
    if (category === "Exam & Academic Pressure")
      return "bg-red-100 text-red-700";
    if (category === "Skill Gap & Career Fear")
      return "bg-orange-100 text-orange-700";
    if (category === "Family Expectation Burden")
      return "bg-yellow-100 text-yellow-700";
    if (category === "Sleep & Energy") return "bg-blue-100 text-blue-700";
    if (category === "Social Isolation") return "bg-purple-100 text-purple-700";
    if (category === "Low Motivation") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  }

  function getTypeClass(type) {
    if (type === "Video") {
      return "bg-indigo-50 text-indigo-600";
    } else {
      return "bg-teal-50 text-teal-600";
    }
  }

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

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <AdminSidebar user={currentUser} />
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
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar user={currentUser} />

      <main className="flex-1 ml-[280px] p-10 overflow-y-auto">
        <div className="mb-8 border-b-2 border-slate-300 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-800">
              Resource Library
            </h2>
            <p className="text-gray-500">
              Manage mental health resources for students on the platform.
            </p>
          </div>
          <Navbar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">Total Resources</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {resources.length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              Counselor Recommended
            </p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">
              {priorityCount}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              Total Student Reactions
            </p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">
              {totalReactions}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest">
              All Resources
            </h3>
            <button
              onClick={function () {
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Plus size={16} />
              Add Resource
            </button>
          </div>

          {resources.length === 0 && (
            <div className="text-center py-20 text-gray-400 font-medium">
              No resources yet. Click "Add Resource" to get started.
            </div>
          )}

          {resources.length > 0 && (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-500 font-semibold">
                      Title
                    </th>
                    <th className="text-left px-6 py-3 text-gray-500 font-semibold">
                      Category
                    </th>
                    <th className="text-left px-6 py-3 text-gray-500 font-semibold">
                      Type
                    </th>
                    <th className="text-left px-6 py-3 text-gray-500 font-semibold">
                      Estimated Time
                    </th>
                    <th className="text-center px-6 py-3 text-gray-500 font-semibold">
                      Reactions
                    </th>
                    <th className="text-left px-6 py-3 text-gray-500 font-semibold">
                      Priority
                    </th>
                    <th className="text-left px-6 py-3 text-gray-500 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map(function (resource) {
                    let typeIcon = null;
                    if (resource.type === "Video") {
                      typeIcon = <Video size={12} />;
                    } else {
                      typeIcon = <BookOpen size={12} />;
                    }

                    let priorityBadge = null;
                    if (resource.isPriority === true) {
                      priorityBadge = (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <BadgeCheck size={14} /> Yes
                        </span>
                      );
                    } else {
                      priorityBadge = (
                        <span className="text-xs text-gray-400">No</span>
                      );
                    }

                    return (
                      <tr
                        key={resource._id}
                        className="border-b border-gray-50 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-800 max-w-[200px] truncate">
                          {resource.title}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-lg ${getCategoryColor(resource.category)}`}
                          >
                            {resource.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`flex items-center gap-1 text-xs font-semibold w-fit px-2 py-1 rounded-lg ${getTypeClass(resource.type)}`}
                          >
                            {typeIcon}
                            {resource.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {resource.estimatedTime}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3 text-gray-500 text-xs font-semibold">
                            <span className="flex items-center gap-1">
                              <ThumbsUp size={13} className="text-gray-400" />
                              {resource.helpfulCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsDown size={13} className="text-gray-400" />
                              {resource.notHelpfulCount}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{priorityBadge}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={function () {
                                setSelectedResource(resource);
                                setShowEditModal(true);
                              }}
                              className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={function () {
                                setDeleteId(resource._id);
                              }}
                              className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-5 border-t border-gray-100">
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

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Delete Resource
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this resource? This cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={function () {
                  setDeleteId(null);
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={function () {
                  handleDelete(deleteId);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminResourceLibrary;