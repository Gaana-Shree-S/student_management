import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit, MdEmail, MdPhone, MdBadge } from "react-icons/md";
import { IoMdAdd, IoMdClose, IoIosPerson } from "react-icons/io";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";

const Admin = () => {
  // --- LOGIC REMAINS UNCHANGED ---
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", phone: "", profile: "",
    address: "", city: "", state: "", pincode: "", country: "",
    gender: "", dob: "", designation: "", joiningDate: "",
    salary: "", status: "active",
    emergencyContact: { name: "", relationship: "", phone: "" },
    bloodGroup: "",
  });
  const [admins, setAdmins] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const userToken = localStorage.getItem("userToken");
  const [file, setFile] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => { getAdminsHandler(); }, []);

  const getAdminsHandler = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(`/admin`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) { setAdmins(response.data.data); }
      else { toast.error(response.data.message); }
    } catch (error) {
      if (error.response?.status === 404) { setAdmins([]); return; }
      toast.error(error.response?.data?.message || "Error fetching admins");
    } finally { setDataLoading(false); }
  };

  const addAdminHandler = async () => {
    try {
      toast.loading(isEditing ? "Updating Admin" : "Adding Admin");
      const headers = { "Content-Type": "multipart/form-data", Authorization: `Bearer ${userToken}` };
      const formData = new FormData();
      for (const key in data) {
        if (key === "emergencyContact") {
          for (const subKey in data.emergencyContact) {
            formData.append(`emergencyContact[${subKey}]`, data.emergencyContact[subKey]);
          }
        } else { formData.append(key, data[key]); }
      }
      if (file) { formData.append("file", file); }

      let response;
      if (isEditing) {
        response = await axiosWrapper.patch(`/admin/${selectedAdminId}`, formData, { headers });
      } else {
        response = await axiosWrapper.post(`/admin/register`, formData, { headers });
      }

      toast.dismiss();
      if (response.data.success) {
        toast.success(isEditing ? response.data.message : "Admin created! Pass: admin123");
        resetForm();
        getAdminsHandler();
      } else { toast.error(response.data.message); }
    } catch (error) { toast.dismiss(); toast.error(error.response?.data?.message || "Error"); }
  };

  const deleteAdminHandler = (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedAdminId(id);
  };

  const editAdminHandler = (admin) => {
    setData({
      firstName: admin.firstName || "", lastName: admin.lastName || "",
      email: admin.email || "", phone: admin.phone || "", profile: admin.profile || "",
      address: admin.address || "", city: admin.city || "", state: admin.state || "",
      pincode: admin.pincode || "", country: admin.country || "", gender: admin.gender || "",
      dob: admin.dob?.split("T")[0] || "", designation: admin.designation || "",
      joiningDate: admin.joiningDate?.split("T")[0] || "", salary: admin.salary || "",
      status: admin.status || "active",
      emergencyContact: {
        name: admin.emergencyContact?.name || "",
        relationship: admin.emergencyContact?.relationship || "",
        phone: admin.emergencyContact?.phone || "",
      },
      bloodGroup: admin.bloodGroup || "",
    });
    setSelectedAdminId(admin._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Admin");
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` };
      const response = await axiosWrapper.delete(`/admin/${selectedAdminId}`, { headers });
      toast.dismiss();
      if (response.data.success) {
        toast.success("Admin deleted");
        setIsDeleteConfirmOpen(false);
        getAdminsHandler();
      }
    } catch (error) { toast.dismiss(); toast.error("Error deleting admin"); }
  };

  const resetForm = () => {
    setData({
      firstName: "", lastName: "", email: "", phone: "", profile: "", address: "",
      city: "", state: "", pincode: "", country: "", gender: "", dob: "",
      designation: "", joiningDate: "", salary: "", status: "active",
      emergencyContact: { name: "", relationship: "", phone: "" }, bloodGroup: "",
    });
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedAdminId(null);
    setFile(null);
  };

  const handleInputChange = (field, value) => { setData({ ...data, [field]: value }); };
  const handleEmergencyContactChange = (field, value) => {
    setData({ ...data, emergencyContact: { ...data.emergencyContact, [field]: value } });
  };

  // --- NEW UI RENDERING ---
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <Heading title="Personnel Directory" />
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage system administrators and staff roles.</p>
        </div>
        <CustomButton
          onClick={() => (showAddForm ? resetForm() : setShowAddForm(true))}
          className={`flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${showAddForm ? 'bg-gray-600' : ''}`}
        >
          {showAddForm ? <IoMdClose /> : <IoMdAdd />} 
          {showAddForm ? "Close Form" : "Create New Admin"}
        </CustomButton>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar: Form (Conditional) */}
        {showAddForm && (
          <div className="lg:col-span-4 animate-in slide-in-from-left duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                {isEditing ? <MdEdit className="text-blue-500"/> : <IoMdAdd className="text-green-500"/>}
                {isEditing ? "Modify Profile" : "Identity Setup"}
              </h3>
              
              <form onSubmit={(e) => { e.preventDefault(); addAdminHandler(); }} className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                   <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden relative group">
                      {file ? (
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                      ) : <IoIosPerson className="text-4xl text-gray-400" />}
                      <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                      />
                   </div>
                   <span className="text-xs text-gray-500 mt-2">Upload Photo</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="First Name" className="form-input-custom" value={data.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
                  <input placeholder="Last Name" className="form-input-custom" value={data.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
                </div>
                
                <input placeholder="Email Address" type="email" className="form-input-custom" value={data.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                <input placeholder="Phone Number" className="form-input-custom" value={data.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
                
                <div className="grid grid-cols-2 gap-3">
                    <select className="form-input-custom" value={data.gender} onChange={(e) => handleInputChange("gender", e.target.value)} required>
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <input type="date" className="form-input-custom" value={data.dob} onChange={(e) => handleInputChange("dob", e.target.value)} required />
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Employment</p>
                  <input placeholder="Designation" className="form-input-custom mb-3" value={data.designation} onChange={(e) => handleInputChange("designation", e.target.value)} />
                  <input placeholder="Salary" type="number" className="form-input-custom" value={data.salary} onChange={(e) => handleInputChange("salary", e.target.value)} />
                </div>

                <div className="flex gap-2 pt-4">
                  <CustomButton type="submit" className="w-full justify-center py-3">
                    {isEditing ? "Save Changes" : "Register Admin"}
                  </CustomButton>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Right Side: Directory Cards */}
        <div className={`${showAddForm ? 'lg:col-span-8' : 'lg:col-span-12'} w-full`}>
          {dataLoading ? (
            <div className="h-64 flex items-center justify-center"><Loading /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {admins.length > 0 ? (
                admins.map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                        {item.firstName[0]}{item.lastName[0]}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => editAdminHandler(item)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition">
                          <MdEdit size={18}/>
                        </button>
                        <button onClick={() => deleteAdminHandler(item._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition">
                          <MdOutlineDelete size={18}/>
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                        {item.firstName} {item.lastName}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 font-medium uppercase tracking-wider">
                        {item.designation || 'Staff'}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <MdEmail className="text-blue-500/70" /> {item.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <MdPhone className="text-green-500/70" /> {item.phone}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <MdBadge className="text-purple-500/70" /> {item.employeeId}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                   <p className="text-gray-400">No administrators found in the system.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="This action cannot be undone. Delete this profile?"
      />

      {/* Internal CSS for custom inputs */}
      <style jsx>{`
        .form-input-custom {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .form-input-custom:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        :global(.dark) .form-input-custom {
          background: #111827;
          border-color: #374151;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Admin;