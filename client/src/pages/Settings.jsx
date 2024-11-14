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
import AddBanner from "./AddBanner";

const Settings = () => {
  const [openBannerModal, setOpenBannerModal] = useState(false);

  const openBannerModalHandler = () => {
    setOpenBannerModal((previous) => !previous);
  };

  return (
    <div className="mt-16 p-8 w-full flex justify-start h-[calc(100vh-4.5rem)] overflow-y-hidden">
      <AddBanner />
      <AddClients />
    </div>
  );
};

export default Settings;
