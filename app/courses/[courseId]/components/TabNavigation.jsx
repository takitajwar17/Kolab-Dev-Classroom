"use client";

import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white rounded-t-lg shadow-sm mb-6 overflow-x-auto">
      <div className="flex px-6 min-w-max">
        <button
          onClick={() => setActiveTab("stream")}
          className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
            activeTab === "stream"
              ? "text-[#cf4500] border-b-2 border-[#cf4500]"
              : "text-gray-500 hover:text-[#cf4500]"
          }`}
        >
          Stream
        </button>
        <button
          onClick={() => setActiveTab("classwork")}
          className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
            activeTab === "classwork"
              ? "text-[#cf4500] border-b-2 border-[#cf4500]"
              : "text-gray-500 hover:text-[#cf4500]"
          }`}
        >
          Classwork
        </button>
        <button
          onClick={() => setActiveTab("people")}
          className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
            activeTab === "people"
              ? "text-[#cf4500] border-b-2 border-[#cf4500]"
              : "text-gray-500 hover:text-[#cf4500]"
          }`}
        >
          People
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
