import React from "react";
import { HiOutlineInbox } from "react-icons/hi";

const NoData = ({ title }) => {
  return (
    <div className="relative w-full py-20 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 border border-dashed border-gray-200 dark:border-gray-800 rounded-full animate-[spin_20s_linear_infinite]" />
        <div className="absolute w-48 h-48 border border-gray-100 dark:border-gray-900 rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Floating Icon Element */}
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-xl rounded-full scale-150 opacity-50" />
          <div className="relative bg-white dark:bg-gray-950 p-6 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-50 dark:border-gray-800">
            <HiOutlineInbox className="w-12 h-12 text-indigo-400 dark:text-indigo-500/70" />
          </div>
          
          {/* Small floating "zero" indicator */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-lg border-2 border-white dark:border-gray-950">
            0
          </div>
        </div>

        {/* Text Content */}
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          {title || "No data found"}
        </h3>
        
        <div className="mt-4 flex items-center gap-3">
          <span className="h-px w-6 bg-gray-200 dark:bg-gray-800" />
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
            Status: Empty Catalog
          </p>
          <span className="h-px w-6 bg-gray-200 dark:bg-gray-800" />
        </div>

        <p className="mt-4 max-w-[280px] text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          The records you are looking for are currently unavailable. 
          Please verify your parameters and try again.
        </p>

        {/* Interactive hint shadow */}
        <div className="mt-10 w-1 h-10 bg-gradient-to-b from-indigo-500/50 to-transparent rounded-full opacity-50" />
      </div>
    </div>
  );
};

export default NoData;