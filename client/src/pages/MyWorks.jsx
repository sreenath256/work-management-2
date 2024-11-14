import { BiPlus, BiSearchAlt2, BiFilterAlt, BiSort } from "react-icons/bi";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { allProjectsAtom } from "../recoil/atoms/projectAtoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getAllProjects } from "../api/apiConnections/projectConnections";
import { FormComponent } from "../components/Home/FormComponent";
import { SingleProject } from "../components/Home/SingleProject";
import {
  cloneAProject,
  removeAProject,
} from "../api/apiConnections/adminConnections";
import { toast } from "react-toastify";
import { liveUpdationAddRemoveProjectAtom } from "../recoil/atoms/liveUpdationAtoms";
import { userDataAtom } from "../recoil/atoms/userAtoms";

const MyWorks = () => {
  const user = useRecoilValue(userDataAtom);
  const [projects, setProjects] = useRecoilState(allProjectsAtom);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openRemoveOrCloneConfirmModal, setOpenRemoveOrCloneConfirmModal] =
    useState(false);
  const [currentProject, setCurrentProject] = useState({ _id: "", name: "" });
  const [isCloneable, setIsCloneable] = useState(false);

  // Live Updations
  const setLiveUpdationAddRemoveProject = useSetRecoilState(
    liveUpdationAddRemoveProjectAtom
  );

  const getProjects = async () => {
    const response = await getAllProjects();
    if (response?.status) {
      setProjects(response.data);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const formHandler = () => {
    if (currentProject?.name) {
      setCurrentProject({ _id: "", name: "" });
    }
    setIsFormOpen(!isFormOpen);
  };

  const removeOrCloneProjectHandler = () =>
    setOpenRemoveOrCloneConfirmModal((previous) => !previous);

  const projectUpdationHandler = (type, projectData) => {
    setCurrentProject(projectData);
    if (type === "edit") {
      formHandler();
    } else if (type === "remove") {
      setIsCloneable(false);
      removeOrCloneProjectHandler();
    } else if (type === "clone") {
      setIsCloneable(true);
      removeOrCloneProjectHandler();
    }
  };

  const removeOrCloneProject = async () => {
    removeOrCloneProjectHandler();
    if (isCloneable) {
      const response = await cloneAProject(
        currentProject._id,
        currentProject.name
      );
      if (response?.status) {
        setProjects((previous) => [response.data, ...previous]);
        setLiveUpdationAddRemoveProject({
          project: response.data,
          isAdded: true,
          notification: {
            ...response.notification,
            assignerName: user.userName,
            assignerImg: user.profilePhotoURL,
          },
        });
        toast.success("Project Cloned");
      } else {
        toast.error("Project cloning failed");
      }
    } else {
      const response = await removeAProject(
        currentProject._id,
        currentProject.name
      );
      if (response?.status) {
        setProjects((previous) =>
          previous.filter((project) => project._id !== currentProject._id)
        );
        setLiveUpdationAddRemoveProject({
          project: { _id: currentProject._id },
          isAdded: false,
          notification: {
            ...response.notification,
            assignerName: user.userName,
            assignerImg: user.profilePhotoURL,
          },
        });
        toast.success("Project removed");
      } else {
        toast.error("Project removal failed");
      }
    }
  };

  return (
    <div className="mt-20 mr-1 mb-1 p-5 w-full h-[calc(100vh-5.75rem)] overflow-y-hidden">
      {/* Dashboard Content */}
      <div className="text-white">
        <h1 className="text-2xl font-bold">My Projects</h1>
      </div>

      {/* Projects Table */}
      <div className="my-2 overflow-y-scroll projectscl h-[calc(100vh-13rem)]">
        <div className="pb-3 grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {projects?.length
            ? projects.map((project) => (
                <SingleProject
                  key={project._id}
                  project={project}
                  projectUpdationHandler={projectUpdationHandler}
                  navigatePath="work"
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default MyWorks;
