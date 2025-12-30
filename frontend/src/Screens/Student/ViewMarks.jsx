import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import { FiAward, FiBarChart2, FiBookOpen, FiActivity, FiPieChart, FiChevronDown } from "react-icons/fi";

const ViewMarks = () => {
  const userData = useSelector((state) => state.userData);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(userData?.semester || 1);
  const [activeTab, setActiveTab] = useState("mid"); // 'mid' or 'end'
  const [marks, setMarks] = useState([]);
  const userToken = localStorage.getItem("userToken");

  const fetchMarks = async (semester) => {
    setDataLoading(true);
    const loadingToast = toast.loading("Accessing encrypted records...", {
      style: { borderRadius: '15px', background: '#1e293b', color: '#fff' }
    });
    try {
      const response = await axiosWrapper.get(
        `/marks/student?semester=${semester}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
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
      toast.dismiss(loadingToast);
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

  const filteredMarks = marks.filter((mark) => mark.examId.examType === activeTab);

  const averagePercentage = filteredMarks.length 
    ? (filteredMarks.reduce((acc, curr) => acc + (curr.marksObtained / curr.examId.totalMarks), 0) / filteredMarks.length * 100).toFixed(1)
    : 0;

  return (
    <div className="w-full min-h-screen bg-[#0a0f1c] text-slate-300 py-10 px-4 md:px-8 animate-in fade-in duration-700">
      
      {/* SECTION 1: Strategic Header */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="h-[2px] w-8 bg-indigo-500 rounded-full"></div>
             <span className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em]">Performance Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Academic <span className="text-indigo-500">Insights.</span></h1>
          <p className="text-slate-500 font-medium max-w-md">Detailed breakdown of examination scores and semester-wise progression analytics.</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex items-center gap-4 bg-slate-900 border border-white/5 p-2 rounded-2xl">
            <div className="pl-4">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Term</span>
            </div>
            <select
              value={selectedSemester || ""}
              onChange={handleSemesterChange}
              className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm outline-none appearance-none cursor-pointer pr-10"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem} className="bg-slate-900">Semester 0{sem}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-6 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* SECTION 2: Analytics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <StatCard icon={<FiPieChart />} label="Avg. Efficiency" value={`${averagePercentage}%`} color="text-indigo-400" bgColor="bg-indigo-500/10" />
            <StatCard icon={<FiBookOpen />} label="Modules Verified" value={filteredMarks.length} color="text-emerald-400" bgColor="bg-emerald-500/10" />
            <StatCard icon={<FiAward />} label="Status" value={averagePercentage > 40 ? "Qualified" : "N/A"} color="text-amber-400" bgColor="bg-amber-500/10" />
        </div>

        {/* SECTION 3: Tabbed Report Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
          
          {/* Tab Navigation */}
          <div className="flex bg-slate-900/50">
            <TabButton 
              active={activeTab === "mid"} 
              onClick={() => setActiveTab("mid")} 
              label="Mid-Term Assessments" 
            />
            <TabButton 
              active={activeTab === "end"} 
              onClick={() => setActiveTab("end")} 
              label="End-Term Final" 
            />
          </div>

          <div className="p-8 md:p-12">
            {dataLoading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-6">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em] animate-pulse">Decrypting Dataset...</p>
              </div>
            ) : filteredMarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredMarks.map((mark) => (
                  <ResultRow key={mark._id} mark={mark} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center space-y-6 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <FiActivity className="text-3xl text-slate-600" />
                </div>
                <div>
                  <h3 className="text-white font-bold">No Data Points Detected</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">No examination results have been logged for this specific category yet.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal Components
const StatCard = ({ icon, label, value, color, bgColor }) => (
  <div className="bg-slate-900/50 p-7 rounded-[2.5rem] border border-white/5 flex items-center gap-6 group hover:border-white/10 transition-all">
    <div className={`text-2xl p-4 rounded-2xl ${bgColor} ${color} group-hover:scale-110 transition-transform`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black tracking-tighter text-white`}>{value}</p>
    </div>
  </div>
);

const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-7 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] transition-all relative
      ${active ? "text-white" : "text-slate-500 hover:text-slate-300"}
    `}
  >
    {label}
    {active && (
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
    )}
  </button>
);

const ResultRow = ({ mark }) => {
  const percentage = (mark.marksObtained / mark.examId.totalMarks) * 100;
  
  return (
    <div className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-500">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <p className="text-[11px] font-black text-indigo-400 tracking-[0.2em] uppercase">
            {mark.examId.name}
          </p>
          <h3 className="text-lg font-bold text-white tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">
            {mark.subjectId.name}
          </h3>
        </div>
        <div className="text-right bg-slate-950/50 px-4 py-2 rounded-xl border border-white/5">
          <span className="text-2xl font-black text-white leading-none">
            {mark.marksObtained}
          </span>
          <span className="text-slate-500 font-bold text-xs ml-1">
            / {mark.examId.totalMarks}
          </span>
        </div>
      </div>

      {/* Progress Bar Visual */}
      <div className="space-y-3">
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-[1px]">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)] ${percentage > 40 ? 'bg-gradient-to-r from-indigo-600 to-indigo-400' : 'bg-gradient-to-r from-rose-600 to-rose-400'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
          <span className="group-hover:text-slate-300 transition-colors">Efficiency Index</span>
          <span className={percentage > 40 ? 'text-emerald-500' : 'text-rose-500'}>{percentage.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ViewMarks;