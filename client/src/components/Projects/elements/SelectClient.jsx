import { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import {
  permittedHeadersAtom,
  projectHeadersAtom,
} from "../../../recoil/atoms/projectAtoms";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

const SelectClient = ({
  currentValue,
  valueGroup,
  updateSubTaskOption,
  headerType,
  classes,
  isAdmin,
  addOptionModalToggle,
  projectPermitted,
}) => {
  const [currentOption, setCurrentOption] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const headers = useRecoilValue(projectHeadersAtom);
  const buttonWidth = headers.find(
    (header) => header.key === headerType
  )?.width;
  const permittedHeaders = useRecoilValue(permittedHeadersAtom);
  console.log(valueGroup);

  const isNotAllowed = permittedHeaders?.some(
    (head) => head.key === headerType
  );

  const navigate = useNavigate();
  const isAccess = isAdmin
    ? true
    : isNotAllowed
    ? projectPermitted?.allowedPermissions?.includes(headerType) ?? false
    : true;

  const toggleDropdown = () => {
    if (isAccess) {
      setIsOpen((previous) => !previous);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setCurrentOption(currentValue);
    setCurrentColor(
      valueGroup?.length
        ? valueGroup.find((single) => single.option === currentValue)?.color
        : "#9C2800"
    );
  }, [currentValue]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openOptionModal = () => {
    navigate("/settings");
  };

  const changeOption = (option) => {
    setCurrentOption(option.client);
    setCurrentColor(option.color);
    setIsOpen(true);
    updateSubTaskOption(headerType, option.client);
    console.log("HeaderType", headerType);
    console.log("Option", option.client);
  };

  return (
    <td
      onClick={toggleDropdown}
      ref={dropdownRef}
      style={{ backgroundColor: currentOption ? ` #9C2800` : "white" }}
      className={`${classes} relative cursor-pointer capitalize text-white text-nowrap text-center w-36`}
    >
      {currentOption}
      {isOpen && (
        <div className="z-20 absolute p-2 rounded bg-white shadow-xl border w-36 md:w-96 ">
          <div className="text-center cursor-pointer text-sm flex justify-center items-center flex-col md:flex-row gap-2 flex-wrap">
            {valueGroup?.map((options, index) => (
              <div
                onClick={() => changeOption(options)}
               
                className={`text-black hover:bg-opacity-80 rounded min-w-32 px-2 py-1.5 bg-maingreen hover:bg-maingreenhvr  `}
                key={index}
              >
                {options.client}
              </div>
            ))}
          </div>
          <div
            onClick={openOptionModal}
            className={`bg-gray-200 hover:bg-gray-300 text-blue-gray-700 rounded px-2 py-1.5 w-fit mx-auto mt-2`}
          >
            <BiPlus className="w-4 h-4" />
          </div>
        </div>
      )}
    </td>
  );
};

export default SelectClient;
