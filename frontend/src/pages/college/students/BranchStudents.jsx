import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Users, Plus, Loader2, Search, Filter, 
  ChevronLeft, ChevronRight, User, ArrowLeft 
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const BranchStudents = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();

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
  }, [page, branchId]);

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
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "internship":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default: // unplaced
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <button 
            onClick={() => navigate("/college/dashboard/students")}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft size={16} /> Back to Branches
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Branch Students</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Total Enrolled: {totalStudents}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full rounded-xl border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-slate-800/60 dark:bg-slate-900 dark:text-white md:w-[200px]"
            />
          </div>
          <button className="flex h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
            <Filter size={16} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-[42px] items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
          >
            <Plus size={18} /> Add Student
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-900">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-500" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-800">
              <Users size={32} />
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">No students found</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Add the first student to this branch.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800/60 dark:bg-slate-800/50 dark:text-slate-300">
                <tr>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Student Name</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Roll No</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">CGPA</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold">Status</th>
                  <th className="whitespace-nowrap px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {students.map((student) => (
                  <tr key={student._id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{student.fullName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{student.email || "No email provided"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      {student.rollNo}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900 dark:text-white">{student.cgpa || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${getStatusColor(student.placementStatus)}`}>
                        {student.placementStatus || "unplaced"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/college/dashboard/student-profile/${student._id}`)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
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
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-800/60">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing page <span className="font-medium text-slate-900 dark:text-white">{page}</span> of <span className="font-medium text-slate-900 dark:text-white">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800/60 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800/60 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-8 backdrop-blur-sm dark:bg-slate-900/80 overflow-y-auto">
          <div className="w-full max-w-xl animate-in fade-in zoom-in-95 rounded-[24px] bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Student</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name *</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Roll Number *</label>
                <input type="text" name="rollNo" required value={formData.rollNo} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Password *</label>
                <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">CGPA</label>
                <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Passing Year</label>
                <input type="number" name="passingYear" required value={formData.passingYear} onChange={handleInputChange} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
              </div>
              <div className="md:col-span-2 mt-4 flex justify-end gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50">
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
