import React, { useEffect, useState } from "react";
import baseURL from "../api/baseURL";
import { toast } from "react-toastify";
import Loader from "../components/Loader/Loader";
import TodayTaskTable from "../components/Table/TodayTaskTable";
import { useLocation } from "react-router-dom";
import ClientTasksTable from "../components/Table/ClientTaskTable";

const ClientWorks = () => {
  const { state } = useLocation();
  // return console.log(state);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await baseURL.get(`/tasks/getProjectByClient/${state.id}`);

        setSelectedProject(res.data.data);
        console.log(res.data.data);
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

  console.log("Selected project after", selectedProject);

  return (
    <div className="mt-20 mr-1 mb-1 p-5 w-full h-[calc(100vh-5.75rem)] overflow-y-hidden">
      <div className="  overflow-y-scroll h-screen no-scrollbar   w-full gap-3 pt-28 p-5">
        <ClientTasksTable data={selectedProject} />
      </div>
    </div>
  );
};

export default ClientWorks;
