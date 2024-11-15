import React from "react";
import { useRecoilState } from "recoil";
import { userDataAtom } from "../recoil/atoms/userAtoms";
import { configKeys } from "../api/config";
import AdminDashboard from "./AdminDashboard";
import UserAttendance from "./UserAttendance";

const AttendanceDashboard = () => {
  const [user, setUser] = useRecoilState(userDataAtom);

  return (
    <div className="mt-20 mr-1 mb-1 p-5 w-full h-[calc(100vh-5.75rem)] overflow-y-hidden">
      {user.role === configKeys.ADMIN_ROLE ? (
        <AdminDashboard />
      ) : (
        <UserAttendance />
      )}
    </div>
  );
};

export default AttendanceDashboard;
