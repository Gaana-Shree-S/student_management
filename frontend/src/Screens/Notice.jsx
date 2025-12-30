import React, { useEffect, useState } from "react";
import { IoMdAdd, IoMdClose, IoMdMegaphone } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDeleteOutline, MdEditNote } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import axiosWrapper from "../utils/AxiosWrapper";
import DeleteConfirm from "../components/DeleteConfirm";
import Loading from "../components/Loading";

const Notice = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeNotice, setActiveNotice] = useState(null);
  const token = localStorage.getItem("userToken");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "student",
    link: "",
  });

  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
    }
  }, [token, navigate]);

  const getNotices = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get("/notice", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setNotices(response.data.data);
        if (response.data.data.length > 0) setActiveNotice(response.data.data[0]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) setNotices([]);
      else toast.error(error.response?.data?.message || "Failed to load notices");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    getNotices();
  }, [router.pathname]);

  const openAddModal = () => {
    setEditingNotice(null);
    setFormData({ title: "", description: "", type: "student", link: "" });
    setShowAddModal(true);
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title || "",
      description: notice.description || "",
      type: notice.type || "student",
      link: notice.link || "",
    });
    setShowAddModal(true);
  };

  const handleSubmitNotice = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.type) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      const response = await axiosWrapper[editingNotice ? "put" : "post"](
        `/notice${editingNotice ? `/${editingNotice._id}` : ""}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        getNotices();
        setShowAddModal(false);
        setEditingNotice(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosWrapper.delete(`/notice/${selectedNoticeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success("Notice deleted successfully");
        setIsDeleteConfirmOpen(false);
        getNotices();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete notice");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0f1c] py-10 px-4 md:px-8 text-slate-300">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
        
        {/* HEADER ACTION BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-indigo-500 rounded-full"></div>
              <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">Bulletin Board</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Campus <span className="text-indigo-500">Intelligence.</span></h1>
            <p className="text-slate-500 text-sm font-medium">Real-time announcements and administrative updates.</p>
          </div>
          
          <div className="flex items-center gap-3">
             {(router.pathname === "/faculty" || router.pathname === "/admin") && (
              <button 
                onClick={openAddModal}
                className="group flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
              >
                <IoMdAdd className="text-lg group-hover:rotate-90 transition-transform" /> Create Post
              </button>
            )}
          </div>
        </div>

        {dataLoading ? (
          <div className="flex justify-center py-20"><Loading /></div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 min-h-[600px]">
            
            {/* LEFT: NOTICE FEED LIST */}
            <div className="w-full lg:w-[380px] flex flex-col gap-4 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
              {notices.length === 0 ? (
                <div className="bg-slate-900/40 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-white/5">
                  <IoMdMegaphone className="text-4xl text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">No signals found</p>
                </div>
              ) : (
                notices.map((notice) => (
                  <div
                    key={notice._id}
                    onClick={() => setActiveNotice(notice)}
                    className={`group cursor-pointer p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden ${
                      activeNotice?._id === notice._id 
                      ? "bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]" 
                      : "bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                        notice.type === 'student' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      }`}>
                        {notice.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">
                         {new Date(notice.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className={`font-black text-sm mb-2 leading-snug tracking-tight ${activeNotice?._id === notice._id ? "text-white" : "text-slate-300 group-hover:text-white"}`}>
                      {notice.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{notice.description}</p>
                    
                    {activeNotice?._id === notice._id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* RIGHT: FEATURED CONTENT VIEW */}
            <div className="flex-1 bg-slate-900/40 backdrop-blur-xl rounded-[3.5rem] border border-white/5 p-8 md:p-14 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none"></div>

              {activeNotice ? (
                <div className="animate-in slide-in-from-bottom-4 duration-700 relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-2xl">
                        <IoMdMegaphone size={28} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Official Transmission</span>
                        <p className="text-xs text-slate-500 font-bold mt-0.5">Time: {new Date(activeNotice.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {(router.pathname === "/faculty" || router.pathname === "/admin") && (
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleEdit(activeNotice)}
                          className="p-3.5 bg-white/5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
                        >
                          <MdEditNote size={24} />
                        </button>
                        <button 
                           onClick={() => {
                            setSelectedNoticeId(activeNotice._id);
                            setIsDeleteConfirmOpen(true);
                          }}
                          className="p-3.5 bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-2xl transition-all border border-white/5"
                        >
                          <MdDeleteOutline size={24} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
                    {activeNotice.title}
                  </h2>

                  <div className="max-w-none mb-12">
                    <p className="text-slate-400 leading-relaxed text-lg whitespace-pre-line font-medium italic border-l-2 border-indigo-500/30 pl-6">
                      {activeNotice.description}
                    </p>
                  </div>

                  {activeNotice.link && (
                    <a 
                      href={activeNotice.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-950"
                    >
                      Access Attached Resource <FiExternalLink className="text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                  <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center mb-4">
                    <IoMdMegaphone size={32} className="opacity-20" />
                  </div>
                  <p className="font-black uppercase tracking-[0.3em] text-[10px]">Select a frequency to monitor</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: DARK WORKSPACE */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex justify-center items-center z-[100] p-4">
            <div className="bg-[#0d1425] border border-white/10 rounded-[3.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 md:p-14">
                <div className="flex justify-between items-center mb-10">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-white tracking-tighter">
                      {editingNotice ? "Edit Pulse" : "Broadcast Signal"}
                    </h2>
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">Administrative Workspace</p>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-xl">
                    <IoMdClose size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmitNotice} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Headline</label>
                    <input
                      type="text"
                      placeholder="Transmission Title..."
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 focus:border-indigo-500 rounded-2xl px-6 py-4 outline-none font-bold text-white transition-all placeholder:text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Context Body</label>
                    <textarea
                      rows="4"
                      placeholder="Detailed intelligence report..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 focus:border-indigo-500 rounded-2xl px-6 py-4 outline-none font-bold text-white transition-all resize-none placeholder:text-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Target</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 focus:border-indigo-500 rounded-2xl px-6 py-4 outline-none font-bold text-white transition-all appearance-none"
                      >
                        <option value="student" className="bg-slate-900">Students</option>
                        <option value="faculty" className="bg-slate-900">Faculty</option>
                        <option value="both" className="bg-slate-900">Universal</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">External Link</label>
                      <input
                        type="text"
                        placeholder="https://resource.cdn"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 focus:border-indigo-500 rounded-2xl px-6 py-4 outline-none font-bold text-white transition-all placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex gap-5 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-5 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all"
                    >
                      Abort
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] bg-white text-slate-900 rounded-[2rem] py-5 font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-500 hover:text-white transition-all"
                    >
                      {editingNotice ? "Sync Updates" : "Initialize Broadcast"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <DeleteConfirm
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
          message="Permenantly delete this signal from the bulletin?"
        />
      </div>
    </div>
  );
};

export default Notice;