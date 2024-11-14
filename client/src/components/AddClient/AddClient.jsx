import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { IoTrashOutline } from "react-icons/io5";

import { useEffect, useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import baseURL from "../../api/baseURL";
import { LoadingSpinner } from "../Home/LoadingSpinner";

export const AddClient = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState("");
  const [loading, setLoading] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [flag, setFlag] = useState(false);
  const [error, setError] = useState("");
  const [deleteClient, setDeleteClient] = useState({ id: "", client: "" });

  const confirmModalHandler = (client = "", id = "") => {
    setOpenConfirmModal((previous) => !previous);
    setDeleteClient({ client: client, id: id });
  };

  const loadingHandler = () => setLoading((previous) => !previous);

  const getClients = async () => {
    try {
      loadingHandler();
      const response = await baseURL.get("/client/getAllClients");
      if (response?.status) {
        setClients(response.data.data);
      }
    } catch (error) {
      console.error(`Error getting clients : ${error.message}`);
      toast.error("Internal error");
    } finally {
      loadingHandler();
    }
  };

  useEffect(() => {
    getClients();
  }, [flag]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent any default behavior like form submission
      AddClient();
    }
  };

  const handleClientChange = async (client) => {
    setNewClient(client);
  };

  const AddClient = async () => {
    try {
      loadingHandler();

      const response = await baseURL.post("/client/addClient", {
        client: newClient,
      });

      if (response?.status) {
        toast.success(response.message);
        setNewClient("");
        setFlag((previous) => !previous);
      } else {
        toast.error(response.message);
        setError(response.message);
      }
    } catch (error) {
      console.error(`Error adding client : ${error.message}`);
      toast.error("Internal error");
      setError(response.message);
    } finally {
      loadingHandler();
    }
  };

  const removeClient = async () => {
    confirmModalHandler();
    try {
      loadingHandler();

      const response = await baseURL.delete(
        `/client/removeClient/${deleteClient.id}`
      );
      console.log(response);

      if (response?.status) {
        toast.success(response.data.message);

        setFlag((previous) => !previous);
      } else {
        toast.error(response.message);
        setError(response.message);
      }
    } catch (error) {
      console.error(`Error adding client : ${error.message}`);
      toast.error("Internal error");
      setError(response.message);
    } finally {
      loadingHandler();
    }
  };

  return (
    <div>
      <div className="text-center ">
        <label className=" bg-maingreen  text-black text-center py-2 px-4 rounded cursor-pointer text-nowrap   ">
          <input
            className="rounded-md mr-2 outline-none px-5"
            onChange={(e) => handleClientChange(e.target?.value)}
            name="client"
            value={newClient}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Enter client name here..."
            autoComplete="off"
          />
        </label>
        <button
          className="ml-2 bg-maingreen hover:bg-maingreenhvr text-black text-center py-1 px-3 rounded-lg cursor-pointer text-nowrap"
          onClick={AddClient}
        >
          Add
        </button>
      </div>

      <div className="flex  items-center justify-center overflow-y-scroll no-scrollbar max-h-96 p-4 my-2">
        {loading ? (
          <PacmanLoader color="#AFFE00" />
        ) : (
          clients?.map((client, index) => {
            return (
              <div
                key={index}
                className="bg-maingreen p-2 text-center flex gap-5 justify-between rounded-lg capitalize hover:bg-maingreenhvr text-black items-center mx-3  "
              >
                <p>{client.client}</p>
                <IoTrashOutline
                  className="hover:cursor-pointer"
                  onClick={() => confirmModalHandler(client.client, client._id)}
                />
              </div>
            );
          })
        )}
      </div>

      <Dialog
        open={openConfirmModal}
        handler={confirmModalHandler}
        size="xs"
        className="outline-none text-center"
      >
        <DialogBody>
          <Typography variant="h4" className="pt-4 px-8">
            Do you want to delete this client
            <span className="text-red-400 pl-2">{deleteClient.client}</span>?
          </Typography>
        </DialogBody>
        <DialogFooter className="mx-auto text-center flex justify-center items-center gap-4">
          <Button
            onClick={removeClient}
            className={`${"bg-maingreen text-blackbg-red-600"} w-24 py-2`}
          >
            Yes
          </Button>
          <Button
            onClick={confirmModalHandler}
            color="black"
            className="w-24 py-2"
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
