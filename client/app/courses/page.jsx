"use client";
import { useState } from "react";

const CourseSection = () => {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Latest", "Owned", "Enrolled", "Archived"];

  // Demo course details
  const courses = [
    { title: "Course 1", description: "Description for Course 1" },
    { title: "Course 2", description: "Description for Course 2" },
    { title: "Course 3", description: "Description for Course 3" },
    { title: "Course 4", description: "Description for Course 4" },
    // Add more courses as needed
  ];

  return (
    <div className="bg-white min-h-screen px-12 pt-4 text-gray-800">
      {/* Title and Horizontal Rule */}
      <h1 className="text-3xl font-bold mb-2">Courses</h1>
      <hr className="mb-4" />
      {/* Tabs and Search Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 rounded-lg ${
                activeTab === tab
                  ? "bg-orange text-white"
                  : "bg-gray-100 text-gray-600"
              } hover:bg-red-100`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange"
          />
          <svg
            className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m1.93-5.73A7.5 7.5 0 1110.5 3a7.5 7.5 0 017.5 7.5z"
            />
          </svg>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              {course.title}
            </h3>
            <p className="text-gray-500 mb-4">{course.description}</p>
            <button className="bg-orange hover:bg-opacity-80 text-white py-2 px-4 rounded-lg">
              View Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSection;
