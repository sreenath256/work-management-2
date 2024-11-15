import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCircle,
} from "react-icons/fa";
import AttendanceSummary from "../components/Attendance/AttendanceSummary";
import baseURL from "../api/baseURL";

const AdminDashboard = () => {
  const [staffData, setStaffData] = useState([
    {
      id: 1,
      name: "John Doe",
      punchInTime: "2024-11-15T09:00:00",
      punchOutTime: "2024-11-15T17:00:00",
      punchInLocation: "12.9716, 77.5946",
      distance: 15,
      status: "present",
    },
    {
      id: 2,
      name: "Jane Smith",
      punchInTime: "2024-11-15T08:45:00",
      punchOutTime: null,
      punchInLocation: "12.9716, 77.5946",
      distance: 25,
      status: "active",
    },
  ]);

  const fetchTodaysAttendance = async () => {
    try {
      const res = await baseURL.get("/attendance/getTodayAttendance");
      setStaffData(res.data.data.records);
      console.log(res.data.data.records);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    fetchTodaysAttendance();
  }, []);

  // Sample data - replace this with your actual data

  const formatTime = (timestamp) => {
    if (!timestamp) return "Not Punched Out";
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  const formatWorkingHours = (workingHours) => {
    if (workingHours === null) {
      return 'Not Punched Out';
    }

    const hours = Math.floor(workingHours);
    const minutes = Math.round((workingHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      {/* <AttendanceSummary /> */}

      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <FaUser className="w-6 h-6" />
          Today's Attendance
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left font-medium text-gray-500">
                  Name
                </th>
                <th className="p-4 text-left font-medium text-gray-500">
                  Punch In
                </th>
                <th className="p-4 text-left font-medium text-gray-500">
                  Punch Out
                </th>
                <th className="p-4 text-left font-medium text-gray-500">
                  Active Hours
                </th>

                <th className="p-4 text-left font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffData.map((staff, index) => (
                <tr
                  key={staff.userId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={staff.profilePhotoURL}
                        className="w-10 h-10 rounded-[50%] text-gray-400"
                      />
                      <span className="font-medium capitalize">
                        {staff.userName}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4 text-gray-400" />
                      {formatTime(staff.punchInTime)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4 text-gray-400" />
                      {formatTime(staff.punchOutTime)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FaClock className="w-4 h-4 text-gray-400" />
                      {formatWorkingHours(staff.workingHours)}
                    </div>
                  </td>

                  <td className="p-4">
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(
                        staff.status
                      )}`}
                    >
                      <FaCheckCircle className="w-4 h-4" />
                      {staff.status.charAt(0).toUpperCase() +
                        staff.status.slice(1)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
