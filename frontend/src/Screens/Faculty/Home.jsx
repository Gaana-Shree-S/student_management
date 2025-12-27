import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Timetable from "./Timetable";
import Material from "./Material";
import StudentFinder from "./StudentFinder";
import Profile from "./Profile";
import Marks from "./AddMarks";
import Exam from "../Exam";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: null },
  { id: "timetable", label: "Timetable", component: Timetable },
  { id: "material", label: "Material", component: Material },
  { id: "notice", label: "Notice", component: Notice },
  { id: "student info", label: "Student Info", component: StudentFinder },
  { id: "marks", label: "Marks", component: Marks },
  { id: "exam", label: "Exam", component: Exam },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const [profileData, setProfileData] = useState(null);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosWrapper.get("/faculty/my-details", {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (response.data.success) {
          setProfileData(response.data.data);
          dispatch(setUserData(response.data.data));
        }
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };

    fetchUserDetails();
  }, [dispatch, userToken]);

  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu.toLowerCase() === menuId.toLowerCase();
    return `
      relative px-6 py-3 rounded-lg font-medium text-sm cursor-pointer transition-all duration-300
      ${
        isSelected
          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform scale-[1.03]"
          : "text-blue-600 bg-blue-50 hover:bg-blue-100"
      }
    `;
  };

  const renderContent = () => {
    if (selectedMenu === "Home" && profileData) return <Profile profileData={profileData} />;

    const menuItem = MENU_ITEMS.find(
      (item) => item.label.toLowerCase() === selectedMenu.toLowerCase()
    );

    if (menuItem && menuItem.component) {
      const Component = menuItem.component;
      return <Component />;
    }

    return null;
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        {/* Menu Bar */}
        <div className="bg-white/70 backdrop-blur-md shadow-sm rounded-2xl border border-gray-100 p-4 mb-10">
          <ul className="flex flex-wrap justify-center md:justify-evenly gap-3 md:gap-6">
            {MENU_ITEMS.map((item) => (
              <li
                key={item.id}
                className={getMenuItemClass(item.id)}
                onClick={() => setSelectedMenu(item.label)}
              >
                {item.label}
                {selectedMenu.toLowerCase() === item.id.toLowerCase() && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-blue-600 rounded-b-md"></span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 min-h-[60vh]">
          {renderContent() || (
            <div className="flex items-center justify-center h-[50vh] text-gray-500 font-medium">
              Select a section from above to view details
            </div>
          )}
        </div>
      </div>

      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;
