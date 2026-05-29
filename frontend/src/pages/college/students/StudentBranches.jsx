import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Loader2, GitBranch, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const StudentBranches = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add Branch Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await api.get("/branches");
      const data = response.data?.data || response.data;
      setBranches(data || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error(error.response?.data?.message || "Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      toast.error("Branch name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/branches", { name: newBranchName });
      toast.success("Branch added successfully!");
      setNewBranchName("");
      setIsModalOpen(false);
      fetchBranches(); // Refetch to show the new branch
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add branch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Student Management</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage your college branches and students. Select a branch to view its students.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          <Plus size={18} /> Add Branch
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading branches...</p>
        </div>
      ) : branches.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400">
            <GitBranch size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No branches added yet</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Start by adding academic branches (like CSE, IT, Mechanical) to organize your students.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            <Plus size={16} /> Create First Branch
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <div
              key={branch._id}
              onClick={() => navigate(`/college/dashboard/students/${branch._id}`)}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-500/50 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900 dark:hover:border-blue-500/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400">
                  <GitBranch size={24} />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-slate-800 dark:text-slate-500 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400">
                  <ChevronRight size={18} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{branch.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Users size={16} />
                  <span>{branch.totalStudents} Students enrolled</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm dark:bg-slate-900/80">
          <div className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-[24px] bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Branch</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddBranch} className="mt-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Branch Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science (CSE)"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Save Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentBranches;
