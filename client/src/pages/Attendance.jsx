import React, { useEffect, useState } from "react";
import PunchInButton from "../components/Button/PunchInButton";
import PunchOutButton from "../components/Button/PunchOutButton";
import baseURL from "../api/baseURL";
import Loader from "../components/Loader/Loader";
import { toast } from "react-toastify";
import UserDashboard from "../components/Attendance/UserDashboard";

const Attendance = () => {
  const [location, setLocation] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [isPunchedOut, setIsPunchedOut] = useState(false);
  const [flag, setFlag] = useState(false);

  // Fixed: Define reload as a function instead of a constant assignment
  const reload = () => setFlag((prev) => !prev);

  const checkTodayPunchInStatus = async () => {
    try {
      const res = await baseURL.post("/attendance/checkTodayPunchInStatus");
      console.log(res);

      if (res?.data?.status) {
        // Fixed: Check res.data.status instead of res.status
        setIsPunchedIn(res.data.isPunchedIn);
      }
    } catch (error) {
      console.error("Error checking punch-in status:", error);
    }
  };

  const checkTodayPunchOutStatus = async () => {
    try {
      const res = await baseURL.post("/attendance/checkTodayPunchOutStatus");
      console.log(res);

      if (res?.data?.status) {
        // Fixed: Check res.data.status instead of res.status
        setIsPunchedOut(res.data.isPunchedOut);
      }
    } catch (error) {
      console.error("Error checking punch-out status:", error);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      setPageLoading(true);
      await Promise.all([
        checkTodayPunchInStatus(),
        checkTodayPunchOutStatus(),
      ]);
      setPageLoading(false);
    };

    checkStatus();
  }, [flag]); // Added flag to dependency array to trigger refresh

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true }
      );
    });
  };

  const handlePunchIn = async () => {
    setButtonLoading(true);
    try {
      const currentLocation = await getCurrentLocation();
      console.log(currentLocation);

      const punchInResponse = await baseURL.post(
        "/attendance/punchInUser",
        currentLocation
      );
      console.log(punchInResponse);

      setLocation(currentLocation);
      reload(); // Call the reload function instead of directly setting state
    } catch (err) {
      toast.error(err.response.data.error);
      console.error("Error during punch-in:", err);
    } finally {
      setButtonLoading(false);
    }
  };

  const handlePunchOut = async () => {
    setButtonLoading(true);
    try {
      const currentLocation = await getCurrentLocation();
      console.log(currentLocation);

      const punchOutResponse = await baseURL.post(
        "/attendance/punchOutUser",
        currentLocation
      );
      console.log(punchOutResponse);

      setLocation(currentLocation);
      reload(); // Call the reload function instead of directly setting state
    } catch (err) {
      toast.error(err.response.data.error);
      console.error("Error during punch-out:", err);
    } finally {
      setButtonLoading(false);
    }
  };

  if (pageLoading) {
    return <Loader />;
  }

  return (
    <div className="mt-20 mr-1 mb-1 p-5 w-full h-[calc(100vh-5.75rem)] overflow-y-hidden">
      <UserDashboard />

      {!isPunchedIn ? (
        <div
          className="w-full fixed inset-x-0 bottom-10 mx-auto flex justify-center z-50"
          onClick={handlePunchIn}
        >
          <PunchInButton buttonLoading={buttonLoading} />
        </div>
      ) : !isPunchedOut ? (
        <div
          className="w-full fixed inset-x-0 bottom-10 mx-auto flex justify-center z-50"
          onClick={handlePunchOut}
        >
          <PunchOutButton buttonLoading={buttonLoading} />
        </div>
      ) : null}
    </div>
  );
};

export default Attendance;
