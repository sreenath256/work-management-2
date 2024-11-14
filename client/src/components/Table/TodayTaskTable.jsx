import React, { useEffect, useState } from "react";
import baseURL from "../../api/baseURL";

const TodayTaskTable = ({ task }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState([]);
  const { personId, tasks } = task;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await baseURL.get(`/user/getSingleUser/${personId}`);

        setUser(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-[#cd0000] text-white";
      case "high":
        return "bg-[#ff4000] text-white";
      case "normal":
        return "bg-[#28c900] text-white";
      case "medium":
        return "bg-[#d6cf02] text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "working on it":
        return "bg-[#ff8400] text-white";
      case "rework":
        return "bg-[#9e01b8] text-white";
      case "finalizing":
        return "bg-[#0d9f00] text-white";
      case "waiting for content":
        return "bg-[#007fc7] text-white";
      case "done":
        return "bg-[#7add2c] text-white";
      case "content done":
        return "bg-[#04e09e] text-white";
      case "waiting for approval":
        return "bg-[#ff0090] text-white";
      case "not started":
        return "bg-[#dadada] text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <>
      {tasks.length !== 0 && (
        <div className="bg-[#ffffffcd] rounded-lg shadow-md p-6 h-fit">
          <div className="flex items-center mb-4">
            <img
              src={user.profilePhotoURL}
              alt={user.userName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <h1 className="text-xl font-bold">{user.userName}</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="bg-white min-w-full rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-100">
                    <td
                      className={`px-4 py-3 whitespace-nowrap font-medium capitalize text-gray-900`}
                    >
                      {task.client}
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap font-medium capitalize text-gray-900`}
                    >
                      {task.task}
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap capitalize ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap capitalize ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default TodayTaskTable;
