import React, { useState } from "react";
import { 
  FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, 
  FiShield, FiDroplet, FiBook, FiLock, FiGlobe, FiSmartphone, FiHash 
} from "react-icons/fi";
import CustomButton from "../../components/CustomButton";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";

const Profile = ({ profileData }) => {
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  
  if (!profileData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0f1c] text-slate-300 py-10 px-4 md:px-8 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION: Clean & Minimal (Banner Removed) */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-16 pb-10 border-b border-white/5">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <img
                    src={`${process.env.REACT_APP_MEDIA_LINK}/${profileData.profile}`}
                    alt="Profile"
                    className="relative w-40 h-40 md:w-48 md:h-48 rounded-[2.2rem] object-cover border-4 border-[#0a0f1c] shadow-2xl"
                />
                <div className="absolute bottom-4 right-4 bg-emerald-500 w-5 h-5 rounded-full border-4 border-[#0a0f1c] shadow-lg animate-pulse"></div>
            </div>
            
            <div className="text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <FiHash className="text-indigo-400 text-xs" />
                <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  {profileData.enrollmentNo}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                {profileData.firstName} <span className="text-indigo-500">{profileData.lastName}</span>
              </h1>
              <p className="text-slate-400 font-bold flex items-center justify-center md:justify-start gap-2">
                 <FiBook className="text-indigo-500" /> {profileData.branchId.name} 
                 <span className="mx-2 text-slate-700">|</span> 
                 <span className="text-emerald-400 uppercase text-xs tracking-widest">Semester {profileData.semester}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
              showPasswordUpdate 
              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
              : "bg-white text-slate-900 hover:bg-indigo-500 hover:text-white"
            }`}
          >
            <FiLock />
            {showPasswordUpdate ? "Cancel" : "Security Settings"}
          </button>
        </div>

        {showPasswordUpdate && (
          <div className="mb-12 animate-in zoom-in-95 duration-300">
              <UpdatePasswordLoggedIn onClose={() => setShowPasswordUpdate(false)} />
          </div>
        )}

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Info Box */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32"></div>
                
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 text-xl border border-indigo-500/20">
                    <FiUser />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Identity Vault</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    <ProfileItem icon={<FiMail />} label="Communication" value={profileData.email} />
                    <ProfileItem icon={<FiSmartphone />} label="Mobile" value={profileData.phone} />
                    <ProfileItem icon={<FiDroplet />} label="Bio Group" value={profileData.bloodGroup} color="text-rose-400" />
                    <ProfileItem icon={<FiCalendar />} label="Birth Registry" value={formatDate(profileData.dob)} />
                    <ProfileItem icon={<FiUser />} label="Gender" value={profileData.gender} capitalize />
                    <ProfileItem icon={<FiGlobe />} label="Nationality" value={profileData.country || "Indian"} />
                </div>
            </div>

            {/* Address Box */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 text-xl border border-emerald-500/20">
                    <FiMapPin />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Geo Location</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="md:col-span-2">
                      <ProfileItem icon={<FiMapPin />} label="Residential" value={profileData.address} />
                    </div>
                    <ProfileItem icon={<FiGlobe />} label="Regional Hub" value={`${profileData.city}, ${profileData.state}`} />
                    <ProfileItem icon={<FiHash />} label="Postal Code" value={profileData.pincode} />
                </div>
            </div>
          </div>

          {/* SOS Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-b from-indigo-600 to-indigo-800 rounded-[3rem] p-10 text-white sticky top-8 shadow-2xl shadow-indigo-500/20 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all duration-700"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl mb-12 border border-white/20">
                    <FiShield />
                  </div>
                  
                  <h2 className="text-3xl font-black leading-tight mb-8">Emergency<br/>Protocol</h2>

                  <div className="space-y-8">
                    <div className="p-6 bg-white/10 rounded-[2rem] border border-white/10">
                      <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-2">Primary Guardian</p>
                      <p className="text-xl font-black">{profileData.emergencyContact.name}</p>
                      <div className="mt-4 flex items-center gap-2 text-indigo-100 font-bold text-sm">
                         <span className="px-2 py-0.5 bg-indigo-500 rounded text-[10px]">{profileData.emergencyContact.relationship}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] px-2">Direct Link</p>
                      <a 
                        href={`tel:${profileData.emergencyContact.phone}`}
                        className="flex items-center justify-center gap-3 py-5 bg-white text-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl"
                      >
                        <FiPhone /> Launch Call
                      </a>
                    </div>
                  </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value, capitalize, color }) => (
  <div className="group space-y-2">
    <div className="flex items-center gap-2">
      <span className="text-slate-600 group-hover:text-indigo-400 transition-colors">{icon}</span>
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
        {label}
      </label>
    </div>
    <p className={`text-base font-bold ${color || "text-slate-200"} ${capitalize ? "capitalize" : ""} leading-relaxed`}>
      {value || "Undefined"}
    </p>
  </div>
);

export default Profile;