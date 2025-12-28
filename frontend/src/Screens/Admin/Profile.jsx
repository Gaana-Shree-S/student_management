import React, { useState } from "react";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";
import CustomButton from "../../components/CustomButton";
import profileImg from "./images.jpeg";

const Profile = ({ profileData }) => {
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  if (!profileData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 transition-all duration-300">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <img
            src={profileImg}
            alt="Profile"
            className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-blue-500 ring-offset-2 shadow-md"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
              {` Samrat Rana`}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Employee ID: <span className="font-semibold">{profileData.employeeId}</span>
            </p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1 text-lg">
              {profileData.designation}
              {profileData.isSuperAdmin && " (Super Admin)"}
            </p>
          </div>
        </div>
        <CustomButton
          onClick={() => setShowUpdatePasswordModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-90 transition-all rounded-lg shadow-md"
        >
          Update Password
        </CustomButton>

        {showUpdatePasswordModal && (
          <UpdatePasswordLoggedIn onClose={() => setShowUpdatePasswordModal(false)} />
        )}
      </div>

      {/* Information Sections */}
      <div className="grid grid-cols-1 gap-10">
        {/* Personal Information */}
        <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-6 transition-all hover:shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["Email", profileData.email],
              ["Phone", profileData.phone],
              ["Gender", profileData.gender],
              ["Blood Group", profileData.bloodGroup],
              ["Date of Birth", formatDate(profileData.dob)],
              ["Joining Date", formatDate(profileData.joiningDate)],
              ["Salary", `₹${profileData.salary.toLocaleString()}`],
              ["Status", profileData.status],
              ["Role", profileData.isSuperAdmin ? "Super Admin" : "Admin"],
            ].map(([label, value], index) => (
              <div key={index}>
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {label}
                </label>
                <p className="text-gray-900 dark:text-gray-100 capitalize">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-6 transition-all hover:shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
            Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["Address", profileData.address],
              ["City", profileData.city],
              ["State", profileData.state],
              ["Pincode", profileData.pincode],
              ["Country", profileData.country],
            ].map(([label, value], index) => (
              <div key={index}>
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {label}
                </label>
                <p className="text-gray-900 dark:text-gray-100">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-6 transition-all hover:shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["Name", profileData.emergencyContact.name],
              ["Relationship", profileData.emergencyContact.relationship],
              ["Phone", profileData.emergencyContact.phone],
            ].map(([label, value], index) => (
              <div key={index}>
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {label}
                </label>
                <p className="text-gray-900 dark:text-gray-100">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
