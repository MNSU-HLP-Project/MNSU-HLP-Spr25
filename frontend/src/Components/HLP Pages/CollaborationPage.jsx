import React from "react";
import HLP_LookFors from "../../assets/HLP_Lookfors";

const Collaboration = () => {
  const handleClick = (hlp) => {
    alert(`Clicked on ${hlp}`);
  };
  const lookfors = HLP_LookFors;
  return (
    <div className="flex flex-col items-center p-4 bg-white min-h-screen">
      {/* Roof */}
      <div className="w-40 h-16 bg-red-700 text-white flex items-center justify-center text-lg font-bold rounded-t-lg">
        {lookfors['1'].group}
      </div>

      {/* Pillars */}
      <div className="flex space-x-4 mt-[-10px]">
        <div
          className="bg-red-700 text-white p-4 w-40 text-center rounded-lg cursor-pointer"
          onClick={() => handleClick("HLP 1")}
        >
          <strong>HLP 1</strong>
          <p>{lookfors[1].title}</p>
        </div>

        <div
          className="bg-red-700 text-white p-4 w-40 text-center rounded-lg cursor-pointer"
          onClick={() => handleClick("HLP 3")}
        >
          <strong>HLP 3</strong>
          <p>Collaborate with families to support student learning and secure needed services.</p>
        </div>
      </div>

      {/* Embedded HLPs Section */}
      <h2 className="mt-6 text-xl font-semibold">Embedded HLP’s</h2>
      <div
        className="bg-red-700 text-white p-4 w-48 text-center rounded-lg cursor-pointer mt-2"
        onClick={() => handleClick("HLP 2")}
      >
        <strong>HLP 2:</strong> Organize and facilitate effective meetings with professionals and families.
      </div>
    </div>
  );
};

export default Collaboration;
