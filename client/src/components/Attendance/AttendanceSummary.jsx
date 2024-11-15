import React from 'react';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { 
  FaUserCheck, 
  FaUserTimes, 
  FaUserClock,
  FaCalendarWeek,
  FaDollarSign,
  FaClock
} from "react-icons/fa";

const AttendanceSummary = () => {
  const summaryData = [
    { title: "Present", value: "7", icon: <FaUserCheck className="text-green-600" /> },
    { title: "Absent", value: "1", icon: <FaUserTimes className="text-red-600" /> },
    { title: "Half Day", value: "0", icon: <FaUserClock className="text-yellow-600" /> },
    { title: "Weekly Off", value: "2", icon: <FaCalendarWeek className="text-blue-600" /> },
    { title: "Fine", value: "0:00", icon: <FaDollarSign className="text-gray-600" /> },
    { title: "Overtime", value: "0:00", icon: <FaClock className="text-purple-600" /> }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 bg-[#ffffffcd]">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <IoChevronBack className="text-xl text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Nov, 2024</h2>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <IoChevronForward className="text-xl text-gray-600" />
        </button>
      </div>

      {/* Grid layout for summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryData.map((item, index) => (
          <div 
            key={index} 
            className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{item.title}</p>
                <p className="text-3xl font-semibold text-gray-800">{item.value}</p>
              </div>
              <div className="text-2xl">
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceSummary;