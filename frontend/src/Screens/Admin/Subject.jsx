import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import { CgDanger } from "react-icons/cg";
import Loading from "../../components/Loading";

const Subject = () => {
  const [data, setData] = useState({
    name: "",
    code: "",
    branch: "",
    semester: "",
    credits: "",
  });
  const [subject, setSubject] = useState([]);
  const [branch, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const userToken = localStorage.getItem("userToken");
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    getSubjectHandler();
    getBranchHandler();
  }, []);

  const getSubjectHandler = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(`/subject`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) setSubject(response.data.data);
      else toast.error(response.data.message);
    } catch (error) {
      if (error.response?.status === 404) setSubject([]);
      else toast.error(error.response?.data?.message || "Error fetching subjects");
    } finally {
      setDataLoading(false);
    }
  };

  const getBranchHandler = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(`/branch`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) setBranches(response.data.data);
      else toast.error(response.data.message);
    } catch (error) {
      if (error.response?.status === 404) setBranches([]);
      else toast.error(error.response?.data?.message || "Error fetching branches");
    } finally {
      setDataLoading(false);
    }
  };

  const addSubjectHandler = async () => {
    if (!data.name || !data.code || !data.branch || !data.semester || !data.credits) {
      toast.dismiss();
      toast.error("Please fill all the fields");
      return;
    }

    try {
      setDataLoading(true);
      toast.loading(isEditing ? "Updating Subject" : "Adding Subject");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };

      let response;
      if (isEditing)
        response = await axiosWrapper.patch(`/subject/${selectedSubjectId}`, data, { headers });
      else response = await axiosWrapper.post(`/subject`, data, { headers });

      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        getSubjectHandler();
      } else toast.error(response.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setDataLoading(false);
    }
  };

  const resetForm = () => {
    setData({ name: "", code: "", branch: "", semester: "", credits: "" });
    setShowModal(false);
    setIsEditing(false);
    setSelectedSubjectId(null);
  };

  const deleteSubjectHandler = (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedSubjectId(id);
  };

  const editSubjectHandler = (subject) => {
    setData({
      name: subject.name,
      code: subject.code,
      branch: subject.branch?._id,
      semester: subject.semester,
      credits: subject.credits,
    });
    setSelectedSubjectId(subject._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDataLoading(true);
      toast.loading("Deleting Subject");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };
      const response = await axiosWrapper.delete(`/subject/${selectedSubjectId}`, { headers });
      toast.dismiss();
      if (response.data.success) {
        toast.success("Subject deleted successfully");
        setIsDeleteConfirmOpen(false);
        getSubjectHandler();
      } else toast.error(response.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-10 flex flex-col justify-start items-start mb-10">
      <div className="flex justify-between items-center w-full mb-6">
        <Heading title="Subject Management" />
        {branch.length > 0 && (
          <CustomButton
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:opacity-90 transition-all"
          >
            <IoMdAdd className="text-2xl" />
          </CustomButton>
        )}
      </div>

      {dataLoading && <Loading />}

      {!dataLoading && branch.length === 0 && (
        <div className="flex flex-col justify-center items-center text-center w-full mt-24">
          <CgDanger className="w-16 h-16 text-yellow-500 mb-4" />
          <p className="text-lg text-gray-700 font-medium">
            Please add branches before adding a subject.
          </p>
        </div>
      )}

      {!dataLoading && branch.length > 0 && (
        <div className="mt-8 w-full bg-white/70 backdrop-blur-md shadow-md border border-gray-100 rounded-2xl p-4 md:p-6">
          {subject.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-base">
              No subjects found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <tr>
                    {["Name", "Code", "Branch", "Semester", "Credits", "Actions"].map(
                      (header) => (
                        <th
                          key={header}
                          className="py-4 px-6 text-left font-semibold text-sm tracking-wide"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {subject.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-blue-50 transition-all duration-200"
                    >
                      <td className="py-3 px-6 text-gray-800">{item.name}</td>
                      <td className="py-3 px-6 text-gray-800">{item.code}</td>
                      <td className="py-3 px-6 text-gray-800">{item.branch?.name}</td>
                      <td className="py-3 px-6 text-gray-800">{item.semester}</td>
                      <td className="py-3 px-6 text-gray-800">{item.credits}</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex justify-center gap-3">
                          <CustomButton
                            variant="secondary"
                            className="!p-2"
                            onClick={() => editSubjectHandler(item)}
                          >
                            <MdEdit />
                          </CustomButton>
                          <CustomButton
                            variant="danger"
                            className="!p-2"
                            onClick={() => deleteSubjectHandler(item._id)}
                          >
                            <MdOutlineDelete />
                          </CustomButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative border border-gray-100">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            >
              <AiOutlineClose size={22} />
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              {isEditing ? "Edit Subject" : "Add New Subject"}
            </h2>

            <div className="space-y-4">
              {[
                ["Subject Name", "name", "text"],
                ["Subject Code", "code", "text"],
              ].map(([label, key, type]) => (
                <div key={key}>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={data[key]}
                    onChange={(e) => setData({ ...data, [key]: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Branch
                </label>
                <select
                  value={data.branch}
                  onChange={(e) => setData({ ...data, branch: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Branch</option>
                  {branch.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Semester
                  </label>
                  <select
                    value={data.semester}
                    onChange={(e) => setData({ ...data, semester: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
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
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Credits
                  </label>
                  <input
                    type="number"
                    value={data.credits}
                    onChange={(e) => setData({ ...data, credits: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <CustomButton
                  onClick={resetForm}
                  variant="secondary"
                  className="!py-2 !px-6"
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  onClick={addSubjectHandler}
                  disabled={dataLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:opacity-90 !py-2 !px-6"
                >
                  {isEditing ? "Update Subject" : "Add Subject"}
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this subject?"
      />
    </div>
  );
};

export default Subject;
