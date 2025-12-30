import React from "react";

const CustomButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-slate-900 dark:bg-blue-600 text-white border-blue-400/30 hover:bg-blue-700 shadow-[0_0_20px_rgba(59,130,246,0.2)]";
      case "secondary":
        return "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 shadow-sm";
      case "danger":
        return "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-600 hover:text-white shadow-[0_0_15px_rgba(239,68,68,0.1)]";
      default:
        return "bg-slate-900 text-white border-blue-400/30 shadow-md";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group overflow-hidden
        px-6 py-3 rounded-2xl
        font-bold text-xs uppercase tracking-widest
        transition-all duration-200 
        border-b-4 active:border-b-0 active:mt-[4px]
        flex items-center justify-center gap-3
        disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed
        focus:outline-none focus:ring-4 focus:ring-blue-500/20
        ${getVariantClasses()}
        ${className}
      `}
    >
      {/* Glossy Reflective Layer */}
      <span className="absolute top-0 left-0 w-full h-1/2 bg-white/10 group-hover:bg-white/20 transition-colors pointer-events-none" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform">
        {children}
      </span>

      {/* Subtle Inner Glow (Hover) */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
    </button>
  );
};

export default CustomButton;