"use client";

import React from 'react';

const Sidebar = ({ course, courseUsers }) => {
  return (
    <div className="space-y-4 order-first lg:order-last">
      {/* Course Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-base font-medium text-gray-900 mb-4">Class Information</h2>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Students</p>
            <p className="mt-1 text-sm text-gray-900">
              {courseUsers?.enrolledStudents?.length || 0} students
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Class Code</p>
            <p className="mt-1 text-sm text-gray-900">{course.courseCode}</p>
          </div>
        </div>
      </div>

      {/* Tasks Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-gray-900">Tasks</h2>
          <button className="text-sm text-[#cf4500] hover:text-[#ff5500]">
            View all
          </button>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            0 tasks
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
