import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Search, FileText, CheckCircle2, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const DriveApplications = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [drive, setDrive] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showRejected, setShowRejected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const limit = 25; // As per requirements

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/applications/drive/${driveId}?page=${page}&limit=${limit}&showRejected=${showRejected}`);
      const data = response.data?.data || response.data;
      
      setApplications(data.applications || []);
      setTotalPages(data.totalPages || 1);
      setTotalApplications(data.totalApplications || 0);
      
      if (data.drive) {
        setDrive(data.drive);
      } else if (data.applications?.length > 0 && data.applications[0].drive) {
        setDrive(data.applications[0].drive);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to load applications for this drive.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [driveId, page, showRejected]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await api.post(`/applications/drive/${driveId}/workflow`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(response.data.message || "Workflow advanced successfully");
      setShowModal(false);
      setFile(null);
      setPage(1);
      fetchApplications();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const workflowStages = ["shortlisting", "interview", "selection", "completed"];
  
  const getStageIndex = (stage) => {
    const idx = workflowStages.indexOf(stage);
    return idx === -1 ? 0 : idx;
  };
  
  const currentStageIndex = getStageIndex(drive?.applicationWorkflowStage || "shortlisting");

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(`/college/dashboard/placement-drives/${driveId}`)}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back to Drive Details
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Drive Applications
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              {drive ? `${drive.companyName} - ${drive.role}` : "Loading drive details..."}
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setShowRejected(!showRejected)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${showRejected ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-white/[0.06] bg-white/[0.04] text-neutral-400 hover:bg-white/[0.06]'}`}
            >
              {showRejected ? "Hide Rejected" : "Show Rejected"}
            </button>
            <div className="flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-indigo-400">
              <FileText size={18} />
              <span className="font-semibold">{totalApplications} Applications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Section */}
      {drive && (
        <div className="mb-8 rounded-2xl border border-indigo-500/10 bg-indigo-500/5 p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">Workflow Stage</h2>
            <p className="text-sm text-neutral-400">Advance the drive through placement stages sequentially.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflowStages.map((stage, index) => {
              const isPast = index < currentStageIndex;
              const isActive = index === currentStageIndex;
              const isFuture = index > currentStageIndex;
              const isCompleted = stage === "completed" && isActive;
              
              let btnClass = "";
              let statusIcon = null;

              if (isPast || isCompleted) {
                btnClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-default opacity-80";
                statusIcon = <CheckCircle2 size={16} />;
              } else if (isActive) {
                btnClass = "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-lg shadow-indigo-500/25 cursor-pointer";
              } else {
                btnClass = "bg-white/[0.02] text-neutral-500 border-white/[0.06] cursor-not-allowed";
              }

              const formatStage = (s) => s === "shortlisting" ? "Shortlist" : s === "interview" ? "Interview Schedule" : s === "selection" ? "Selection" : "Completed";

              return (
                <button
                  key={stage}
                  onClick={() => isActive && stage !== "completed" && setShowModal(true)}
                  disabled={!isActive || stage === "completed"}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 font-semibold transition-all ${btnClass}`}
                >
                  <span className="capitalize">{formatStage(stage)}</span>
                  {statusIcon}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
        <div className="overflow-x-auto p-4">
          {loading ? (
            <div className="flex h-[40vh] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-800 border-t-indigo-500" />
            </div>
          ) : applications.length === 0 ? (
            <div className="flex h-[40vh] flex-col items-center justify-center text-neutral-500">
              <Search size={48} className="mb-4 opacity-20" />
              <p>No applications found for this drive.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-neutral-400">
              <thead className="bg-white/[0.04] text-xs uppercase text-neutral-400 rounded-t-xl">
                <tr>
                  <th className="px-6 py-4 font-semibold">Student Name</th>
                  <th className="px-6 py-4 font-semibold">Roll Number</th>
                  <th className="px-6 py-4 font-semibold">Branch</th>
                  <th className="px-6 py-4 font-semibold">CGPA</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Applied Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {applications.map((app) => (
                  <tr key={app._id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigate(`/college/dashboard/student-profile/${app.student._id}`)}
                        className="font-medium text-white hover:text-indigo-400 hover:underline"
                      >
                        {app.student.fullName}
                      </button>
                    </td>
                    <td className="px-6 py-4">{app.student.rollNo}</td>
                    <td className="px-6 py-4">{app.student.branch}</td>
                    <td className="px-6 py-4 font-medium text-neutral-300">{app.student.cgpa}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        app.status === 'Applied' ? 'bg-white/[0.06] text-neutral-300' :
                        app.status === 'Selected' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        app.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/college/dashboard/applications/${app._id}`)}
                        className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline text-sm"
                      >
                        View Application →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Controls */}
        {!loading && applications.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
            <span className="text-sm text-neutral-500">
              Showing <span className="font-semibold text-white">{(page - 1) * limit + 1}</span> to <span className="font-semibold text-white">{Math.min(page * limit, totalApplications)}</span> of <span className="font-semibold text-white">{totalApplications}</span> Entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-neutral-400 transition-colors hover:bg-white/[0.06] disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              {/* Simple page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                // Show at most 5 pages around current
                .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                .map((p, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== p - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${p}`}>
                        <span className="flex h-9 w-9 items-center justify-center text-neutral-500">...</span>
                        <button
                          onClick={() => setPage(p)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                            page === p
                              ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
                              : "border border-white/[0.06] bg-white/[0.04] text-neutral-300 hover:bg-white/[0.06]"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                        page === p
                          ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border border-transparent"
                          : "border border-white/[0.06] bg-white/[0.04] text-neutral-300 hover:bg-white/[0.06]"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })
              }

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] text-neutral-400 transition-colors hover:bg-white/[0.06] disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#12121e] p-6 sm:p-8 shadow-2xl shadow-black/40">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Upload Candidates</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-neutral-500 hover:bg-white/[0.06] hover:text-neutral-300 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6 rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-4 text-sm text-indigo-300/80">
              Upload an Excel or CSV file containing a column for <strong className="text-indigo-300">Roll Number</strong>. All matching students will be moved to the next stage.
            </div>

            <form onSubmit={handleUpload}>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-neutral-300">
                  Select File (.xlsx, .csv)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".xlsx, .csv"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 text-sm text-neutral-300 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-500/10 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-indigo-400"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.04] py-3 font-semibold text-neutral-400 hover:bg-white/[0.06] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-70 transition"
                >
                  {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveApplications;
