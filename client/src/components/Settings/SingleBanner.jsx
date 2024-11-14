import { BiDotsHorizontalRounded } from "react-icons/bi";

export const SingleBanner = ({ children, activeBannerId, openModal }) => {
  
  return (
    <div className={`rounded hover:shadow-xl border-2 p-1 flex flex-col items-end ${activeBannerId === children._id ? "bg-maingreen" : "bg-white"}`}>
      <div className="relative right-0 group">
        {activeBannerId === children._id ? <div className="h-5"></div> : <BiDotsHorizontalRounded className="cursor-pointer w-6 h-5 text-black" />}
        {activeBannerId !== children._id && (
          <div className={`absolute right-0 z-10 bg-white hidden group-hover:flex flex-col justify-center items-center border p-1 shadow-lg rounded w-20 max-w-52`}>
            <div className="w-full cursor-pointer">
              <p
                onClick={() => openModal({ type: "apply", banner: {_id:children._id, bannerURL:children.bannerURL}})}
                className="p-1 pl-2 text-sm hover:bg-gray-200 rounded"
              >
                Apply
              </p>
              <p
                onClick={() => openModal({ type: "remove", banner: {_id:children._id, bannerURL:children.bannerURL}})}
                className="p-1 pl-2 text-sm hover:bg-gray-200 rounded"
              >
                Remove
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="overflow-hidden h-32 w-full">
        <img
          className="hover:scale-105 transition duration-300 ease-linear object-cover w-full h-full"
          src={children.bannerURL}
          alt="Banner image"
        />
      </div>
    </div>
  );
};
