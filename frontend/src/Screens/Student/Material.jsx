import React, { useEffect, useState } from "react";
import { MdOutlineFileDownload, MdOutlineMenuBook, MdOutlineAssignment, MdOutlineDescription, MdSearch } from "react-icons/md";
import { FiFilter, FiFolder, FiChevronRight } from "react-icons/fi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import axiosWrapper from "../../utils/AxiosWrapper";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const userData = useSelector((state) => state.userData);
  const [filters, setFilters] = useState({ subject: "", type: "" });

  useEffect(() => { fetchSubjects(); }, []);
  useEffect(() => { fetchMaterials(); }, [filters]);

  const fetchSubjects = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(
        `/subject?semester=${userData.semester}&branch=${userData.branchId._id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
      );
      if (response.data.success) setSubjects(response.data.data);
    } catch (error) {
      if (error?.response?.status === 404) { setSubjects([]); return; }
      toast.error(error?.response?.data?.message || "Failed to load subjects");
    } finally { setDataLoading(false); }
  };

  const fetchMaterials = async () => {
    try {
      setDataLoading(true);
      const queryParams = new URLSearchParams({ semester: userData.semester, branch: userData.branchId._id });
      if (filters.subject) queryParams.append("subject", filters.subject);
      if (filters.type) queryParams.append("type", filters.type);

      const response = await axiosWrapper.get(`/material?${queryParams}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      });
      if (response.data.success) setMaterials(response.data.data);
    } catch (error) {
      if (error?.response?.status === 404) { setMaterials([]); return; }
      toast.error(error?.response?.data?.message || "Failed to load materials");
    } finally { setDataLoading(false); }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'notes': return <MdOutlineMenuBook className="text-emerald-400" />;
      case 'assignment': return <MdOutlineAssignment className="text-amber-400" />;
      case 'syllabus': return <MdOutlineDescription className="text-indigo-400" />;
      default: return <FiFolder className="text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-200 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* TOP SECTION: TITLES & STATS */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
               <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
               <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">Semester {userData.semester}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              The Archive<span className="text-indigo-500">.</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-md">
              Secure access to validated academic resources and lecture documentation.
            </p>
          </div>

          {/* DARK FILTER DOCK */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-900/50 backdrop-blur-xl p-3 rounded-[2rem] border border-white/5 shadow-2xl">
            <div className="flex items-center gap-2 pl-4 pr-2 text-slate-500 border-r border-white/10">
              <FiFilter className="text-lg" />
            </div>
            
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="bg-transparent text-sm font-bold text-slate-300 outline-none cursor-pointer py-2 px-2 hover:text-indigo-400 transition-colors"
            >
              <option value="" className="bg-slate-900">All Modules</option>
              {subjects.map((s) => <option key={s._id} value={s._id} className="bg-slate-900">{s.name}</option>)}
            </select>

            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="bg-transparent text-sm font-bold text-slate-300 outline-none cursor-pointer py-2 px-2 hover:text-indigo-400 transition-colors"
            >
              <option value="" className="bg-slate-900">All Categories</option>
              <option value="notes" className="bg-slate-900">Notes</option>
              <option value="assignment" className="bg-slate-900">Assignments</option>
              <option value="syllabus" className="bg-slate-900">Syllabus</option>
            </select>
          </div>
        </div>

        {dataLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-indigo-500/10 rounded-full animate-pulse"></div>
                </div>
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em] mt-8">Decrypting Data...</p>
          </div>
        ) : (
          <>
            {materials && materials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {materials.map((material) => (
                  <div 
                    key={material._id} 
                    className="group relative bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 hover:bg-slate-800/60 transition-all duration-500 hover:border-indigo-500/30 overflow-hidden"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-700"></div>

                    <div className="relative z-10 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-slate-800/80 rounded-2xl text-3xl shadow-xl group-hover:scale-110 transition-transform duration-500">
                          {getTypeIcon(material.type)}
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Type</span>
                            <span className="text-xs font-bold text-slate-300 bg-white/5 px-3 py-1 rounded-lg border border-white/5 uppercase">
                                {material.type}
                            </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-8">
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                          {material.title}
                        </h3>
                        <div className="flex items-center gap-2">
                           <div className="h-[2px] w-4 bg-indigo-500/50"></div>
                           <p className="text-sm font-semibold text-slate-500">{material.subject.name}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => window.open(`${process.env.REACT_APP_MEDIA_LINK}/${material.file}`)}
                        className="mt-auto group/btn relative overflow-hidden w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all duration-300"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <MdOutlineFileDownload className="text-xl" />
                            Download Stream
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-white/5">
                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-2xl border border-white/5">
                  <FiFolder className="text-4xl text-slate-700" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tighter">No assets detected</h3>
                <p className="text-slate-500 font-medium mt-2">The requested directory is currently empty.</p>
                <button 
                  onClick={() => setFilters({ subject: "", type: "" })}
                  className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest transition-all"
                >
                  Reset Uplink
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Material;