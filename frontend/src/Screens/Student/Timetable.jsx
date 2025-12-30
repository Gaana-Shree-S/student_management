import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiDownload, FiCalendar, FiInfo, FiHash, FiClock } from "react-icons/fi";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import axiosWrapper from "../../utils/AxiosWrapper";
import { toast } from "react-hot-toast";
import Loading from "../../components/Loading";

const Timetable = () => {
  const [timetable, setTimetable] = useState("");
  const userData = useSelector((state) => state.userData);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    const getTimetable = async () => {
      try {
        setDataLoading(true);
        const response = await axiosWrapper.get(
          `/timetable?semester=${userData.semester}&branch=${userData.branchId?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        if (response.data.success && response.data.data.length > 0) {
          setTimetable(response.data.data[0].link);
        } else {
          setTimetable("");
        }
      } catch (error) {
        if (error && error.response && error.response.status === 404) {
          setTimetable("");
          return;
        }
        toast.error(error.response?.data?.message || "Error fetching timetable");
      } finally {
        setDataLoading(false);
      }
    };
    userData && getTimetable();
  }, [userData, userData.branchId, userData.semester]);

  return (
    <div className="w-full min-h-screen bg-[#0a0f1c] py-10 px-4 md:px-8 text-slate-300">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
        
        {/* HEADER SECTION - Cyber Dark Card */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[3rem] p-8 md:p-12 mb-10 relative overflow-hidden group">
          {/* Decorative Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-20 -mt-20 group-hover:bg-indigo-500/10 transition-all duration-700"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="space-y-4 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                  <FiCalendar className="text-2xl" />
                </div>
                <div className="flex flex-col">
                    <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">Master Schedule</span>
                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Semester {userData.semester}</h1>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-5 py-2 rounded-full text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <FiInfo className="text-indigo-500" />
                  {userData.branchId?.name || "General"}
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-5 py-2 rounded-full text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <FiClock className="text-emerald-500" />
                  Active Session
                </div>
              </div>
            </div>

            {!dataLoading && timetable && (
              <button
                onClick={() => window.open(process.env.REACT_APP_MEDIA_LINK + "/" + timetable)}
                className="group relative flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-indigo-500 hover:text-white shadow-xl active:scale-95"
              >
                Download PDF
                <FiDownload className="text-lg group-hover:animate-bounce" />
              </button>
            )}
          </div>
        </div>

        {/* CONTENT STAGE */}
        <div className="relative group">
          {dataLoading && (
            <div className="flex flex-col items-center justify-center py-32 bg-slate-900/20 rounded-[4rem] border border-white/5">
                <Loading />
                <p className="mt-8 text-slate-500 font-bold text-xs uppercase tracking-[0.4em] animate-pulse">Decrypting Schedule...</p>
            </div>
          )}

          {!dataLoading && timetable && (
            <div className="relative z-10">
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="relative bg-[#0d1425] p-4 md:p-8 rounded-[4rem] shadow-2xl border border-white/5 overflow-hidden group/img">
                  <img
                      className="rounded-[2.5rem] w-full h-auto object-contain transition-all duration-1000 group-hover/img:scale-[1.02] filter brightness-90 hover:brightness-100"
                      src={process.env.REACT_APP_MEDIA_LINK + "/" + timetable}
                      alt="Current Timetable"
                  />
                  
                  {/* Floating Action Hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-500 bg-slate-950/40 backdrop-blur-sm">
                      <div className="bg-white text-slate-900 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl transform translate-y-4 group-hover/img:translate-y-0 transition-transform">
                          High Resolution Link in Header
                      </div>
                  </div>
              </div>
            </div>
          )}

          {!dataLoading && !timetable && (
            <div className="flex flex-col items-center justify-center py-40 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-white/5">
              <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl mb-8 border border-white/5">
                  <HiOutlineDocumentSearch className="text-slate-700 text-5xl" />
              </div>
              <h3 className="text-white font-black text-2xl tracking-tighter mb-3">No Schedule Detected</h3>
              <p className="text-slate-500 text-center max-w-xs font-medium leading-relaxed">
                Database lookup for Semester {userData.semester} returned zero results. The administration has not uploaded this archive yet.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER INFO */}
        {!dataLoading && timetable && (
          <div className="mt-12 text-center pb-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/5 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  Registry Synced: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;