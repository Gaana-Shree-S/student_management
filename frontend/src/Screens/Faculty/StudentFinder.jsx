import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Heading from "../../components/Heading";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import NoData from "../../components/NoData";
import { FiSearch, FiUser, FiBookOpen, FiMapPin, FiPhone, FiMail, FiX, FiFilter, FiActivity } from "react-icons/fi";

const StudentFinder = () => {
  const [searchParams, setSearchParams] = useState({
    enrollmentNo: "",
    name: "",
    semester: "",
    branch: "",
  });
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const userToken = localStorage.getItem("userToken");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosWrapper.get("/branch", {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (response.data.success) {
          setBranches(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load branches");
      }
    };
    fetchBranches();
  }, [userToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const searchStudents = async (e) => {
    e.preventDefault();
    setDataLoading(true);
    setHasSearched(true);
    const searchToast = toast.loading("Scanning Database...");
    try {
      const response = await axiosWrapper.post(`/student/search`, searchParams, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      toast.dismiss(searchToast);
      if (response.data.success) {
        setStudents(response.data.data);
        if (response.data.data.length > 0) toast.success(`${response.data.data.length} records found`);
      }
    } catch (error) {
      toast.dismiss(searchToast);
      toast.error("Database sync failed");
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-indigo-500 rounded-full"></div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Intelligence Unit</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Student Directory</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Unified search across academic infrastructure</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT: Search Panel */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <form 
            onSubmit={searchStudents} 
            className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 sticky top-28 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8 text-indigo-400 font-black text-xs uppercase tracking-widest">
              <FiFilter /> <span>Search Matrix</span>
            </div>
            
            <div className="space-y-6">
              <FilterField label="Enrollment ID" name="enrollmentNo" value={searchParams.enrollmentNo} onChange={handleInputChange} placeholder="Ex: EN2024..." />
              <FilterField label="Full Name" name="name" value={searchParams.name} onChange={handleInputChange} placeholder="Type name..." />
              
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Academic Term</label>
                <select name="semester" value={searchParams.semester} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all appearance-none outline-none">
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => <option key={sem} value={sem}>Term {sem}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
                <select name="branch" value={searchParams.branch} onChange={handleInputChange} className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all appearance-none outline-none">
                  <option value="">All Branches</option>
                  {branches?.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={dataLoading} 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-indigo-500/10 transition-all active:scale-95 disabled:opacity-50"
              >
                {dataLoading ? "Processing..." : "Execute Search"}
              </button>
            </div>
          </form>
        </aside>

        {/* RIGHT: Results Area */}
        <main className="flex-1">
          {!hasSearched ? (
            <div className="bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800 p-24 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
              <div className="w-28 h-28 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 border border-indigo-500/20">
                <FiSearch className="text-4xl text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-400 tracking-tight">System Idle</h3>
              <p className="text-slate-600 max-w-xs mt-3 font-bold text-sm">Waiting for search parameters to query the central student database.</p>
            </div>
          ) : students.length === 0 ? (
            <div className="bg-slate-900/20 rounded-[3rem] p-24"><NoData /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {students.map((student) => (
                <div 
                  key={student._id}
                  onClick={() => { setSelectedStudent(student); setShowModal(true); }}
                  className="group bg-slate-900/40 backdrop-blur-sm p-6 rounded-[2.5rem] border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-start gap-5">
                    <div className="relative">
                        <img 
                          src={`${process.env.REACT_APP_MEDIA_LINK}/${student.profile}`} 
                          alt="Avatar" 
                          className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-indigo-500 transition-colors"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200"; }}
                        />
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-slate-950 rounded-lg flex items-center justify-center border border-slate-800">
                            <FiActivity className="text-indigo-500 text-[10px]" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-200 group-hover:text-white transition-colors leading-tight text-lg truncate">
                        {student.firstName} {student.lastName}
                      </h4>
                      <p className="text-[10px] font-black text-indigo-500/80 mt-1 uppercase tracking-widest">
                        {student.enrollmentNo}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                         <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[9px] font-black rounded-lg uppercase tracking-wider">
                           Sem {student.semester}
                         </span>
                         <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] font-black rounded-lg uppercase tracking-wider">
                           {student.branchId?.name?.split(' ')[0]}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal - Dark Industrial Variant */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 z-[200] animate-in fade-in duration-300">
          <div className="bg-slate-950 rounded-[3.5rem] w-full max-w-5xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-slate-800 flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Modal Sidebar */}
            <div className="w-full md:w-80 bg-slate-900/50 p-10 border-r border-slate-800/50 flex flex-col items-center">
               <div className="relative group">
                 <div className="absolute -inset-2 bg-indigo-500/20 rounded-[2.5rem] blur opacity-50"></div>
                 <img 
                   src={`${process.env.REACT_APP_MEDIA_LINK}/${selectedStudent.profile}`} 
                   className="relative w-48 h-48 rounded-[2.5rem] object-cover shadow-2xl mb-8 border-4 border-slate-950"
                   alt="Profile"
                 />
               </div>
               <h2 className="text-2xl font-black text-white text-center leading-tight tracking-tighter">
                 {selectedStudent.firstName} <br/> {selectedStudent.lastName}
               </h2>
               <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.2em] mt-3">{selectedStudent.enrollmentNo}</p>
               
               <div className="mt-10 w-full space-y-4">
                  <div className="bg-slate-950 p-4 rounded-2xl flex items-center gap-4 border border-slate-800">
                     <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <FiBookOpen size={16}/>
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedStudent.branchId?.name}</span>
                  </div>
               </div>

               <button 
                onClick={() => setShowModal(false)}
                className="mt-auto flex items-center gap-3 text-slate-500 hover:text-rose-500 font-black text-[10px] uppercase tracking-widest transition-all pt-10"
               >
                 <FiX size={18} /> Close System View
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-10 md:p-14 overflow-y-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <InfoSection title="Communications">
                    <InfoItem icon={<FiMail/>} label="Official Email" value={selectedStudent.email} />
                    <InfoItem icon={<FiPhone/>} label="Contact Number" value={selectedStudent.phone} />
                    <InfoItem icon={<FiMapPin/>} label="Primary Residence" value={`${selectedStudent.address}, ${selectedStudent.city}`} />
                  </InfoSection>

                  <InfoSection title="Identity & Academics">
                    <InfoItem icon={<FiUser/>} label="Biological Gender" value={selectedStudent.gender} />
                    <InfoItem icon={<FiBookOpen/>} label="Current Status" value={`Semester ${selectedStudent.semester} Active`} />
                  </InfoSection>

                  <InfoSection title="Emergency Protocol" className="md:col-span-2 bg-rose-950/20 border border-rose-900/20 p-8 rounded-[2rem]">
                    <div className="flex justify-between items-center">
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-black text-rose-500/60 uppercase mb-2 tracking-widest">Guardian Signature</p>
                          <p className="text-2xl font-black text-rose-100 tracking-tighter">{selectedStudent.emergencyContact?.name}</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Relation</p>
                                <p className="text-xs font-bold text-rose-400">{selectedStudent.emergencyContact?.relationship}</p>
                            </div>
                            <div className="h-8 w-[1px] bg-rose-900/50"></div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Direct Line</p>
                                <p className="text-xs font-bold text-rose-400">{selectedStudent.emergencyContact?.phone || "N/A"}</p>
                            </div>
                        </div>
                      </div>
                      <div className="bg-rose-600 shadow-xl shadow-rose-900/20 text-white p-5 rounded-3xl">
                        <FiPhone size={24} />
                      </div>
                    </div>
                  </InfoSection>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterField = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
    <input 
      {...props} 
      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-700 text-white outline-none"
    />
  </div>
);

const InfoSection = ({ title, children, className }) => (
  <div className={className}>
    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
        {title}
    </h3>
    <div className="space-y-8">{children}</div>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex gap-5 group">
    <div className="mt-1 text-slate-600 group-hover:text-indigo-400 transition-colors">{icon}</div>
    <div className="space-y-1">
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{label}</p>
      <p className="text-base font-bold text-slate-200 tracking-tight">{value || "---"}</p>
    </div>
  </div>
);

export default StudentFinder;