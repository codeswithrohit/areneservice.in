import React from "react";

const PreLoader = () => {
  return (
    <div className="preloader">
      <div className="loader">
      <div className="flex justify-center items-center ">
    <div className="relative inline-flex">
        <div className="w-8 h-8 bg-emerald-500 rounded-full"></div>
        <div className="w-8 h-8 bg-emerald-500 rounded-full absolute top-0 left-0 animate-ping"></div>
        <div className="w-8 h-8 bg-emerald-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
    </div>
</div>
      </div>
    </div>
  );
};
export default PreLoader;
