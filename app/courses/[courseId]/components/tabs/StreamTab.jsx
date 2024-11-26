"use client";

import React from 'react';

const StreamTab = ({ course }) => {
  return (
    <>
      {/* Upcoming Work Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-gray-900">Upcoming</h2>
          <button className="text-sm text-[#cf4500] hover:text-[#ff5500]">
            View all
          </button>
        </div>
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">📚</div>
          <h3 className="text-sm font-medium text-gray-900">No work due</h3>
          <p className="text-sm text-gray-500 mt-1">Woohoo!</p>
        </div>
      </div>

      {/* Stream Posts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="border-b pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#fff5f0] flex items-center justify-center">
              <span className="text-[#cf4500] text-sm">👋</span>
            </div>
            <button className="flex-1 text-left px-4 py-2 rounded-full border hover:bg-gray-50 text-gray-500 text-sm">
              Announce something to your class
            </button>
          </div>
        </div>

        {/* Welcome Post */}
        <div className="rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#fff5f0] flex items-center justify-center">
                <span className="text-[#cf4500] text-lg">👨‍🏫</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Course Instructor</p>
                <p className="text-xs text-gray-500">
                  {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StreamTab;
