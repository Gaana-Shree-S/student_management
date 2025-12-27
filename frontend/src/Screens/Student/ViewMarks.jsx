import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";

const ViewMarks = () => {
  const userData = useSelector((state) => state.userData);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(
    userData?.semester || 1
  );
  const [marks, setMarks] = useState([]);
  const userToken = localStorage.getItem("userToken");

  const fetchMarks = async (semester) => {
    setDataLoading(true);
    toast.loading("Loading marks...");
    try {
      const response = await axiosWrapper.get(
        `/marks/student?semester=${semester}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      if (response.data.success) {
        setMarks(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching marks");
    } finally {
      setDataLoading(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    fetchMarks(userData?.semester || 1);
  }, []);

  const handleSemesterChange = (e) => {
    const semester = e.target.value;
    setSelectedSemester(semester);
    fetchMarks(semester);
  };

  const midTermMarks = marks.filter((mark) => mark.examId.examType === "mid");
  const endTermMarks = marks.filter((mark) => mark.examId.examType === "end");

  return (
    <div className="w-full max-w-7xl mx-auto mt-10 flex flex-col gap-8 mb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Heading title="View Marks" />
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Semester:</label>
          <select
            value={selectedSemester || ""}
            onChange={handleSemesterChange}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Marks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mid Term Marks */}
        <MarksCard
          title="Mid Term Marks"
          marks={midTermMarks}
          loading={dataLoading}
        />

        {/* End Term Marks */}
        <MarksCard
          title="End Term Marks"
          marks={endTermMarks}
          loading={dataLoading}
        />
      </div>
    </div>
  );
};

// Reusable card for Mid/End term marks
const MarksCard = ({ title, marks, loading }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
    <h2 className="text-xl font-semibold border-b pb-2">{title}</h2>
    {loading ? (
      <p className="text-gray-500 mt-4">Loading...</p>
    ) : marks.length > 0 ? (
      <div className="flex flex-col gap-3 mt-4">
        {marks.map((mark) => (
          <div
            key={mark._id}
            className="flex justify-between items-center border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="font-medium text-gray-800">{mark.subjectId.name}</p>
              <p className="text-sm text-gray-500">{mark.examId.name}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-blue-600">
                {mark.marksObtained}
              </p>
              <p className="text-sm text-gray-500">out of {mark.examId.totalMarks}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 mt-4">No marks available</p>
    )}
  </div>
);

export default ViewMarks;
