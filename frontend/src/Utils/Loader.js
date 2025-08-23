import React from "react";

const Loader = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        {/* Modern loader with Tailwind animation */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-blue-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-purple-500 animate-spin-slow"></div>
        </div>
        <p className="text-white mt-3 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
