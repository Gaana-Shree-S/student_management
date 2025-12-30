/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { FiUpload, FiEdit2, FiTrash2, FiSearch, FiBook, FiFolder, FiCpu, FiLayers } from "react-icons/fi";
import { AiOutlineClose, AiOutlineFileText } from "react-icons/ai";
import { MdLink, MdOutlineFilterList } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import toast from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import DeleteConfirm from "../../components/DeleteConfirm";

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    semester: "",
    branch: "",
    type: "notes",
  });
  const [file, setFile] = useState(null);
  const [filters, setFilters] = useState({
    subject: "",
    semester: "",
    branch: "",
    type: "",
  });

  useEffect(() => {
    fetchSubjects();
    fetchBranches();
    fetchMaterials();
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [filters]);

  const fetchSubjects = async () => {
    try {
      const response = await axiosWrapper.get("/subject", {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      if (response.data.success) setSubjects(response.data.data);
    } catch (error) { setSubjects([]); }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosWrapper.get("/branch", {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      if (response.data.success) setBranches(response.data.data);
    } catch (error) { setBranches([]); }
  };

  const fetchMaterials = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axiosWrapper.get(`/material?${queryParams}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      if (response.data.success) setMaterials(response.data.data);
    } catch (error) { setMaterials([]); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const resetForm = () => {
    setFormData({ title: "", subject: "", semester: "", branch: "", type: "notes" });
    setFile(null);
    setEditingMaterial(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDataLoading(true);
    const loadingToast = toast.loading(editingMaterial ? "Updating Registry..." : "Uploading Asset...");

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
      if (file) formDataToSend.append("file", file);

      if (editingMaterial) {
        await axiosWrapper.put(`/material/${editingMaterial._id}`, formDataToSend);
        toast.success("Registry Updated", { id: loadingToast });
      } else {
        await axiosWrapper.post("/material", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        });
        toast.success("Asset Published", { id: loadingToast });
      }

      setShowModal(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      toast.error("Deployment failed", { id: loadingToast });
    } finally {
      setDataLoading(false);
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      subject: material.subject._id,
      semester: material.semester,
      branch: material.branch._id,
      type: material.type,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axiosWrapper.delete(`/material/${selectedMaterialId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      toast.success("Asset Revoked");
      setIsDeleteConfirmOpen(false);
      fetchMaterials();
    } catch (error) {
      toast.error("Failed to revoke");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-1 w-6 bg-indigo-500 rounded-full"></div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Knowledge Base</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
             Digital Library
          </h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 font-black uppercase text-xs tracking-widest"
        >
          <IoMdAdd className="text-xl group-hover:rotate-90 transition-transform" /> Upload Resource
        </button>
      </div>

      {/* Modern Filter Bar */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 mb-12 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
          <MdOutlineFilterList size={18} /> Optimization Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Branch", name: "branch", options: branches },
            { label: "Subject", name: "subject", options: subjects },
          ].map((filter) => (
            <div key={filter.name}>
              <select
                name={filter.name}
                value={filters[filter.name]}
                onChange={handleFilterChange}
                className="w-full bg-slate-950/50 border border-slate-800 text-slate-300 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold text-sm appearance-none cursor-pointer"
              >
                <option value="">All {filter.label}es</option>
                {filter.options.map((opt) => (
                  <option key={opt._id} value={opt._id}>{opt.name}</option>
                ))}
              </select>
            </div>
          ))}

          <select
            name="semester"
            value={filters.semester}
            onChange={handleFilterChange}
            className="w-full bg-slate-950/50 border border-slate-800 text-slate-300 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold text-sm appearance-none cursor-pointer"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>Term {sem}</option>
            ))}
          </select>

          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full bg-slate-950/50 border border-slate-800 text-slate-300 rounded-xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold text-sm appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {["notes", "assignment", "syllabus", "other"].map(t => (
              <option key={t} value={t} className="capitalize">{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Material Grid */}
      {materials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800">
          <div className="relative">
             <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-10 animate-pulse"></div>
             <FiFolder size={80} className="relative text-slate-700 mb-6" />
          </div>
          <p className="text-slate-400 font-black text-xl tracking-tight">Archives Empty</p>
          <p className="text-slate-600 text-sm mt-2">No matching documentation found in the cloud.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {materials.map((material) => (
            <div key={material._id} className="group bg-slate-900/40 backdrop-blur-sm rounded-[2.5rem] border border-slate-800 p-8 shadow-xl hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all duration-500 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>

              <div className="flex justify-between items-start mb-8">
                <div className="p-5 bg-indigo-500/10 text-indigo-400 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                  <AiOutlineFileText size={36} />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(material)} className="p-3 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition-all">
                    <FiEdit2 size={18} />
                  </button>
                  <button 
                    onClick={() => { setSelectedMaterialId(material._id); setIsDeleteConfirmOpen(true); }}
                    className="p-3 text-slate-500 hover:text-rose-500 hover:bg-slate-800 rounded-xl transition-all"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-black text-white mb-3 truncate tracking-tight">{material.title}</h3>
              <div className="flex items-center gap-2 text-indigo-400/80 font-black text-[10px] uppercase tracking-widest mb-6">
                 <FiCpu /> {material.subject.name}
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                <Tag label={`Term ${material.semester}`} color="bg-slate-800 text-slate-400" />
                <Tag label={material.branch.name} color="bg-indigo-500/10 text-indigo-400" />
                <Tag label={material.type} color="bg-emerald-500/10 text-emerald-400" />
              </div>

              <button
                onClick={() => window.open(`${process.env.REACT_APP_MEDIA_LINK}/${material.file}`)}
                className="w-full py-4 bg-slate-800 text-slate-100 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
              >
                <MdLink size={20} /> Access Asset
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60">
          <div className="bg-slate-950 border border-slate-800 rounded-[3rem] p-10 max-w-2xl w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <div>
                 <h2 className="text-3xl font-black text-white tracking-tighter">
                   {editingMaterial ? "Edit Asset" : "New Asset"}
                 </h2>
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Publish to Academic Cloud</p>
              </div>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-3 bg-slate-900 text-slate-500 hover:text-white rounded-2xl transition-all">
                <AiOutlineClose size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Display Title</label>
                <input
                  type="text" name="title" value={formData.title} onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-slate-800 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold"
                  placeholder="e.g. Advanced Calculus Notes" required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Subject</label>
                  <select name="subject" value={formData.subject} onChange={handleInputChange} className="w-full bg-slate-900/50 border border-slate-800 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" required>
                    <option value="">Select</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Branch</label>
                  <select name="branch" value={formData.branch} onChange={handleInputChange} className="w-full bg-slate-900/50 border border-slate-800 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" required>
                    <option value="">Select</option>
                    {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Semester</label>
                  <select name="semester" value={formData.semester} onChange={handleInputChange} className="w-full bg-slate-900/50 border border-slate-800 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" required>
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => <option key={sem} value={sem}>{sem}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Category</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-slate-900/50 border border-slate-800 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" required>
                    {["notes", "assignment", "syllabus", "other"].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="relative group pt-4">
                <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!editingMaterial} />
                <div className="border-2 border-dashed border-slate-800 rounded-[2rem] p-10 flex flex-col items-center justify-center group-hover:border-indigo-500/50 transition-all bg-slate-900/30">
                  <FiUpload size={40} className="text-slate-600 mb-3 group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
                  <p className="text-slate-400 font-black text-sm uppercase tracking-widest">{file ? file.name : "Inject Document"}</p>
                  <p className="text-slate-600 text-[10px] mt-2 font-bold">Max capacity 10MB (PDF/DOC/PPT)</p>
                </div>
              </div>

              <button
                type="submit" disabled={dataLoading}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {dataLoading ? "Deploying..." : editingMaterial ? "Commit Changes" : "Publish to Portal"}
              </button>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="This will permanently revoke the document from the academic node."
      />
    </div>
  );
};

const Tag = ({ label, color }) => (
  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-transparent hover:border-current transition-all ${color}`}>
    {label}
  </span>
);

export default Material;