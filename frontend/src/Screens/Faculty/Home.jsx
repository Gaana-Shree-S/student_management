import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Timetable from "./Timetable";
import Material from "./Material";
import StudentFinder from "./StudentFinder";
import Profile from "./Profile";
import Marks from "./AddMarks";
import Exam from "../Exam";
import { FiHome, FiCalendar, FiBookOpen, FiBell, FiSearch, FiEdit3, FiFileText } from "react-icons/fi";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: null, icon: <FiHome /> },
  { id: "timetable", label: "Timetable", component: Timetable, icon: <FiCalendar /> },
  { id: "material", label: "Material", component: Material, icon: <FiBookOpen /> },
  { id: "notice", label: "Notice", component: Notice, icon: <FiBell /> },
  { id: "student info", label: "Student Info", component: StudentFinder, icon: <FiSearch /> },
  { id: "marks", label: "Marks", component: Marks, icon: <FiEdit3 /> },
  { id: "exam", label: "Exam", component: Exam, icon: <FiFileText /> },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const [profileData, setProfileData] = useState(null);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosWrapper.get("/faculty/my-details", {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (response.data.success) {
          setProfileData(response.data.data);
          dispatch(setUserData(response.data.data));
        }
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };
    fetchUserDetails();
  }, [dispatch, userToken]);

  const renderContent = () => {
    if (selectedMenu === "Home" && profileData) {
      return (
        <div className="p-6 md:p-10 animate-in fade-in zoom-in-95 duration-500">
          <Profile profileData={profileData} />
        </div>
      );
    }

    const menuItem = MENU_ITEMS.find(
      (item) => item.label.toLowerCase() === selectedMenu.toLowerCase()
    );

    if (menuItem && menuItem.component) {
      const Component = menuItem.component;
      return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Component />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col selection:bg-indigo-500/30">
      <Navbar />

      <div className="flex flex-1 flex-col lg:flex-row max-w-[1700px] w-full mx-auto px-6 gap-8">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-72 mt-8 lg:mt-12">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-6 sticky top-28 shadow-2xl shadow-black/20">
            <div className="px-4 mb-8">
               <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Command Center</h2>
            </div>

            <nav className="space-y-2">
              {MENU_ITEMS.map((item) => {
                const isActive = selectedMenu.toLowerCase() === item.label.toLowerCase();
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMenu(item.label)}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 group ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-x-1"
                        : "text-slate-400 hover:bg-slate-800 hover:text-indigo-400"
                    }`}
                  >
                    <span className={`text-lg ${isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400"}`}>
                        {item.icon}
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Quick Status Info */}
            <div className="mt-10 pt-10 border-t border-slate-800/50 px-4">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">System Operational</span>
               </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 mt-8 lg:mt-12 mb-12">
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-slate-800 shadow-2xl min-h-[80vh] overflow-hidden relative">
            
            {/* Context Header */}
            <div className="px-12 pt-10 pb-6 flex items-center justify-between bg-gradient-to-b from-slate-900/50 to-transparent">
               <div>
                 <div className="flex items-center gap-3 mb-1">
                   <div className="h-1 w-6 bg-indigo-500 rounded-full"></div>
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Section</span>
                 </div>
                 <h1 className="text-4xl font-black text-white tracking-tighter">{selectedMenu}</h1>
               </div>
               
               {profileData && (
                 <div className="hidden sm:flex items-center gap-4 bg-slate-800/40 px-5 py-2.5 rounded-2xl border border-slate-700/50">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Level</p>
                        <p className="text-xs font-bold text-slate-200">Faculty Member</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-black text-indigo-400 text-xs">
                            {profileData.name?.charAt(0)}
                        </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Content Slot */}
            <div className="relative z-10 px-4 pb-4">
              {renderContent() || (
                <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <span className="text-slate-500 font-black text-xs uppercase tracking-[0.4em]">Initializing Module</span>
                </div>
              )}
            </div>

            {/* Subtle Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>
          </div>
        </main>
      </div>

      <Toaster 
        toastOptions={{
            style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
                borderRadius: '1rem',
                fontSize: '14px',
                fontWeight: '600'
            }
        }}
        position="bottom-center" 
      />
    </div>
  );
};

export default Home;