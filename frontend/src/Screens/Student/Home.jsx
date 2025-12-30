import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Timetable from "./Timetable";
import Material from "./Material";
import Profile from "./Profile";
import Exam from "../Exam";
import ViewMarks from "./ViewMarks";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FiHome, FiCalendar, FiBookOpen, 
  FiBell, FiFileText, FiBarChart2, 
  FiChevronRight, FiUser 
} from "react-icons/fi";

const MENU_ITEMS = [
  { id: "home", label: "Dashboard", component: Profile, icon: <FiHome /> },
  { id: "timetable", label: "Class Schedule", component: Timetable, icon: <FiCalendar /> },
  { id: "material", label: "Study Resources", component: Material, icon: <FiBookOpen /> },
  { id: "notice", label: "Notifications", component: Notice, icon: <FiBell /> },
  { id: "exam", label: "Examinations", component: Exam, icon: <FiFileText /> },
  { id: "marks", label: "Academic Results", component: ViewMarks, icon: <FiBarChart2 /> },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axiosWrapper.get(`/student/my-details`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      } else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching user details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch, userToken]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pathMenuId = urlParams.get("page") || "home";
    const validMenu = MENU_ITEMS.find((item) => item.id === pathMenuId);
    setSelectedMenu(validMenu ? validMenu.id : "home");
  }, [location.search]);

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    navigate(`/student?page=${menuId}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-500 font-medium animate-pulse">Syncing encrypted data...</p>
        </div>
      );
    }

    const currentItem = MENU_ITEMS.find((item) => item.id === selectedMenu);
    if (!currentItem) return null;

    const Component = currentItem.component;
    
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Dynamic Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              {currentItem.label}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Logged in as <span className="text-indigo-400">@{profileData?.firstName?.toLowerCase() || "student"}</span>
            </p>
          </div>
          
          {/* Identity Badge */}
          <div className="flex items-center gap-4 bg-[#0d1425] p-3 rounded-[1.5rem] border border-white/5 shadow-2xl">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <FiUser className="text-xl" />
            </div>
            <div className="pr-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Vault Access ID</p>
              <p className="text-sm font-bold text-slate-200 tracking-widest">{profileData?.enrollmentNo || "---"}</p>
            </div>
          </div>
        </header>
        
        {/* Screen Content */}
        <div className="rounded-[2.5rem]">
           {selectedMenu === "home" ? <Profile profileData={profileData} /> : <Component />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#080d1a] flex flex-col selection:bg-indigo-500/30">
      <Navbar />
      
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto lg:p-6 gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <nav className="sticky top-24 bg-[#0d1425] lg:rounded-[3rem] p-5 lg:p-8 shadow-2xl shadow-black/80 text-white border border-white/5">
            <div className="hidden lg:block mb-10 px-2">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-3">System Navigation</p>
              <div className="h-[2px] w-10 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
            </div>

            <ul className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
              {MENU_ITEMS.map((item) => {
                const isActive = selectedMenu === item.id;
                return (
                  <li key={item.id} className="flex-shrink-0 lg:w-full">
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`
                        w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-sm font-bold transition-all duration-500 group
                        ${isActive 
                          ? "bg-indigo-600 text-white shadow-[0_15px_30px_rgba(79,70,229,0.3)] translate-x-2" 
                          : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-200"}
                      `}
                    >
                      <span className={`text-xl transition-colors duration-500 ${isActive ? "text-white" : "text-indigo-500/60 group-hover:text-indigo-400"}`}>
                        {item.icon}
                      </span>
                      <span className="hidden lg:block tracking-wide">{item.label}</span>
                      {isActive && <FiChevronRight className="ml-auto hidden lg:block opacity-40 animate-pulse" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Dashboard Area */}
        <main className="flex-1 px-4 pb-12 lg:px-0">
          {renderContent()}
        </main>
      </div>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0d1425',
            color: '#fff',
            borderRadius: '1.25rem',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '1.25rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }
        }}
      />
    </div>
  );
};

export default Home;