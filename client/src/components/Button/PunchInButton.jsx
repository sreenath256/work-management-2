import React, { useState } from "react";
import { MdLogin } from "react-icons/md";

const PunchInButton = ({ buttonLoading }) => {
  return (
    <button
      className={`
        flex items-center justify-center gap-2
        w-full max-w-xs
        px-6 py-3
        rounded-full
        font-medium text-black
        transition-all duration-200 bg-maingreen hover:bg-maingreenhvr`}
    >
      <MdLogin size={20} />
      {buttonLoading ? "Punching in" : "Punch In"}
    </button>
  );
};

export default PunchInButton;
