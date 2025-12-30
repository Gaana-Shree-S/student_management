import React from "react";

const Heading = (props) => {
  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 mb-8 overflow-hidden">
      {/* Background Decorative Text (Watermark effect) */}
      <span className="absolute top-0 select-none text-7xl md:text-8xl font-black text-white/[0.03] uppercase tracking-tighter transition-all duration-500">
        {props.title}
      </span>

      {/* Main Heading Container */}
      <div className="relative z-10 flex flex-col items-center group">
        {/* Top Accent Line */}
        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-3 opacity-80 group-hover:w-20 transition-all duration-500" />
        
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-sm">
          {props.title}
        </h1>

        {/* Bottom Decorative Element */}
        <div className="flex items-center gap-2 mt-2">
          <div className="h-[1px] w-8 bg-gradient-to-l from-gray-500 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <div className="h-[1px] w-8 bg-gradient-to-r from-gray-500 to-transparent" />
        </div>
      </div>

      {/* Subtle Glow Effect */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-indigo-500/10 blur-2xl rounded-full" />
    </div>
  );
};

export default Heading;