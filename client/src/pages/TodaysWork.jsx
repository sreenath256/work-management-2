import React, { useEffect, useState } from "react";
import baseURL from "../api/baseURL";
import { toast } from "react-toastify";
import Loader from "../components/Loader/Loader";
import TodayTaskTable from "../components/Table/TodayTaskTable";

const TodaysWork = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await baseURL.get("/tasks/getProjectByPeople");

        setSelectedProject(res.data.data);
        console.log("Todays works response",res);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mt-20 mr-1 mb-1 p-5 w-full h-[calc(100vh-5.75rem)] overflow-y-hidden">
      <div className="  overflow-y-scroll h-screen no-scrollbar grid grid-cols-1 lg:grid-cols-2  w-full gap-3 pt-28 p-5  ">
        {selectedProject ? (
          selectedProject.map((singleTask, index) => (
            <TodayTaskTable key={index} task={singleTask} />
          ))
        ) : (
          <h1>No works for today</h1>
        )}
      </div>
    </div>
  );
};

export default TodaysWork;
