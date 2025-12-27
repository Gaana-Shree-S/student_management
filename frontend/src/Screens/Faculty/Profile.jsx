import React, { useState } from "react";
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
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-white shadow-lg rounded-xl p-6 md:p-8">
        <img
          src={`${process.env.REACT_APP_MEDIA_LINK}/${profileData.profile}`}
          alt="Profile"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-blue-500 ring-offset-2"
        />
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {`${profileData.firstName} ${profileData.lastName}`}
          </h1>
          <p className="text-gray-600 mt-1">Employee ID: {profileData.employeeId}</p>
          <p className="text-blue-600 font-semibold mt-1">{profileData.designation}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <CustomButton
            onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
            variant="primary"
            className="px-5 py-2"
          >
            {showPasswordUpdate ? "Hide" : "Update Password"}
          </CustomButton>
        </div>
        {showPasswordUpdate && (
          <div className="w-full mt-4 md:mt-6">
            <UpdatePasswordLoggedIn onClose={() => setShowPasswordUpdate(false)} />
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 gap-8">
        {/* Personal Information */}
        <SectionCard title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Info label="Email" value={profileData.email} />
            <Info label="Phone" value={profileData.phone} />
            <Info label="Gender" value={profileData.gender} capitalize />
            <Info label="Blood Group" value={profileData.bloodGroup} />
            <Info label="Date of Birth" value={formatDate(profileData.dob)} />
            <Info label="Joining Date" value={formatDate(profileData.joiningDate)} />
            <Info label="Salary" value={`₹${profileData.salary.toLocaleString()}`} />
            <Info label="Status" value={profileData.status} capitalize />
          </div>
        </SectionCard>

        {/* Address Information */}
        <SectionCard title="Address Information">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Info label="Address" value={profileData.address} />
            <Info label="City" value={profileData.city} />
            <Info label="State" value={profileData.state} />
            <Info label="Pincode" value={profileData.pincode} />
            <Info label="Country" value={profileData.country} />
          </div>
        </SectionCard>

        {/* Emergency Contact */}
        <SectionCard title="Emergency Contact">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Info label="Name" value={profileData.emergencyContact.name} />
            <Info label="Relationship" value={profileData.emergencyContact.relationship} />
            <Info label="Phone" value={profileData.emergencyContact.phone} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

// Reusable Section Card
const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md p-6 md:p-8 hover:shadow-lg transition-shadow duration-300">
    <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
      {title}
    </h2>
    {children}
  </div>
);

// Reusable Info Component
const Info = ({ label, value, capitalize }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className={`text-gray-900 ${capitalize ? "capitalize" : ""}`}>{value}</p>
  </div>
);

export default Profile;
