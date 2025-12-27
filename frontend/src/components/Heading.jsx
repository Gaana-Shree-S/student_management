import React from "react";

const Heading = (props) => {
  return (
    <div className="flex justify-between items-center w-full mb-4">
      <p
        className="font-bold text-3xl text-gray-100 
        border-l-8 border-gradient-to-b from-gray-600 to-gray-800 pl-4 
        tracking-wide bg-gradient-to-r from-gray-700/20 to-gray-900/10 
        rounded-md py-1 transition-all duration-300"
      >
        {props.title}
      </p>
    </div>
  );
};

export default Heading;
