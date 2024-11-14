import { useRecoilState } from "recoil";
import {
  Button,
  Dialog,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { Banner } from "../components/Settings/Banner";
import { useState } from "react";
import { AddClient } from "../components/AddClient/AddClient";
import AddClients from "./AddClients";

const AddBanner = () => {
  const [openBannerModal, setOpenBannerModal] = useState(false);

  const openBannerModalHandler = () => {
    setOpenBannerModal((previous) => !previous);
  };

  return (
    <div className="p-8">
      <Button
        onClick={openBannerModalHandler}
        className="capitalize bg-maingreenhvr text-black"
        variant="filled"
      >
        Banner
      </Button>
      <Dialog
        open={openBannerModal}
        handler={openBannerModalHandler}
        size="xl"
        className="outline-none"
      >
        <Typography variant="h3" className="text-center p-4">
          Choose your favourite banner...
        </Typography>

        <Banner />
      </Dialog>
    </div>
  );
};

export default AddBanner;
