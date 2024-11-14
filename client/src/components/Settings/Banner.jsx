import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Typography,
} from "@material-tailwind/react";
import { SingleBanner } from "./SingleBanner";
import { useEffect, useState } from "react";
import {
  getAllBanners,
  addNewBanner,
  applyBanner,
  removeBanner,
} from "../../api/apiConnections/adminConnections";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../Home/LoadingSpinner";
import { activeBannerAtom } from "../../recoil/atoms/settingsAtom";
import { useRecoilState } from "recoil";


export const Banner = () => {
  const [activeBanner, setActiveBanner] = useRecoilState(activeBannerAtom);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState({});
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const confirmModalHandler = () =>
    setOpenConfirmModal((previous) => !previous);
  const loadingHandler = () => setLoading((previous) => !previous);

  const getBanners = async () => {
    const response = await getAllBanners();
    if (response?.status) {
      setBanners(response.data);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  const addBanner = async (image) => {
    loadingHandler();
    const response = await addNewBanner(image);
    loadingHandler();
    if (response?.status) {
      toast.success(response.message);
      setBanners((previous) => [response.data, ...previous]);
    } else {
      toast.error(response.message);
    }
  };

  const openModal = (selected) => {
    setSelectedBanner(selected);
    confirmModalHandler();
  };

  const removeOrApplyBanner = async () => {
    confirmModalHandler();
    if (selectedBanner.type === "apply") {
      const response = await applyBanner(activeBanner._id, selectedBanner.banner._id);

      if (response?.status) {
        setBanners((previous) =>
          previous.map((banner) => {
            if (banner._id === activeBanner._id) {
              return { ...banner, currentBanner: false };
            } else if (banner._id === selectedBanner.banner._id) {
              return { ...banner, currentBanner: true };
            } else {
              return banner;
            }
          })
        );
        setActiveBanner(selectedBanner.banner)
      }
      
    } else if (selectedBanner.type === "remove") {
      const response = await removeBanner(selectedBanner.banner._id);
      if (response?.status) {
        setBanners((previous) =>
          previous.filter((banner) => banner._id !== selectedBanner.banner._id)
        );
      }
    }
  };

  return (
    <div>
      {loading && (
        <div className="absolute z-10 top-0 backdrop-blur-sm rounded-lg flex justify-center items-center w-full h-full bg-gray-200 bg-opacity-70">
          <LoadingSpinner />
        </div>
      )}
      <div className="text-center">
        <label className=" bg-maingreen hover:bg-maingreenhvr text-black text-center py-2 px-4 rounded cursor-pointer text-nowrap">
          Add
          <input
            className="hidden"
            onChange={(e) => addBanner(e.target?.files?.[0])}
            name="image"
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff,.tif,.svg,.webp,.heic,.avif"
          />
        </label>
      </div>
      
        <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-y-scroll no-scrollbar max-h-96 p-4 my-2">
          {banners?.map((children) => {
            return (
              <SingleBanner
                key={children._id}
                children={children}
                activeBannerId={activeBanner._id}
                openModal={openModal}
              />
            );
          })}
        </div>
      
      <Dialog
        open={openConfirmModal}
        handler={confirmModalHandler}
        size="xs"
        className="outline-none text-center"
      >
        <DialogBody>
          <Typography variant="h4" className="pt-4 px-8">
            {`Do you want to ${selectedBanner.type} this Banner ?`}
          </Typography>
        </DialogBody>
        <DialogFooter className="mx-auto text-center flex justify-center items-center gap-4">
          <Button
            onClick={removeOrApplyBanner}
            className={`${
              selectedBanner.type === "apply"
                ? "bg-maingreen text-black"
                : "bg-red-600"
            } w-24 py-2`}
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
