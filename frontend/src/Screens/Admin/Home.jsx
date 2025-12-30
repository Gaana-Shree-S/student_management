import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import Student from "./Student";
import Faculty from "./Faculty";
import Subjects from "./Subject";
import Admin from "./Admin";
import Branch from "./Branch";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Profile from "./Profile";
import Exam from "../Exam";
import { useNavigate, useLocation } from "react-router-dom";
import FloatingChatbot from "../../components/FloatingChatbot";

// Icons for the Sidebar
import { 
  HiOutlineHome, HiOutlineUserGroup, HiOutlineAcademicCap, 
  HiOutlineOfficeBuilding, HiOutlineSpeakerphone, HiOutlinePencilAlt, 
  HiOutlineBookOpen, HiOutlineShieldCheck 
} from "react-icons/hi";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: Profile, icon: HiOutlineHome },
  { id: "student", label: "Student", component: Student, icon: HiOutlineUserGroup },
  { id: "faculty", label: "Faculty", component: Faculty, icon: HiOutlineAcademicCap },
  { id: "branch", label: "Branch", component: Branch, icon: HiOutlineOfficeBuilding },
  { id: "notice", label: "Notice", component: Notice, icon: HiOutlineSpeakerphone },
  { id: "exam", label: "Exam", component: Exam, icon: HiOutlinePencilAlt },
  { id: "subjects", label: "Subjects", component: Subjects, icon: HiOutlineBookOpen },
  { id: "admin", label: "Admin", component: Admin, icon: HiOutlineShieldCheck },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      toast.loading("Securing session...");
      const response = await axiosWrapper.get(`/admin/my-details`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching user details");
    } finally {
      setIsLoading(false);
      toast.dismiss();
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
    navigate(`/admin?page=${menuId}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold animate-pulse">Syncing Database...</p>
        </div>
      );
    }

    const MenuItem = MENU_ITEMS.find((item) => item.id === selectedMenu)?.component;
    if (selectedMenu === "home" && profileData) return <Profile profileData={profileData} />;
    return MenuItem && <MenuItem />;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-950 transition-colors duration-500">
      <Navbar />

      {/* Decorative background element */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-400/10 blur-[120px] rounded-full"></div>

      <div className="flex max-w-[1600px] mx-auto pt-24 pb-10 px-4 md:px-8 gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0">
          <div className="sticky top-28 space-y-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white dark:border-gray-800 shadow-2xl">
            <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Navigation</p>
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = selectedMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                    : "text-gray-500 hover:bg-white dark:hover:bg-gray-800 hover:text-blue-600"
                  }`}
                >
                  <Icon size={22} className={`${isActive ? "text-white" : "group-hover:scale-110 transition-transform"}`} />
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
                </button>
              );
            })}
          </div>
        </aside>

        {/* MAIN STAGE */}
        <main className="flex-grow">
          {/* Mobile Tab Scroller (Visible only on small screens) */}
          <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-2">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest border transition-all ${
                  selectedMenu === item.id 
                  ? "bg-blue-600 border-blue-600 text-white" 
                  : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[3rem] border border-white dark:border-gray-800 shadow-xl min-h-[70vh] p-4 md:p-8">
            <header className="mb-8 flex justify-between items-center px-4">
               <div>
                 <h2 className="text-3xl font-black text-gray-900 dark:text-white capitalize">
                   {selectedMenu}
                 </h2>
                 <div className="w-12 h-1 bg-blue-600 rounded-full mt-2"></div>
               </div>
               <div className="hidden sm:block text-right text-xs font-bold text-gray-400 uppercase tracking-widest">
                 Admin Dashboard / {selectedMenu}
               </div>
            </header>

            <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      <FloatingChatbot />
      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};

export default Home;