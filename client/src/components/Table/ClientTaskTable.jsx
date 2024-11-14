import React from "react";

const ClientTasksTable = ({ data }) => {
  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get status color
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

  // Helper function to get priority color
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

  return (
    <div className=" mx-auto px-4 py-6 bg-[#ffffffcd] rounded-lg grid grid-cols-1 2xl:grid-cols-2 gap-5 scroll">
      {data.map((clientData, index) => (
        <div key={index} className="mb-8">
          {/* Client Name Header */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
            {clientData.clientName}
          </h2>

          {/* Tasks Table */}
          <div className="overflow-x-auto shadow-md ">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtask
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clientData.tasks.map((task) =>
                  task.subTasks.map((subtask, subtaskIndex) => (
                    <tr key={subtask._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {task.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {subtask.task}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(subtask.dueDate)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusColor(
                          subtask.status
                        )}`}
                      >
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize `}
                        >
                          {subtask.status}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm capitalize ${getPriorityColor(
                          subtask.priority
                        )}`}
                      >
                        <span className={`font-medium `}>
                          {subtask.priority}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientTasksTable;
