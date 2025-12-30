import React, { useEffect, useState } from "react";
import { FiUpload, FiCalendar, FiClock, FiLayers, FiEye, FiTrash2, FiEdit3, FiPlus } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Heading from "../../components/Heading";
import toast from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";

const AddTimetableModal = ({ isOpen, onClose, onSubmit, initialData = null, branches }) => {
  const [formData, setFormData] = useState({
    branch: initialData?.branch || "",
    semester: initialData?.semester || "",
    file: null,
    previewUrl: initialData?.file || "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[100] p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight">{initialData ? "Edit Schedule" : "New Publication"}</h2>
            <p className="text-indigo-100/70 text-xs font-medium mt-1 uppercase tracking-widest">Faculty Management Portal</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-2xl">
            <IoMdClose />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Branch</label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-slate-800 border-none rounded-2xl px-4 py-4 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              >
                <option value="">Choose Branch</option>
                {branches?.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full bg-slate-800 border-none rounded-2xl px-4 py-4 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              >
                <option value="">Choose Sem</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>Sem {sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Upload Source</label>
            <div className="relative group">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="border-2 border-dashed border-slate-700 group-hover:border-indigo-500/50 rounded-[2rem] p-10 transition-all text-center bg-slate-800/50 group-hover:bg-indigo-500/5">
                <FiUpload className="mx-auto text-4xl text-slate-600 group-hover:text-indigo-400 mb-3" />
                <p className="text-sm font-bold text-slate-400 group-hover:text-slate-200">
                  {formData.file ? formData.file.name : "Select Timetable File"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={onClose} className="flex-1 py-4 text-sm font-bold text-slate-500 hover:text-slate-300 transition-colors">Discard</button>
            <button 
              onClick={handleSubmit} 
              className="flex-1 py-4 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-indigo-50 transition-all shadow-xl shadow-white/5"
            >
              {initialData ? "Save" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Timetable = () => {
  const [branch, setBranch] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTimetableId, setSelectedTimetableId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    getBranchHandler();
    getTimetablesHandler();
  }, []);

  const getBranchHandler = async () => {
    try {
      const response = await axiosWrapper.get(`/branch`, { headers: { Authorization: `Bearer ${userToken}` } });
      if (response.data.success) setBranch(response.data.data);
    } catch (error) { toast.error("Error fetching branches"); }
  };

  const getTimetablesHandler = async () => {
    try {
      const response = await axiosWrapper.get(`/timetable`, { headers: { Authorization: `Bearer ${userToken}` } });
      if (response.data.success) setTimetables(response.data.data);
    } catch (error) { toast.error("Error fetching timetables"); }
  };

  const handleSubmitTimetable = async (formData) => {
    const headers = { "Content-Type": "multipart/form-data", Authorization: `Bearer ${userToken}` };
    const submitData = new FormData();
    submitData.append("branch", formData.branch);
    submitData.append("semester", formData.semester);
    if (formData.file) submitData.append("file", formData.file);

    try {
      toast.loading("Processing...");
      let response = editingTimetable 
        ? await axiosWrapper.put(`/timetable/${editingTimetable._id}`, submitData, { headers })
        : await axiosWrapper.post("/timetable", submitData, { headers });
      
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        getTimetablesHandler();
        setShowAddModal(false);
        setEditingTimetable(null);
      }
    } catch (error) { toast.dismiss(); toast.error("Failed"); }
  };

  const deleteTimetableHandler = (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedTimetableId(id);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Removing...");
      const response = await axiosWrapper.delete(`/timetable/${selectedTimetableId}`, { headers: { Authorization: `Bearer ${userToken}` } });
      toast.dismiss();
      if (response.data.success) {
        toast.success("Removed");
        setIsDeleteConfirmOpen(false);
        getTimetablesHandler();
      }
    } catch (error) { toast.dismiss(); toast.error("Delete failed"); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <div className="w-full max-w-[1400px] mx-auto pt-10 px-6 pb-20">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 bg-slate-900/40 border border-slate-800/60 p-10 rounded-[3rem] mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Administrator Dashboard</p>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">Timetables</h1>
            <div className="flex items-center gap-4 mt-4">
              <span className="flex items-center gap-2 text-slate-500 text-sm font-bold bg-slate-800/50 px-4 py-2 rounded-full">
                <FiLayers className="text-indigo-400" /> {timetables.length} Active Feeds
              </span>
            </div>
          </div>

          <button 
            onClick={() => setShowAddModal(true)} 
            className="group bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-5 rounded-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-indigo-900/20 active:scale-95"
          >
            <FiPlus className="text-xl" /> Create New Publication
          </button>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {timetables.map((item) => (
            <div key={item._id} className="group relative bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 transition-all duration-500 hover:border-indigo-500/30 hover:bg-slate-900/60 hover:-translate-y-2 shadow-2xl shadow-black/20">
              
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <FiCalendar className="text-3xl" />
                </div>
                <div className="flex gap-2">
                   <button onClick={() => { setEditingTimetable(item); setShowAddModal(true); }} className="p-3 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                      <FiEdit3 className="text-lg" />
                   </button>
                   <button onClick={() => deleteTimetableHandler(item._id)} className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
                      <FiTrash2 className="text-lg" />
                   </button>
                </div>
              </div>

              <div className="space-y-3 mb-10">
                <h3 className="text-2xl font-black text-white tracking-tight line-clamp-1">{item.branch.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-indigo-500/20">
                    Semester {item.semester}
                  </span>
                  <span className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                    <FiClock /> {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <a
                href={`${process.env.REACT_APP_MEDIA_LINK}/${item.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-white text-slate-950 rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.1em] transition-all group-hover:bg-indigo-500 group-hover:text-white shadow-xl shadow-black/20"
              >
                <FiEye className="text-lg" /> Inspect Schedule
              </a>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {timetables.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-slate-800/50">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-600">
                <FiLayers className="text-5xl" />
            </div>
            <p className="text-slate-500 font-bold text-lg">No Schedules Published</p>
            <p className="text-slate-600 text-sm mt-1">Initiate a new publication to get started</p>
          </div>
        )}

        {/* MODAL & LOGIC */}
        <AddTimetableModal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); setEditingTimetable(null); }}
          onSubmit={handleSubmitTimetable}
          initialData={editingTimetable}
          branches={branch}
        />

        <DeleteConfirm
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

export default Timetable;