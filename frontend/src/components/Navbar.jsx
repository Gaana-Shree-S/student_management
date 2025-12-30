import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard, RxArrowLeft } from "react-icons/rx";
import { HiOutlineShieldCheck } from "react-icons/hi";
import CustomButton from "./CustomButton";

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();

  const logouthandler = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <nav className="fixed top-4 left-0 right-0 z-[100] px-4 md:px-8">
      <div className="max-w-7xl mx-auto bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[2rem] px-6 py-3">
        <div className="flex justify-between items-center">
          
          {/* LEFT: Branding & Back Navigation */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group"
              title="Go Back"
            >
              <RxArrowLeft className="text-gray-500 group-hover:text-blue-600 transition-colors" size={22} />
            </button>
            <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
            
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <RxDashboard className="text-white text-xl" />
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] leading-none mb-1">
                  System Portal
                </p>
                <h1 className="text-lg font-black text-gray-800 dark:text-white leading-none">
                  {router.state?.type || "Admin"} Dashboard
                </h1>
              </div>
            </div>
          </div>

          {/* MIDDLE: Visual Status (New Decoration) */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-gray-100/50 dark:bg-gray-800/50 rounded-full border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <HiOutlineShieldCheck className="text-blue-500" /> Secure Session Active
            </span>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-2 hidden sm:block">
               <span className="text-[10px] font-bold text-gray-400 uppercase">Authenticated</span>
               <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Session ID: #8812</span>
            </div>
            
            <CustomButton 
              variant="danger" 
              onClick={logouthandler}
              className="!rounded-2xl !px-4 !py-2.5 flex items-center gap-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all active:scale-95"
            >
              <span className="hidden sm:inline font-bold text-sm tracking-tight">End Session</span>
              <FiLogOut className="text-lg" />
            </CustomButton>
          </div>

        </div>
      </div>
      
      {/* Spacer to push content below the fixed navbar */}
      <div className="h-4"></div>
    </nav>
  );
};

export default Navbar;