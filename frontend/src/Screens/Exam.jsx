import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit, MdOutlineLayers } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { FiCalendar, FiUpload, FiDownloadCloud, FiClock } from "react-icons/fi";
import { useSelector } from "react-redux";
import axiosWrapper from "../utils/AxiosWrapper";
import Heading from "../components/Heading";
import DeleteConfirm from "../components/DeleteConfirm";
import Loading from "../components/Loading";

const Exam = () => {
  const [data, setData] = useState({
    name: "",
    date: "",
    semester: "",
    examType: "mid",
    timetableLink: "",
    totalMarks: "",
  });
  const [exams, setExams] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const userData = useSelector((state) => state.userData);
  const loginType = localStorage.getItem("userType");
  const [processLoading, setProcessLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    getExamsHandler();
  }, []);

  const getExamsHandler = async () => {
    try {
      setDataLoading(true);
      let link = "/exam";
      if (userData.semester) {
        link = `/exam?semester=${userData.semester}`;
      }
      const response = await axiosWrapper.get(link, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if (response.data.success) {
        setExams(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setExams([]);
        return;
      }
      toast.error(error.response?.data?.message || "Error fetching exams");
    } finally {
      setDataLoading(false);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const addExamHandler = async () => {
    if (!data.name || !data.date || !data.semester || !data.examType || !data.totalMarks) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      setProcessLoading(true);
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      };
      let response;
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("date", data.date);
      formData.append("semester", data.semester);
      formData.append("examType", data.examType);
      formData.append("totalMarks", data.totalMarks);
      formData.append("file", file);
      if (isEditing) {
        response = await axiosWrapper.patch(`/exam/${selectedExamId}`, formData, { headers });
      } else {
        response = await axiosWrapper.post(`/exam`, formData, { headers });
      }
      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        getExamsHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setProcessLoading(false);
    }
  };

  const resetForm = () => {
    setData({
      name: "",
      date: "",
      semester: "",
      examType: "mid",
      timetableLink: "",
      totalMarks: "",
    });
    setFile(null);
    setShowModal(false);
    setIsEditing(false);
    setSelectedExamId(null);
  };

  const deleteExamHandler = (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedExamId(id);
  };

  const editExamHandler = (exam) => {
    setData({
      name: exam.name,
      date: new Date(exam.date).toISOString().split("T")[0],
      semester: exam.semester,
      examType: exam.examType,
      timetableLink: exam.timetableLink,
      totalMarks: exam.totalMarks,
    });
    setSelectedExamId(exam._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axiosWrapper.delete(`/exam/${selectedExamId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      if (response.data.success) {
        toast.success("Exam has been deleted successfully");
        setIsDeleteConfirmOpen(false);
        getExamsHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0f1c] text-slate-300 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-indigo-500 rounded-full"></div>
              <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">Examination Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Academic <span className="text-indigo-500">Timeline.</span></h1>
            <p className="text-slate-500 font-medium">Coordinate and track upcoming assessments.</p>
          </div>
          
          {!dataLoading && loginType !== "Student" && (
            <button
              onClick={() => setShowModal(true)}
              className="group relative flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-indigo-500 hover:text-white shadow-xl active:scale-95"
            >
              <IoMdAdd className="text-xl group-hover:rotate-90 transition-transform" />
              Slot New Exam
            </button>
          )}
        </div>

        {dataLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loading />
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-8 animate-pulse">Syncing Encrypted Records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams && exams.length > 0 ? (
              exams.map((item, index) => {
                const examDate = new Date(item.date);
                const isMid = item.examType === "mid";

                return (
                  <div 
                    key={index} 
                    className="group relative bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-white/5 p-8 hover:border-indigo-500/30 transition-all duration-500 hover:bg-slate-900/60"
                  >
                    {/* Exam Category Chip */}
                    <div className={`absolute top-8 right-8 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${isMid ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                      {isMid ? "Internal" : "External"}
                    </div>

                    {/* Date Badge */}
                    <div className="flex items-center gap-5 mb-10">
                      <div className="flex flex-col items-center justify-center w-16 h-16 bg-white text-slate-900 rounded-2xl shadow-xl group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">
                          {examDate.toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black leading-none">
                          {examDate.getDate()}
                        </span>
                      </div>
                      <div className="max-w-[150px]">
                        <h3 className="text-xl font-black text-white leading-tight group-hover:text-indigo-400 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                          <MdOutlineLayers className="text-sm text-indigo-500" /> Sem {item.semester}
                        </p>
                      </div>
                    </div>

                    {/* Detail Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Weightage</p>
                        <p className="text-sm font-black text-slate-200">{item.totalMarks} Marks</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Cycle</p>
                        <p className="text-sm font-black text-slate-200">{examDate.getFullYear()}</p>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                      {item.timetableLink ? (
                         <a 
                          href={`${process.env.REACT_APP_MEDIA_LINK}/${item.timetableLink}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                         >
                           <FiDownloadCloud className="text-lg" /> Get Schedule
                         </a>
                      ) : <span className="text-[9px] font-bold text-slate-600 uppercase italic">File Pending</span>}

                      {loginType !== "Student" && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => editExamHandler(item)}
                            className="p-3 rounded-xl bg-white/5 text-slate-400 hover:bg-indigo-500 hover:text-white transition-all"
                          >
                            <MdEdit />
                          </button>
                          <button 
                            onClick={() => deleteExamHandler(item._id)}
                            className="p-3 rounded-xl bg-white/5 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"
                          >
                            <MdOutlineDelete />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-32 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl mb-6 border border-white/5 text-slate-700">
                  <FiCalendar className="text-4xl" />
                </div>
                <p className="text-slate-500 font-black text-xs uppercase tracking-[0.4em]">No Assessments Slotted</p>
              </div>
            )}
          </div>
        )}

        {/* MODAL: Cyber Form */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-300">
            <div className="bg-[#0d1425] border border-white/10 rounded-[3rem] p-8 md:p-12 w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <button onClick={resetForm} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                <AiOutlineClose size={24} />
              </button>

              <div className="mb-12">
                <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em]">Master Schedule</span>
                <h2 className="text-3xl font-black text-white tracking-tighter mt-2">
                  {isEditing ? "Modify Record" : "New Assessment"}
                </h2>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Exam Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Unit Test I"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-indigo-500 transition-all font-bold text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Calendar Date</label>
                    <input
                      type="date"
                      value={data.date}
                      onChange={(e) => setData({ ...data, date: e.target.value })}
                      className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-indigo-500 transition-all font-bold text-white outline-none [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Semester</label>
                    <select
                      value={data.semester}
                      onChange={(e) => setData({ ...data, semester: e.target.value })}
                      className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-indigo-500 transition-all font-bold text-white outline-none appearance-none"
                    >
                      <option value="" className="bg-slate-900">Select Term</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem} className="bg-slate-900">Semester 0{sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Type</label>
                    <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                      <button 
                        onClick={() => setData({ ...data, examType: "mid" })}
                        className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${data.examType === "mid" ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500'}`}
                      >Internal</button>
                      <button 
                        onClick={() => setData({ ...data, examType: "end" })}
                        className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${data.examType === "end" ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500'}`}
                      >External</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Max Weight</label>
                    <input
                      type="number"
                      value={data.totalMarks}
                      onChange={(e) => setData({ ...data, totalMarks: e.target.value })}
                      className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-indigo-500 transition-all font-bold text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">Attached Schedule</label>
                  <label className="flex items-center justify-between w-full px-6 py-5 bg-indigo-500/5 border border-dashed border-indigo-500/30 rounded-2xl cursor-pointer hover:bg-indigo-500/10 transition-all group">
                    <span className="text-xs font-bold text-indigo-400 truncate max-w-[80%]">
                      {file ? file.name : "Upload Timetable (PDF/JPG)"}
                    </span>
                    <FiUpload className="text-indigo-500 group-hover:scale-125 transition-transform" />
                    <input type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={resetForm} className="flex-1 py-5 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">Discard</button>
                  <button 
                    onClick={addExamHandler} 
                    disabled={processLoading}
                    className="flex-[2] py-5 bg-white text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 hover:bg-indigo-500 hover:text-white"
                  >
                    {isEditing ? "Apply Revisions" : "Initialize Exam"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <DeleteConfirm
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this exam record?"
        />
      </div>
    </div>
  );
};

export default Exam;