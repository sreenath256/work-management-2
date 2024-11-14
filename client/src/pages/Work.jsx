import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  dueDateUpdate,
  dynamicFieldUpdate,
  getAllClients,
  getAllHeaders,
  getAllPriorityOptions,
  getAllStatusOptions,
  getPermittedHeaders,
  getSingleProjectIndividual,
  projectDnD,
} from "../api/apiConnections/projectConnections";
import { TaskTable } from "../components/Projects/TaskTable";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  clientOptionsAtom,
  currentProjectAtom,
  currentProjectCopyAtom,
  filterStatusAtom,
  permittedHeadersAtom,
  personFilterAtom,
  priorityOptionsAtom,
  projectHeadersAtom,
  statusOptionsAtom,
  subTaskNameSearchAtom,
} from "../recoil/atoms/projectAtoms";
import { userDataAtom } from "../recoil/atoms/userAtoms";
import { configKeys } from "../api/config";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoIosSearch, IoMdCloseCircle } from "react-icons/io";
import { Input } from "antd";
import Loader from "../components/Loader/Loader";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { BsSortAlphaUp } from "react-icons/bs";
import { TfiExchangeVertical } from "react-icons/tfi";

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dialog, Stack, Typography } from "@mui/material";
import DateRangePicker from "../components/DateRangePicker/DateRangePicker";
import { SubTaskChat } from "../components/Chat/SubTaskChat";
const Work = () => {
  const { state } = useLocation();
  const userData = useRecoilValue(userDataAtom);

  const [selectedProject, setSelectedProject] =
    useRecoilState(currentProjectAtom);
  const [currentProject, setCurrentProject] = useRecoilState(
    currentProjectCopyAtom
  );

  const setHeaders = useSetRecoilState(projectHeadersAtom);
  const setIsFiltered = useSetRecoilState(filterStatusAtom);
  const [statusGroup, setStatusGroup] = useRecoilState(statusOptionsAtom);
  const [clientGroup, setClientGroup] = useRecoilState(clientOptionsAtom);
  const [priorityGroup, setPriorityGroup] = useRecoilState(priorityOptionsAtom);
  const setPermittedHeaders = useSetRecoilState(permittedHeadersAtom);

  const [openChat, setOpenChat] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [taskSubTaskIds, setTaskSubTaskIds] = useState({});

  const [chatExists, setChatExists] = useState(false);
  const [taskData, setTaskData] = useState({});
  const [exportOrRemoveOption, setExportOrRemoveOption] = useState("");

  const [currentSubTaskPeople, setCurrentSubTaskPeople] = useState([]);

  const [subTaskName, setSubTaskName] = useRecoilState(subTaskNameSearchAtom);
  const [person, setPerson] = useRecoilState(personFilterAtom);

  const [openSearchInput, setOpenSearchInput] = useState(false);
  const searchInputRef = useRef(null);
  const searchTaskRef = useRef(null);

  const [openSort, setOpenSort] = useState(false);

  const [dynamicSelectFieldType, setDynamicSelectFieldType] = useState("");
  const [openDynamicSelectFieldModal, setOpenDynamicSelectFieldModal] =
    useState(false);

  const [dragTaskId, setDragTaskId] = useState(null);
  const [dragSubTaskId, setDragSubTaskId] = useState(null);

  const [openRemoveOrExportTaskModal, setOpenRemoveOrExportTaskModal] =
    useState(false);

  const [addHeaderOpen, setAddHeaderOpen] = useState(false);

  const [openTaskArrangePopup, setOpenTaskArrangePopup] = useState(false);
  const [openFilterByDate, setOpenFilterBydate] = useState(false);

  const [startDate, setStartDate] = React.useState(dayjs("2022-04-17"));
  const [endDate, setEndDate] = React.useState(dayjs("2022-04-21"));

  const isAdmin = userData?.role === configKeys.ADMIN_ROLE ? true : false;
  const classes = "border border-blue-gray-200";

  const projectPermitted = userData?.permissions?.find(
    (project) => project?.projectId === state.id
  );

  const onDragStart = (e, taskDragId, subTaskDragId = null) => {
    setDragTaskId(taskDragId);
    if (subTaskDragId) {
      setDragSubTaskId(subTaskDragId);
    }
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = async (e, dropId, dropSubTaskId = null) => {
    e.preventDefault();
    if (dropSubTaskId) {
      if (
        dragSubTaskId !== null &&
        dragSubTaskId !== undefined &&
        dropSubTaskId !== null &&
        dropSubTaskId !== undefined &&
        dragSubTaskId !== dropSubTaskId &&
        dropId === dragTaskId
      ) {
        const dragSubTask = {
          ...selectedProject
            .find((tasks) => tasks._id === dragTaskId)
            ?.subTasks?.find((subTasks) => subTasks._id === dragSubTaskId),
        };
        const dropSubTask = {
          ...selectedProject
            .find((tasks) => tasks._id === dropId)
            ?.subTasks?.find((subTasks) => subTasks._id === dropSubTaskId),
        };

        let temp = dragSubTask.order;
        dragSubTask.order = dropSubTask.order;
        dropSubTask.order = temp;

        const updateProject = (selected) =>
          selected.map((task) => {
            if (task._id === dragTaskId) {
              return {
                ...task,
                subTasks: task.subTasks.map((subTask) => {
                  if (subTask._id === dragSubTaskId) {
                    return dropSubTask;
                  } else if (subTask._id === dropSubTaskId) {
                    return dragSubTask;
                  } else {
                    return subTask;
                  }
                }),
              };
            } else {
              return task;
            }
          });

        setSelectedProject((previous) => updateProject(previous));
        setCurrentProject((previous) => updateProject(previous));

        const response = await projectSubTaskDnD({
          dragSubTaskId,
          dragOrder: dragSubTask.order,
          dropSubTaskId,
          dropOrder: dropSubTask.order,
        });

        if (!response?.status) {
          toast.error("Internal error");
        }
      }
    } else {
      if (
        dragTaskId !== null &&
        dragTaskId !== undefined &&
        dropId !== null &&
        dropId !== undefined &&
        dragTaskId !== dropId
      ) {
        const dragTask = {
          ...selectedProject.find((tasks) => tasks._id === dragTaskId),
        };
        const dropTask = {
          ...selectedProject.find((tasks) => tasks._id === dropId),
        };

        let temp = dragTask.order;
        dragTask.order = dropTask.order;
        dropTask.order = temp;

        const updateProject = (selected) =>
          selected.map((task) => {
            if (task._id === dragTaskId) {
              return dropTask;
            } else if (task._id === dropId) {
              return dragTask;
            } else {
              return task;
            }
          });

        setSelectedProject((previous) => updateProject(previous));
        setCurrentProject((previous) => updateProject(previous));

        const response = await projectDnD({
          dragId: dragTaskId,
          dragOrder: dragTask.order,
          dropId,
          dropOrder: dropTask.order,
        });
        if (!response?.status) {
          toast.error("Internal error");
        }
      }
    }
  };

  const getSelectedProject = async () => {
    setIsLoading(true);

    const [project, status, priority, permissions, allHeaders, allClients] =
      await Promise.all([
        getSingleProjectIndividual(state.id),
        getAllStatusOptions(),
        getAllPriorityOptions(),
        getPermittedHeaders(),
        getAllHeaders(),
        getAllClients(),
      ]);

    if (project?.status) {
      setSelectedProject(project.data);
      setCurrentProject(project.data);
    }
    if (status?.status) {
      setStatusGroup(status.data);
    }
    if (priority?.status) {
      setPriorityGroup(priority.data);
    }
    if (permissions?.status) {
      setPermittedHeaders(permissions.data);
    }

    if (allHeaders?.status) {
      setHeaders(allHeaders.data);
    }
    if (allClients?.status) {
      setClientGroup(allClients.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getSelectedProject();
  }, []);

  const formHandler = () => {
    if (isFormOpen) {
      setTaskSubTaskIds({});
    }
    setIsFormOpen((previous) => !previous);
  };

  const addSubTask = async (taskid) => {
    const selectedTask = selectedProject?.find((task) => task._id === taskid);
    const lastSubTaskExists = selectedTask?.subTasks?.slice(-1)[0]?.task.length;

    if (lastSubTaskExists || !selectedTask?.subTasks?.length) {
      setTaskSubTaskIds({ taskId: taskid, subTaskId: "" });
      formHandler();
    }
  };

  const dueDateChanger = async (taskid, subTaskId, date) => {
    const dateChangeResponse = await dueDateUpdate(state.id, subTaskId, date);
    const updateProject = (selected) =>
      selected.map((task) =>
        task._id === taskid
          ? {
              ...task,
              subTasks: task.subTasks.map((subTasks) =>
                subTasks._id === subTaskId
                  ? { ...subTasks, dueDate: date }
                  : subTasks
              ),
            }
          : task
      );

    setSelectedProject((previous) => updateProject(previous));
    setCurrentProject((previous) => updateProject(previous));

    setLiveUpdationDate({
      projectId: state?.id,
      taskId: taskid,
      subTaskId,
      field: "dueDate",
      value: date,
      notification: {
        ...dateChangeResponse.notification,
        assignerName: userData.userName,
        assignerImg: userData.profilePhotoURL,
      },
    });

    if (!dateChangeResponse?.status) {
      toast.error(dateChangeResponse.message);
    }
  };

  const addHeaderOpenHandler = () => {
    setAddHeaderOpen((previous) => !previous);
  };

  const subTaskChatModalHandler = () => {
    setOpenChat((previous) => !previous);
  };
  subTaskChatModalHandler;

  const subTaskChatModalOpenHandler = (chatExistance) => {
    subTaskChatModalHandler();
    setChatExists(chatExistance);
  };

  const removeOrExportTaskModalHandler = () => {
    setOpenRemoveOrExportTaskModal((previous) => !previous);
  };

  const removeOrExportTaskModalOpen = (option, task) => {
    setExportOrRemoveOption(option);
    removeOrExportTaskModalHandler();
    setTaskData(task);
  };

  const updateDynamicField = async (
    fieldTaskId,
    fieldSubTaskId,
    field,
    value
  ) => {
    const dynamicFieldUpdateResponse = await dynamicFieldUpdate(
      state.id,
      fieldSubTaskId,
      field,
      value
    );
    if (dynamicFieldUpdateResponse?.status) {
      const updateProject = (selected) =>
        selected.map((task) =>
          task._id === fieldTaskId
            ? {
                ...task,
                subTasks: task.subTasks.map((subTask) =>
                  subTask._id === fieldSubTaskId
                    ? { ...subTask, [field]: value }
                    : subTask
                ),
              }
            : task
        );

      setSelectedProject((previous) => updateProject(previous));
      setCurrentProject((previous) => updateProject(previous));

      setLiveUpdationDynamicField({
        projectId: state?.id,
        taskId: fieldTaskId,
        subTaskId: fieldSubTaskId,
        field,
        value,
        notification: {
          ...dynamicFieldUpdateResponse.notification,
          assignerName: userData.userName,
          assignerImg: userData.profilePhotoURL,
        },
      });
    } else {
      toast.error(dynamicFieldUpdateResponse.message);
    }
  };

  // Filter project according to selection
  const filterProject = (type, selection) => {
    setSelectedProject(
      currentProject
        .map((task) => {
          const filteredSubTasks = task.subTasks?.filter((subTask) => {
            if (type === "subTask") {
              if (person?._id) {
                return (
                  selection.test(subTask.task) &&
                  subTask.people.some(
                    (eachPerson) => eachPerson._id === person._id
                  )
                );
              } else {
                return selection.test(subTask.task);
              }
            } else {
              if (subTaskName.length) {
                const regex = new RegExp(subTaskName, "i");
                return (
                  regex.test(subTask.task) &&
                  subTask.people.some(
                    (eachPerson) => eachPerson._id === selection._id
                  )
                );
              } else {
                return subTask.people.some(
                  (eachPerson) => eachPerson._id === selection._id
                );
              }
            }
          });

          if (filteredSubTasks.length) {
            return {
              ...task,
              subTasks: filteredSubTasks,
            };
          }
          return null;
        })
        .filter((each) => each !== null)
    );
  };

  const searchInputToggle = () => {
    if (!openSearchInput) {
      setTimeout(() => {
        searchTaskRef?.current?.focus();
      }, 500);
    }
    setOpenSearchInput((previous) => !previous);
  };

  const removeProjectFilter = (type) => {
    if (type === "subTask") {
      setSubTaskName("");
      setSelectedProject(
        currentProject
          .map((task) => {
            const filteredSubTasks = task.subTasks?.filter((subTask) => {
              if (person?._id) {
                return subTask.people.some(
                  (eachPerson) => eachPerson._id === person._id
                );
              } else {
                return subTask;
              }
            });
            if (filteredSubTasks.length) {
              return {
                ...task,
                subTasks: filteredSubTasks,
              };
            }
            return null;
          })
          .filter((each) => each !== null)
      );
    } else {
      setPerson({});
      setSelectedProject(
        currentProject
          .map((task) => {
            const filteredSubTasks = task.subTasks?.filter((subTask) => {
              if (subTaskName.length) {
                const regex = new RegExp(subTaskName, "i");
                return regex.test(subTask.task);
              } else {
                return subTask;
              }
            });
            if (filteredSubTasks.length) {
              return {
                ...task,
                subTasks: filteredSubTasks,
              };
            }
            return null;
          })
          .filter((each) => each !== null)
      );
    }
  };

  const handleSortToggle = () => setOpenSort((previous) => !previous);

  const sortTasks = (method) => {
    setSelectedProject((previous) =>
      previous
        .map((task) => ({
          ...task,
          subTasks: task.subTasks ? [...task.subTasks] : [],
        }))
        .sort((a, z) => {
          return method === "A-Z"
            ? a.name.localeCompare(z.name)
            : z.name.localeCompare(a.name);
        })
        .map((sortedTask) =>
          sortedTask.subTasks.length
            ? {
                ...sortedTask,
                subTasks: sortedTask.subTasks.sort((a, z) => {
                  return method === "A-Z"
                    ? a.task.localeCompare(z.task)
                    : z.task.localeCompare(a.task);
                }),
              }
            : sortedTask
        )
    );

    handleSortToggle();
  };

  const filterByDatePopupHandler = () => setOpenFilterBydate((prev) => !prev);

  const [filteredDate, setFilteredDate] = useState({});

  const filterTasks = () => {
    if (!filteredDate.startDate || !filteredDate.endDate) {
      alert("Please select both start and end dates");
      return;
    }

    const isDateInRange = (date, startDate, endDate) => {
      // console.log("start date", startDate.format());

      const taskDate = dayjs(date);
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      console.log("Is task date valid?", taskDate);
      // console.log("Is start date valid?", start.isValid(), start);
      // console.log("Is end date valid?", end.isValid(), end);

      // console.log(
      //   "Comparing task date:",
      //   taskDate.format(),
      //   "to start:",
      //   start.format(),
      //   "and end:",
      //   end.format()
      // );
      // console.log(
      //   "Comparison result:",
      //   taskDate.isAfter(start),
      //   taskDate.isBefore(end)
      // );

      // return taskDate.isSameOrAfter(start) && taskDate.isBefore(end);
    };

    setSelectedProject((previous) =>
      previous.map((project) => ({
        ...project,
        subTasks: project.subTasks.filter((task) =>
          isDateInRange(task.dueDate, startDate, endDate)
        ),
      }))
    );

    console.log("Selected project", selectedProject);

    console.log(selectedProject);

    // setSelectedProject((previous) =>
    //   previous.map((project) => ({
    //     ...project,
    //     subTasks: project.subTasks.filter((task) => {
    //       const taskDate = dayjs(task.dueDate);
    //       return taskDate.isAfter(startDate) && taskDate.isBefore(endDate);
    //     }),
    //   }))
    // );

    // const filteredTasks = selectedProject.map(task => ({
    //   ...task,
    //   subTasks: task.subTasks ? [...task.subTasks] : [],
    // })).filter(task => {
    //   const taskDate = dayjs(task.date);
    //   return taskDate.isAfter(startDate) && taskDate.isBefore(endDate);
    // }).map(filteredTask =>
    //   filteredTask.subTasks.length
    //     ? {
    //         ...filteredTask,
    //         subTasks: filteredTask.subTasks.filter(subTask => {
    //           const subTaskDate = dayjs(subTask.date);
    //           return subTaskDate.isAfter(startDate) && subTaskDate.isBefore(endDate);
    //         }),
    //       }
    //     : filteredTask
    // );

    // setFilteredTasks(filteredTasks);
    // console.log(selectedProject);

    filterByDatePopupHandler();
  };

  const searchSubTask = (event) => {
    const { value } = event.target;
    setSubTaskName(value);

    if (value.length) {
      setIsFiltered(true);
      const regex = new RegExp(value, "i");
      filterProject("subTask", regex);
    } else {
      removeProjectFilter("subTask");
    }
  };

  const handleClickOutside = useCallback(
    (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        searchInputToggle();
      }
    },
    [searchInputToggle]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const dynamicFieldModalHandler = () =>
    setOpenDynamicSelectFieldModal((previous) => !previous);

  const addOptionModalToggle = (headerType) => {
    setDynamicSelectFieldType(headerType);
    dynamicFieldModalHandler();
  };

  // People selection Modal Handler
  const peopleModalHandler = () => setOpenPeopleModal((previous) => !previous);

  const currentSubTaskPeopleModalHandler = (ids, peopleArray) => {
    setCurrentSubTaskPeople(peopleArray);
    setTaskSubTaskIds(ids);
    peopleModalHandler();
  };

  const taskArrangePopupHandler = () =>
    setOpenTaskArrangePopup((previous) => !previous);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mt-20 p-5 w-full h-[calc(100vh-5.5rem)] overflow-y-hidden">
      <h1 className="text-2xl font-bold uppercase text-white">
        {state?.name ?? "Project"}
      </h1>
      <div className="mt-2 flex gap-2 h-8">
        {openSearchInput ? (
          <div ref={searchInputRef} className="relative z-20">
            <Input
              onChange={searchSubTask}
              defaultValue={subTaskName}
              className="rounded pr-5"
              placeholder="Search"
              maxLength={25}
              ref={searchTaskRef}
            />
            <BiSearchAlt2 className="absolute bottom-1/2 translate-y-1/2 right-1 w-3 h-3" />
          </div>
        ) : subTaskName ? (
          <button className="max-w-28 flex items-center gap-1 transition duration-150 text-slate-500 bg-maingreen shadow-md py-1 px-2 rounded outline-none">
            <p className="text-nowrap whitespace-nowrap overflow-hidden overflow-ellipsis">
              {subTaskName}
            </p>
            <IoMdCloseCircle
              onClick={() => removeProjectFilter("subTask")}
              className="w-4 h-4"
            />
          </button>
        ) : (
          <button
            onClick={searchInputToggle}
            className="flex items-center gap-1 transition duration-150 text-slate-500 bg-[#ffffffcd] hover:bg-maingreen hover:shadow-md py-1 px-2 rounded outline-none"
          >
            <IoIosSearch />
            <p className="hidden md:block uppercase text-xs font-semibold">
              Search
            </p>
          </button>
        )}
        <Popover placement="bottom" open={openSort} handler={handleSortToggle}>
          <PopoverHandler>
            <button
              className={`flex items-center gap-1 transition duration-150 text-slate-500 bg-[#ffffffcd] hover:bg-maingreen  hover:shadow-md py-1 px-2 rounded outline-none ${
                openSort && "bg-maingreen"
              }`}
            >
              <BsSortAlphaUp />
              <p className="hidden md:block uppercase text-xs font-semibold">
                Sort
              </p>
            </button>
          </PopoverHandler>
          <PopoverContent className="p-1 rounded flex flex-col gap-1 cursor-pointer z-10">
            <p
              onClick={() => sortTasks("A-Z")}
              className="px-2 hover:bg-gray-100 rounded"
            >
              A - Z
            </p>
            <p
              onClick={() => sortTasks("Z-A")}
              className="px-2 hover:bg-gray-100 rounded"
            >
              Z - A
            </p>
          </PopoverContent>
        </Popover>
        <Popover
          open={openTaskArrangePopup}
          handler={taskArrangePopupHandler}
          placement="bottom"
        >
          <PopoverHandler>
            <button
              className={`rounded flex gap-1 items-center py-1 px-2 transition duration-150 text-slate-500 bg-[#ffffffcd] hover:bg-maingreen hover:shadow-md outline-none ${
                openTaskArrangePopup && "bg-maingreen shadow-lg"
              }`}
            >
              <TfiExchangeVertical className="w-4 h-4" />
              <p className="hidden md:block uppercase text-xs font-semibold">
                Arrange Tasks
              </p>
            </button>
          </PopoverHandler>
          <PopoverContent className="p-2 w-52 max-h-96 shadow-xl z-10">
            <div className="flex flex-col gap-2 overflow-y-scroll no-scrollbar">
              {selectedProject?.length ? (
                selectedProject.map(({ _id, name }) => {
                  return (
                    <p
                      draggable
                      onDragStart={(e) => onDragStart(e, _id)}
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, _id)}
                      key={_id}
                      className="pl-2 py-1 text-black mx-1 cursor-move rounded capitalize bg-gray-200 hover:bg-maingreen text-sm text-nowrap whitespace-nowrap overflow-hidden overflow-ellipsis"
                    >
                      {name}
                    </p>
                  );
                })
              ) : (
                <p className="text-white m-auto text-center">No Tasks</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="my-4 overflow-y-scroll h-[calc(100vh-13rem)] no-scrollbar">
        <div className="flex flex-col gap-4 ">
          {selectedProject.length ? (
            selectedProject.map((singleTable, index) => (
              <TaskTable
                key={singleTable._id}
                projectId={state.id}
                singleTable={singleTable}
                addSubTask={addSubTask}
                dueDateChanger={dueDateChanger}
                classes={classes}
                subTaskChatModalOpenHandler={subTaskChatModalOpenHandler}
                isAdmin={isAdmin}
                projectPermitted={projectPermitted}
                removeOrExportTaskModalOpen={removeOrExportTaskModalOpen}
                addHeaderOpenHandler={addHeaderOpenHandler}
                updateDynamicField={updateDynamicField}
                addOptionModalToggle={addOptionModalToggle}
                statusGroup={statusGroup}
                clientGroup={clientGroup}
                priorityGroup={priorityGroup}
                currentSubTaskPeopleModalHandler={
                  currentSubTaskPeopleModalHandler
                }
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                index={index + 1}
                taskCount={selectedProject.length}
              />
            ))
          ) : (
            <p className="text-white text-8xl">No Projects found</p>
          )}
        </div>
      </div>
      <Dialog
        dismiss={{ escapeKey: false, outsidePress: false }}
        open={openChat}
        handler={subTaskChatModalHandler}
        size="md"
        className="outline-none"
      >
        <SubTaskChat
          subTaskChatModalHandler={subTaskChatModalHandler}
          chatExists={chatExists}
        />
      </Dialog>
    </div>
  );
};

export default Work;
