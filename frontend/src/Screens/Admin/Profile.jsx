import React, { useState } from "react";
import { 
  MdEmail, MdPhone, MdLocationOn, MdCake, MdWork, 
  MdSecurity, MdHealthAndSafety, MdCurrencyRupee, MdHistory 
} from "react-icons/md";
import { RiShieldUserLine, RiHeartsFill } from "react-icons/ri";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";
import CustomButton from "../../components/CustomButton";
import profileImg from "./images.jpeg";

const Profile = ({ profileData }) => {
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  if (!profileData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper component for info rows
  const InfoItem = ({ icon: Icon, label, value, colorClass = "text-blue-500" }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
      <div className={`mt-1 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-gray-800 dark:text-gray-100 font-medium break-all">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Identity Card (Sticky) */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            <div className="relative bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800 text-center overflow-hidden">
              {/* Decorative Background Element */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-700 -z-0" />
              
              <div className="relative z-10">
                <div className="relative inline-block">
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] object-cover ring-8 ring-white dark:ring-gray-900 shadow-2xl mx-auto"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900" title="Active Account"></div>
                </div>

                <div className="mt-6">
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Samrat Rana
                  </h1>
                  <p className="text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-widest mt-1">
                    {profileData.designation}
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Employee ID</p>
                    <p className="text-gray-700 dark:text-gray-200 font-mono font-bold">#{profileData.employeeId}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Status</p>
                    <p className="text-green-600 font-bold capitalize">{profileData.status}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <CustomButton
                    onClick={() => setShowUpdatePasswordModal(true)}
                    className="w-full justify-center gap-2 py-4 rounded-2xl bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 text-white shadow-lg"
                  >
                    <MdSecurity size={20} /> Change Security Key
                  </CustomButton>
                </div>
              </div>
            </div>

            {/* Role Badge Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20">
               <div className="flex items-center gap-4">
                  <RiShieldUserLine size={40} className="opacity-80" />
                  <div>
                    <p className="text-xs font-bold opacity-80 uppercase">Access Level</p>
                    <p className="text-xl font-black">{profileData.isSuperAdmin ? "Super Administrator" : "Administrator"}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Information Hub */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section: Professional Bio */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="flex items-center gap-3 text-xl font-black text-gray-800 dark:text-white mb-8">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              Core Profile Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <InfoItem icon={MdEmail} label="Primary Email" value={profileData.email} />
              <InfoItem icon={MdPhone} label="Mobile Connection" value={profileData.phone} colorClass="text-green-500" />
              <InfoItem icon={MdCake} label="Birth Anniversary" value={formatDate(profileData.dob)} colorClass="text-pink-500" />
              <InfoItem icon={MdHistory} label="Company Tenure Since" value={formatDate(profileData.joiningDate)} colorClass="text-orange-500" />
              <InfoItem icon={MdCurrencyRupee} label="Compensation" value={`₹${profileData.salary.toLocaleString()}`} colorClass="text-emerald-500" />
              <InfoItem icon={MdHealthAndSafety} label="Medical / Blood Group" value={profileData.bloodGroup} colorClass="text-red-500" />
            </div>
          </div>

          {/* Section: Residency */}
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="flex items-center gap-3 text-xl font-black text-gray-800 dark:text-white mb-8">
              <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
              Residency Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="md:col-span-2">
                <InfoItem icon={MdLocationOn} label="Street Address" value={profileData.address} colorClass="text-indigo-500" />
              </div>
              <InfoItem icon={MdWork} label="City" value={profileData.city} colorClass="text-indigo-400" />
              <InfoItem icon={MdWork} label="State / Pincode" value={`${profileData.state}, ${profileData.pincode}`} colorClass="text-indigo-400" />
            </div>
          </div>

          {/* Section: Emergency Contact */}
          <div className="bg-blue-600 dark:bg-blue-900/40 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-600/20">
            <h2 className="flex items-center gap-3 text-xl font-black mb-8">
              <RiHeartsFill size={28} className="text-red-400" />
              Emergency Protocol
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold opacity-70 uppercase mb-1">Contact Person</p>
                  <p className="text-lg font-bold">{profileData.emergencyContact.name}</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold opacity-70 uppercase mb-1">Relationship</p>
                  <p className="text-lg font-bold">{profileData.emergencyContact.relationship}</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold opacity-70 uppercase mb-1">Urgent Phone</p>
                  <p className="text-lg font-bold">{profileData.emergencyContact.phone}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {showUpdatePasswordModal && (
        <UpdatePasswordLoggedIn onClose={() => setShowUpdatePasswordModal(false)} />
      )}
    </div>
  );
};

export default Profile;