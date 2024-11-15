import React, { useState } from "react";
import { MdLogout } from "react-icons/md";

const PunchOutButton = () => {
  return (
    <button
      className={`
        flex items-center justify-center gap-2
        w-full max-w-xs
        px-6 py-3
        rounded-full
        font-medium text-white
        transition-all duration-200 bg-orange-500 hover:bg-orange-600`}
    >
      <MdLogout size={20} />
      Punch Out
    </button>
  );
};

export default PunchOutButton;
