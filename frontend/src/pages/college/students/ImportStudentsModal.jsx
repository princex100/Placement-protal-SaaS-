import React, { useState, useRef } from "react";
import { Upload, FileSpreadsheet, X, Loader2, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../api/axios";

const ImportStudentsModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile);
      } else {
        toast.error("Please select a valid Excel (.xlsx) or CSV file.");
        e.target.value = null; // Reset input
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
   e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
   if (droppedFile) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];
      if (validTypes.includes(droppedFile.type) || droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx')) {
        setFile(droppedFile);
      } else {
        toast.error("Please drop a valid Excel (.xlsx) or CSV file.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
     toast.error("Please select a file first.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
   formData.append("file", file);

    try {
      const response = await api.post("/students/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const { studentsImported, branchesDetected } = response.data?.data || {};
      
       toast.success(
        response.data?.message ||
        `${studentsImported} students and ${branchesDetected} branches imported successfully!`,
        { duration: 5000 }
      );
      
      setFile(null);
       if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error.response?.data?.message || "Failed to import students.");
   } finally {
      setIsUploading(false);
   }
   };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
     <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#12121e] p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Import Students</h2>
          <button
            onClick={onClose}
           className="rounded-lg p-2 text-slate-600 dark:text-neutral-500 transition hover:bg-slate-200 dark:hover:bg-white/[0.06] hover:text-neutral-300"
         >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-8 transition-colors hover:border-indigo-500/30 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx, .csv"
              onChange={handleFileChange}
            />
            
            <div className="mb-4 rounded-full bg-indigo-500/10 p-4 text-indigo-400 border border-indigo-500/20">
              <Upload size={32} />
            </div>
            
            {file ? (
              <div className="text-center">
               <p className="font-semibold text-slate-900 dark:text-white">{file.name}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-neutral-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-semibold text-slate-900 dark:text-white">
                 Click to upload or drag and drop
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-neutral-500">
                  Excel (.xlsx) or CSV files only
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-4">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
              <div className="text-sm text-indigo-300/80">
                <p className="font-semibold text-indigo-300">Supported column names (auto-detected):</p>
                <p className="mt-1">
                  Student Name, Roll Number, Branch, Email, CGPA, Phone, LinkedIn, GitHub, Portfolio, etc.
                </p>
                <p className="mt-2 font-medium text-indigo-300">
                  Note: Default passwords will be automatically generated and provided to students.
               </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 dark:text-neutral-400 transition hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-neutral-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-2.5 text-sm font-semibold text-slate-900 dark:text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none"
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Importing...
              </>
            ) : (
              <>
                 <FileSpreadsheet size={18} /> Import Data
              </>
           )}
          </button>
        </div>
      </div>
     </div>
  );
 };

export default ImportStudentsModal;
