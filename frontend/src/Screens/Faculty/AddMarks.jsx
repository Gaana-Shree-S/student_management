import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import { HiOutlineSearch, HiOutlineArrowLeft, HiOutlineBadgeCheck, HiOutlineInformationCircle, HiOutlineTerminal } from "react-icons/hi";
import { MdOutlineAppRegistration } from "react-icons/md";
import { FiTarget, FiHash } from "react-icons/fi";

const AddMarks = () => {
  const [branches, setBranches] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const userToken = localStorage.getItem("userToken");
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [masterMarksData, setMasterMarksData] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [consent, setConsent] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "branch") {
      const branch = branches.find((b) => b._id === value);
      setSelectedBranch(branch);
    } else if (name === "subject") {
      const subject = subjects.find((s) => s._id === value);
      setSelectedSubject(subject);
    } else if (name === "semester") {
      setSelectedSemester(value);
    } else if (name === "exam") {
      const exam = exams.find((e) => e._id === value);
      setSelectedExam(exam);
    }
  };

  const fetchBranches = async () => {
    try {
      toast.loading("Loading branches...");
      const response = await axiosWrapper.get("/branch", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) setBranches(response.data.data);
      else toast.error(response.data.message);
    } catch (error) {
      if (error.response?.status === 404) setBranches([]);
      else toast.error(error.response?.data?.message || "Failed to load branches");
    } finally {
      toast.dismiss();
    }
  };

  const fetchSubjects = async () => {
    try {
      toast.loading("Loading subjects...");
      const response = await axiosWrapper.get(`/subject?branch=${selectedBranch?._id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) setSubjects(response.data.data);
      else toast.error(response.data.message);
    } catch (error) {
      if (error.response?.status === 404) setSubjects([]);
      else toast.error(error.response?.data?.message || "Failed to load subjects");
    } finally {
      toast.dismiss();
    }
  };

  const fetchExams = async () => {
    try {
      toast.loading("Loading exams...");
      const response = await axiosWrapper.get(`/exam?semester=${selectedSemester}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) setExams(response.data.data);
      else toast.error(response.data.message);
    } catch (error) {
      if (error.response?.status === 404) setExams([]);
      else toast.error(error.response?.data?.message || "Failed to load exams");
    } finally {
      toast.dismiss();
    }
  };

  const searchStudents = async () => {
    setDataLoading(true);
    toast.loading("Initializing session...");
    setStudents([]);
    try {
      const response = await axiosWrapper.get(
        `/marks/students?branch=${selectedBranch?._id}&subject=${selectedSubject?._id}&semester=${selectedSemester}&examId=${selectedExam?._id}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      toast.dismiss();
      if (response.data.success) {
        if (response.data.data.length === 0) {
          toast.error("No student records found");
          setStudents([]);
          setMasterMarksData([]);
        } else {
          toast.success("Ready for data entry");
          setStudents(response.data.data);
          const initialMarksData = {};
          response.data.data.forEach((student) => {
            initialMarksData[student._id] = student.obtainedMarks || "";
          });
          setMarksData(initialMarksData);
          setMasterMarksData(response.data.data);
          setShowSearch(false);
        }
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error retrieving dataset");
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!consent) {
      toast.error("Please confirm authorization checkbox");
      return;
    }
    const hasEmptyMarks = Object.values(marksData).some((mark) => mark === "");
    if (hasEmptyMarks) {
      toast.error("All candidates must have an entry");
      return;
    }
    setDataLoading(true);
    toast.loading("Pushing data to mainframe...");
    try {
      const marksToSubmit = Object.entries(marksData).map(([studentId, marks]) => ({
        studentId,
        obtainedMarks: Number(marks),
      }));
      const response = await axiosWrapper.post(
        "/marks/bulk",
        {
          marks: marksToSubmit,
          examId: selectedExam?._id,
          subjectId: selectedSubject?._id,
          semester: selectedSemester,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (response.data.success) {
        toast.success("Marks synchronized successfully");
        setMarksData({});
        setConsent(false);
        setShowSearch(true);
      }
    } catch (error) {
      toast.error("Synchronization failed");
    } finally {
      setDataLoading(false);
      toast.dismiss();
    }
  };

  const handleBack = () => {
    setShowSearch(true);
    setStudents([]);
    setMasterMarksData([]);
    setMarksData({});
    setConsent(false);
  };

  useEffect(() => {
    fetchBranches();
  }, [userToken]);

  useEffect(() => {
    if (selectedBranch) fetchSubjects();
  }, [selectedBranch]);

  useEffect(() => {
    if (selectedSemester) fetchExams();
  }, [selectedSemester]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 lg:p-12">
      <div className="max-w-[1600px] mx-auto">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-xs">
              <HiOutlineTerminal /> Security Layer Active
            </div>
            <Heading title="Examination Portal" />
            <p className="text-slate-500 font-medium">Internal Grade Entry & Verification Engine</p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
             <div className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-tighter transition-all ${showSearch ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'text-slate-600'}`}>01. Select Dataset</div>
             <div className="w-6 h-px bg-slate-800"></div>
             <div className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-tighter transition-all ${!showSearch ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'text-slate-600'}`}>02. Input Core</div>
          </div>
        </div>

        {showSearch ? (
          /* SEARCH SECTION - DARK */
          <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] overflow-hidden max-w-5xl mx-auto backdrop-blur-xl shadow-2xl">
            <div className="p-10 border-b border-slate-800 flex items-center gap-5">
               <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                 <HiOutlineSearch size={28} />
               </div>
               <div>
                 <h3 className="text-2xl font-black text-white tracking-tight">Dataset Filter</h3>
                 <p className="text-slate-500 text-sm">Target specific academic groups</p>
               </div>
            </div>
            
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Academic Cycle</label>
                  <select
                    name="semester"
                    value={selectedSemester || ""}
                    onChange={handleInputChange}
                    className="w-full px-6 py-5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[1.5rem] transition-all outline-none text-slate-200 font-bold appearance-none shadow-inner"
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>Cycle Semester 0{sem}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Branch / Stream</label>
                  <select
                    name="branch"
                    value={selectedBranch?._id || ""}
                    onChange={handleInputChange}
                    className="w-full px-6 py-5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[1.5rem] transition-all outline-none text-slate-200 font-bold appearance-none shadow-inner"
                  >
                    <option value="">Select Branch</option>
                    {branches?.map((branch) => (
                      <option key={branch._id} value={branch._id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Subject Module</label>
                  <select
                    name="subject"
                    value={selectedSubject?._id || ""}
                    onChange={handleInputChange}
                    disabled={!selectedBranch}
                    className="w-full px-6 py-5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[1.5rem] transition-all outline-none text-slate-200 font-bold appearance-none shadow-inner disabled:opacity-30 disabled:grayscale"
                  >
                    <option value="">Select Subject</option>
                    {subjects?.map((subject) => (
                      <option key={subject._id} value={subject._id}>{subject.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Exam Category</label>
                  <select
                    name="exam"
                    value={selectedExam?._id || ""}
                    onChange={handleInputChange}
                    disabled={!selectedSubject}
                    className="w-full px-6 py-5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-[1.5rem] transition-all outline-none text-slate-200 font-bold appearance-none shadow-inner disabled:opacity-30 disabled:grayscale"
                  >
                    <option value="">Select Exam</option>
                    {exams?.map((exam) => (
                      <option key={exam._id} value={exam._id}>{exam.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-900/60 border-t border-slate-800 flex justify-end">
              <button
                disabled={dataLoading || !selectedBranch || !selectedSubject || !selectedExam || !selectedSemester}
                onClick={searchStudents}
                className="group relative bg-white text-slate-950 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all disabled:opacity-30 active:scale-95 shadow-xl shadow-white/5 overflow-hidden"
              >
                <span className="relative z-10">Load Recordset</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>
            </div>
          </div>
        ) : (
          /* ENTRY GRID - DARK */
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Context Dashboard */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 flex flex-wrap lg:flex-nowrap items-center justify-between gap-10">
              <div className="flex items-center gap-8">
                <button onClick={handleBack} className="w-14 h-14 flex items-center justify-center bg-slate-800 rounded-2xl hover:bg-slate-700 transition-all text-slate-400 hover:text-white">
                  <HiOutlineArrowLeft size={24} />
                </button>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Module</p>
                  <h4 className="text-xl font-black text-white">{selectedSubject?.name}</h4>
                </div>
              </div>
              
              <div className="flex gap-10 px-8 py-2 border-l border-slate-800">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FiTarget className="text-emerald-500" /> Max Score</p>
                  <p className="text-2xl font-black text-white">{selectedExam?.totalMarks}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><FiHash className="text-indigo-500" /> Candidates</p>
                  <p className="text-2xl font-black text-white">{masterMarksData.length}</p>
                </div>
              </div>
            </div>

            {/* Candidate Entry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {masterMarksData.map((student) => (
                <div key={student._id} className="group bg-slate-900/40 border border-slate-800/60 p-6 rounded-[2rem] hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                            <MdOutlineAppRegistration size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-600 uppercase">Enrollment</p>
                            <p className="font-mono font-bold text-slate-300 tracking-tight">{student.enrollmentNo}</p>
                        </div>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={selectedExam?.totalMarks || 100}
                      className="w-full px-6 py-6 bg-slate-950 border-2 border-transparent focus:border-emerald-500/30 rounded-2xl outline-none font-black text-3xl text-center text-white transition-all shadow-inner group-hover:bg-slate-950"
                      value={marksData[student._id] || ""}
                      placeholder="--"
                      onChange={(e) => setMarksData({ ...marksData, [student._id]: e.target.value })}
                    />
                    <div className="absolute right-4 bottom-4 text-[9px] font-black text-slate-700 uppercase">Marks</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submission Authority Section */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <HiOutlineInformationCircle size={24} className="text-indigo-400" />
                    <span className="text-indigo-400 font-black uppercase tracking-[0.2em] text-xs">Submission Protocol</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6 tracking-tight">Data Integrity Authorization</h3>
                  <label className="flex items-start gap-6 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-1">
                        <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="peer w-8 h-8 rounded-xl bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 transition-all opacity-0 absolute inset-0 z-10 cursor-pointer"
                        />
                        <div className="w-8 h-8 rounded-xl border-2 border-slate-700 bg-slate-800 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                            <HiOutlineBadgeCheck className="text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={20} />
                        </div>
                    </div>
                    <span className="text-slate-400 text-sm font-medium leading-relaxed group-hover:text-slate-300 transition-colors">
                      I hereby authorize the synchronization of these records into the centralized student database. I confirm that these scores are an accurate reflection of the evaluated performance for <b>{selectedExam?.name}</b>.
                    </span>
                  </label>
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={dataLoading || !consent}
                  className="w-full xl:w-auto bg-white text-slate-950 px-16 py-7 rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-2xl disabled:opacity-10 active:scale-95"
                >
                  {dataLoading ? "Encrypting & Syncing..." : "Finalize Protocol"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMarks;