import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Search, Trash2, GraduationCap } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const DUMMY_STUDENTS = [
  { _id: "s1", fullName: "Rahul Sharma", rollNo: "CSE001", branch: "Computer Science", cgpa: 8.9 },
  { _id: "s2", fullName: "Priya Patel", rollNo: "CSE045", branch: "Computer Science", cgpa: 9.2 },
  { _id: "s3", fullName: "Amit Kumar", rollNo: "CSE089", branch: "Information Technology", cgpa: 7.8 },
  { _id: "s4", fullName: "Sneha Reddy", rollNo: "CSE102", branch: "Computer Science", cgpa: 8.5 },
];

const DriveStudents = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get(`/drives/${driveId}/students`);
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          setStudents(DUMMY_STUDENTS);
        }
      } catch (error) {
        console.warn("Backend error fetching students, using dummy data:", error);
        setStudents(DUMMY_STUDENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [driveId]);

  const handleRemoveStudent = async (studentId, studentName, e) => {
    e.stopPropagation(); // Prevent navigating to student profile
    
    if (!window.confirm(`Are you sure you want to remove ${studentName} from this drive? This will permanently delete their application.`)) {
      return;
    }

    // Optimistic UI update
    const previousStudents = [...students];
    setStudents(students.filter(s => s._id !== studentId));

    try {
      await api.delete(`/drives/${driveId}/students/${studentId}`);
      toast.success(`${studentName} removed successfully`);
    } catch (error) {
      console.error("Failed to remove student:", error);
      // Revert if it fails and it's not a dummy mock action
      if (!driveId.startsWith("dummy")) {
        setStudents(previousStudents);
      } else {
        toast.success(`Dummy action: ${studentName} removed`);
      }
    }
  };

  const filteredStudents = students.filter((s) => 
    s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.branch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-800 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate(`/college/dashboard/placement-drives/${driveId}`)}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft size={16} /> Back to Drive Details
        </button>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Applied Students</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-neutral-400">Review and manage students who applied for this drive.</p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl px-6 py-4">
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-600 dark:text-neutral-500 uppercase">Total Applied</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{students.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Search by name, roll no, or branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border-none bg-slate-100 dark:bg-white/[0.04] py-3 pl-12 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-700 dark:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-neutral-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold">Roll No</th>
                <th className="px-6 py-4 font-semibold">Branch</th>
                <th className="px-6 py-4 font-semibold">CGPA</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-600 dark:text-neutral-500">No students found matching your search.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr 
                    key={student._id} 
                    className="group cursor-pointer transition-colors hover:bg-white/[0.03]"
                    onClick={() => navigate(`/college/dashboard/student-profile/${student._id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-400 border border-indigo-500/20">
                          {student.fullName?.charAt(0) || "?"}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">{student.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500 dark:text-neutral-400">{student.rollNo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-300">
                        <GraduationCap size={14} className="text-slate-600 dark:text-neutral-500" />
                        {student.branch}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {student.cgpa}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => handleRemoveStudent(student._id, student.fullName, e)}
                        className="inline-flex items-center gap-1.5 rounded-lg p-2 text-slate-600 dark:text-neutral-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title="Remove Student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriveStudents;
