import React from "react";

const NoData = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full my-24 text-center">
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-10 rounded-2xl shadow-inner">
        <img
          src="/assets/empty.svg"
          alt="No data"
          className="w-56 h-56 opacity-90"
        />
        <p className="mt-6 text-gray-700 dark:text-gray-300 text-lg font-medium tracking-wide">
          {title || "No data found"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Try adjusting filters or come back later.
        </p>
      </div>
    </div>
  );
};

export default NoData;
