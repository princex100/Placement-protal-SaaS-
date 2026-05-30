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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm dark:bg-slate-900/80">
      <div className="w-full max-w-lg animate-in fade-in zoom-in-95 rounded-[24px] border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800/60">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Import Students</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-blue-500/50 dark:hover:bg-blue-900/20"
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx, .csv"
              onChange={handleFileChange}
            />
            
            <div className="mb-4 rounded-full bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Upload size={32} />
            </div>
            
            {file ? (
              <div className="text-center">
                <p className="font-semibold text-slate-900 dark:text-white">{file.name}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Excel (.xlsx) or CSV files only
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold">Supported column names (auto-detected):</p>
                <p className="mt-1">
                  Student Name, Roll Number, Branch, Email, CGPA, Phone, LinkedIn, GitHub, Portfolio, etc.
                </p>
                <p className="mt-2 font-medium">
                  Note: Default passwords will be automatically generated and provided to students.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
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
