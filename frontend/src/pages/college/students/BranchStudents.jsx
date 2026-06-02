import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Users, Plus, Loader2, Search, Filter, 
  ChevronLeft, ChevronRight, User, ArrowLeft 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../../../api/axios";

const BranchStudents = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Pagination & Data State
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // Add Student Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    rollNo: "",
    email: "",
    password: "",
    phone: "",
    cgpa: "",
    passingYear: new Date().getFullYear(),
    semester: 1
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/branches/${branchId}/students?page=${page}&limit=${limit}`);
      const data = response.data?.data || response.data;
      
      setStudents(data.students || []);
      setTotalPages(data.totalPages || 1);
      setTotalStudents(data.totalStudents || 0);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error(error.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, branchId, user?.activePlacementSeason]);

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post(`/branches/${branchId}/students`, formData);
      toast.success("Student added successfully!");
      setIsModalOpen(false);
      setFormData({
        fullName: "",
        rollNo: "",
        email: "",
        password: "",
        phone: "",
        cgpa: "",
        passingYear: new Date().getFullYear(),
        semester: 1
      });
      fetchStudents(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "placed":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "internship":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      default: // unplaced
        return "bg-white/[0.06] text-neutral-400";
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <button 
            onClick={() => navigate("/college/dashboard/students")}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white"
          >
            <ArrowLeft size={16} /> Back to Branches
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Branch Students</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Total Enrolled: {totalStudents}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 md:w-[200px]"
            />
          </div>
          <button className="flex h-[42px] items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 text-sm font-semibold text-neutral-300 transition hover:bg-white/[0.06]">
            <Filter size={16} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-xl hover:shadow-indigo-500/30"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-800 border-t-indigo-500" />
            <p className="text-sm font-medium text-neutral-500">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
              <Users size={32} />
            </div>
            <p className="text-lg font-semibold text-white">No students found</p>
            <p className="text-sm text-neutral-500">Add the first student to this branch.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/[0.06] bg-white/[0.04] text-neutral-400">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Student Name</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Roll No</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">CGPA</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Status</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {students.map((student) => (
                  <tr key={student._id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{student.fullName}</p>
                          <p className="text-xs text-neutral-500">{student.email || "No email provided"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-300 font-medium">
                      {student.rollNo}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">{student.cgpa || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${getStatusColor(student.placementStatus)}`}>
                        {student.placementStatus || "unplaced"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/college/dashboard/student-profile/${student._id}`)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-indigo-400 transition hover:bg-indigo-500/10"
                      >
                        View Details <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && students.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
            <p className="text-sm text-neutral-500">
              Showing page <span className="font-medium text-white">{page}</span> of <span className="font-medium text-white">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-sm font-semibold text-neutral-300 transition hover:bg-white/[0.06] disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-sm font-semibold text-neutral-300 transition hover:bg-white/[0.06] disabled:pointer-events-none disabled:opacity-50"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-white/[0.08] bg-[#12121e] p-6 shadow-2xl shadow-black/40 my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add New Student</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-neutral-500 transition hover:bg-white/[0.06] hover:text-neutral-300"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-400">Full Name *</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-indigo-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-400">Roll Number *</label>
                <input type="text" name="rollNo" required value={formData.rollNo} onChange={handleInputChange} className="w-full rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-indigo-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-400">Password *</label>
                <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleInputChange} className="w-full rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-indigo-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-400">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-indigo-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-400">CGPA</label>
                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleInputChange} className="w-full rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-indigo-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-400">Passing Year</label>
                <input type="number" name="passingYear" required value={formData.passingYear} onChange={handleInputChange} className="w-full rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-indigo-500/50 focus:outline-none" />
              </div>
              <div className="md:col-span-2 mt-4 flex justify-end gap-3 border-t border-white/[0.06] pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-neutral-400 transition hover:bg-white/[0.04]">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Save Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchStudents;
