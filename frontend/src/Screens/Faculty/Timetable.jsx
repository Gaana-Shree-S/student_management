import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { MdOutlineDelete, MdEdit, MdLink } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import Heading from "../../components/Heading";
import toast from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";

const AddTimetableModal = ({ isOpen, onClose, onSubmit, initialData = null, branches }) => {
  const [formData, setFormData] = useState({
    branch: initialData?.branch || "",
    semester: initialData?.semester || "",
    file: null,
    previewUrl: initialData?.file || "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[480px] max-h-[90vh] overflow-y-auto p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {initialData ? "Edit Timetable" : "Add New Timetable"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <IoMdClose className="text-3xl" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-600">Branch</label>
            <select
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Branch</option>
              {branches?.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-600">Semester</label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-600">Timetable File</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-gray-700"
            />
          </div>

          {formData.previewUrl && (
            <div className="mt-4 border rounded-lg p-2 bg-gray-50 flex justify-center">
              <img src={formData.previewUrl} alt="Preview" className="max-h-60 object-contain" />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton variant="secondary" onClick={onClose}>
              Cancel
            </CustomButton>
            <CustomButton variant="primary" onClick={handleSubmit}>
              {initialData ? "Update" : "Add"}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const Timetable = () => {
  const [branch, setBranch] = useState();
  const [timetables, setTimetables] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTimetableId, setSelectedTimetableId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    getBranchHandler();
    getTimetablesHandler();
  }, []);

  const getBranchHandler = async () => {
    try {
      const response = await axiosWrapper.get(`/branch`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) setBranch(response.data.data);
      else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching branches");
    }
  };

  const getTimetablesHandler = async () => {
    try {
      const response = await axiosWrapper.get(`/timetable`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) setTimetables(response.data.data);
      else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching timetables");
    }
  };

  const handleSubmitTimetable = async (formData) => {
    const headers = { "Content-Type": "multipart/form-data", Authorization: `Bearer ${userToken}` };
    const submitData = new FormData();
    submitData.append("branch", formData.branch);
    submitData.append("semester", formData.semester);
    if (formData.file) submitData.append("file", formData.file);

    try {
      toast.loading(editingTimetable ? "Updating Timetable" : "Adding Timetable");
      let response;
      if (editingTimetable) {
        response = await axiosWrapper.put(`/timetable/${editingTimetable._id}`, submitData, { headers });
      } else {
        response = await axiosWrapper.post("/timetable", submitData, { headers });
      }
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        getTimetablesHandler();
        setShowAddModal(false);
        setEditingTimetable(null);
      } else toast.error(response.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error with timetable");
    }
  };

  const deleteTimetableHandler = (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedTimetableId(id);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Timetable");
      const response = await axiosWrapper.delete(`/timetable/${selectedTimetableId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      toast.dismiss();
      if (response.data.success) {
        toast.success("Timetable deleted successfully");
        setIsDeleteConfirmOpen(false);
        getTimetablesHandler();
      } else toast.error(response.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error deleting timetable");
    }
  };

  const editTimetableHandler = (timetable) => {
    setEditingTimetable(timetable);
    setShowAddModal(true);
  };

  return (
    <div className="w-full mx-auto mt-10 flex flex-col gap-6 mb-10">
      <div className="flex justify-between items-center">
        <Heading title="Timetable Management" />
        <CustomButton onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <IoMdAdd className="text-2xl" />
          Add Timetable
        </CustomButton>
      </div>

      <div className="overflow-x-auto w-full bg-white rounded-xl shadow-md">
        <table className="min-w-full text-left text-gray-700">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6">View</th>
              <th className="py-3 px-6">Branch</th>
              <th className="py-3 px-6">Semester</th>
              <th className="py-3 px-6">Created At</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetables.map((item) => (
              <tr key={item._id} className="border-b hover:bg-blue-50 transition-colors">
                <td className="py-3 px-6">
                  <a
                    href={`${process.env.REACT_APP_MEDIA_LINK}/${item.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl text-blue-600 hover:text-blue-800"
                  >
                    <MdLink />
                  </a>
                </td>
                <td className="py-3 px-6">{item.branch.name}</td>
                <td className="py-3 px-6">{item.semester}</td>
                <td className="py-3 px-6">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-6 text-center flex justify-center gap-2">
                  <CustomButton variant="secondary" onClick={() => editTimetableHandler(item)}>
                    <MdEdit />
                  </CustomButton>
                  <CustomButton variant="danger" onClick={() => deleteTimetableHandler(item._id)}>
                    <MdOutlineDelete />
                  </CustomButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddTimetableModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTimetable(null);
        }}
        onSubmit={handleSubmitTimetable}
        initialData={editingTimetable}
        branches={branch}
      />

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this timetable?"
      />
    </div>
  );
};

export default Timetable;
