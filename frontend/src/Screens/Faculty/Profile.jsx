import React, { useState } from "react";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";
import { FiMail, FiPhone, FiMapPin, FiCalendar, FiShield, FiHeart, FiBriefcase, FiDollarSign } from "react-icons/fi";

const Profile = ({ profileData }) => {
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  
  if (!profileData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-slate-950 text-slate-200 min-h-screen">
      {/* HEADER SECTION - Dark Industrial Style */}
      <div className="p-8 md:p-14 bg-slate-900/40 border-b border-slate-800/60 flex flex-col md:flex-row items-center gap-10">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <img
            src={`${process.env.REACT_APP_MEDIA_LINK}/${profileData.profile}`}
            alt="Profile"
            className="relative w-36 h-36 md:w-44 md:h-44 rounded-[2.2rem] object-cover border-4 border-slate-800 shadow-2xl"
          />
          <span className="absolute bottom-3 right-3 w-7 h-7 bg-emerald-500 border-4 border-slate-900 rounded-full shadow-lg"></span>
        </div>
        
        <div className="text-center md:text-left space-y-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              {`${profileData.firstName} ${profileData.lastName}`}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4">
               <span className="px-5 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20">
                 {profileData.designation}
               </span>
               <div className="flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                 <span className="opacity-50">ID:</span> {profileData.employeeId}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="p-8 md:p-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Stats Row - High Contrast */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard label="Annual Salary" value={`₹${profileData.salary.toLocaleString()}`} icon={<FiDollarSign />} color="text-emerald-400" />
            <StatCard label="Blood Type" value={profileData.bloodGroup} icon={<FiHeart />} color="text-rose-400" />
            <StatCard label="Tenure Date" value={formatDate(profileData.joiningDate)} icon={<FiBriefcase />} color="text-indigo-400" />
            <StatCard label="Account Status" value={profileData.status} icon={<FiShield />} color="text-sky-400" capitalize />
          </div>

          {/* Details Card - Deep Glass Style */}
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-10">
                <div className="h-1 w-8 bg-indigo-500 rounded-full"></div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Professional Dossier</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
              <DetailItem icon={<FiMail />} label="Secure Email" value={profileData.email} />
              <DetailItem icon={<FiPhone />} label="Contact Line" value={profileData.phone} />
              <DetailItem icon={<FiCalendar />} label="Birth Registry" value={formatDate(profileData.dob)} />
              <DetailItem icon={<FiMapPin />} label="Region" value={`${profileData.city}, ${profileData.country}`} />
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-10">
          {/* Address Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <FiMapPin size={80} />
            </div>
            <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Residential Base</h3>
            <p className="text-xl font-bold text-slate-100 leading-relaxed tracking-tight">
               {profileData.address}, <br />
               <span className="text-slate-400">{profileData.city}, {profileData.state}</span> <br />
               <span className="text-indigo-500">{profileData.pincode}</span>
            </p>
          </div>

          {/* Emergency Card - Red Dark Variant */}
          <div className="bg-rose-950/20 border border-rose-900/30 rounded-[2.5rem] p-10 text-rose-100 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Emergency Protocol</h3>
            <p className="text-[10px] font-black uppercase text-rose-500/60 mb-1 tracking-widest">Primary Contact</p>
            <p className="text-2xl font-black mb-2 tracking-tighter">{profileData.emergencyContact.name}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 rounded-xl border border-rose-500/20">
                <FiPhone className="text-rose-500" size={14} />
                <p className="text-sm font-black text-rose-400">{profileData.emergencyContact.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component: Stat Card
const StatCard = ({ label, value, color, icon, capitalize }) => (
  <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-2xl hover:bg-slate-800/40 hover:border-slate-700 transition-all group">
    <div className={`mb-3 opacity-40 group-hover:opacity-100 transition-opacity ${color}`}>
        {icon}
    </div>
    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-base font-black ${color} ${capitalize ? "capitalize" : ""}`}>{value}</p>
  </div>
);

// Component: Detail Item
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-5 group">
    <div className="text-indigo-400 bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
        {icon}
    </div>
    <div className="space-y-1">
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">{label}</p>
      <p className="text-slate-200 font-bold text-lg tracking-tight">{value || "Unspecified"}</p>
    </div>
  </div>
);

export default Profile;