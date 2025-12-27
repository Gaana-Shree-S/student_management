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
    <div className="max-w-6xl mx-auto p-6 sm:p-8 flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 border-b pb-6">
        <div className="flex items-center gap-6">
          <img
            src={`${process.env.REACT_APP_MEDIA_LINK}/${profileData.profile}`}
            alt="Profile"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-blue-400 ring-offset-2"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
              {`${profileData.firstName} ${profileData.middleName} ${profileData.lastName}`}
            </h1>
            <p className="text-sm md:text-lg text-gray-600">{profileData.enrollmentNo}</p>
            <p className="text-sm md:text-lg text-blue-600 font-medium">{profileData.branchId.name}</p>
          </div>
        </div>
        <div>
          <CustomButton
            onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
            variant="primary"
            className="transition transform hover:scale-105"
          >
            {showPasswordUpdate ? "Hide" : "Update Password"}
          </CustomButton>
        </div>
        {showPasswordUpdate && <UpdatePasswordLoggedIn onClose={() => setShowPasswordUpdate(false)} />}
      </div>

      <div className="flex flex-col gap-8">
        {/* Personal Information */}
        <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoRow label="Email" value={profileData.email} />
            <InfoRow label="Phone" value={profileData.phone} />
            <InfoRow label="Gender" value={profileData.gender} capitalize />
            <InfoRow label="Blood Group" value={profileData.bloodGroup} />
            <InfoRow label="Date of Birth" value={formatDate(profileData.dob)} />
            <InfoRow label="Semester" value={profileData.semester} />
          </div>
        </section>

        {/* Address Information */}
        <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoRow label="Address" value={profileData.address} />
            <InfoRow label="City" value={profileData.city} />
            <InfoRow label="State" value={profileData.state} />
            <InfoRow label="Pincode" value={profileData.pincode} />
            <InfoRow label="Country" value={profileData.country} />
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoRow label="Name" value={profileData.emergencyContact.name} />
            <InfoRow label="Relationship" value={profileData.emergencyContact.relationship} />
            <InfoRow label="Phone" value={profileData.emergencyContact.phone} />
          </div>
        </section>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, capitalize }) => (
  <div>
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <p className={`text-gray-900 ${capitalize ? "capitalize" : ""}`}>{value}</p>
  </div>
);

export default Profile;
