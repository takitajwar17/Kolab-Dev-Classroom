"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical, BsPlus } from "react-icons/bs";

const CourseSection = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Latest", "Owned", "Enrolled", "Archived"];
  const [courses, setCourses] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const plusMenuRef = useRef(null);

  // Close the menu if user clicks outside of it
  // Issue: Menu gets closed even if I try to click on 'Edit/Archive/Delete'
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setMenuOpen(null); // Close the menu
  //     }
  //   };

  //   // Add event listener to the document
  //   document.addEventListener("mousedown", handleClickOutside);

  //   // Cleanup the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [menuOpen]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses/owned");
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);
  
  const handleEdit = (id) => {
    // Handle edit logic here
    router.push(`/courses/edit-course/${id}`);
    console.log(id);
  };

  const handleArchive = (id) => {
    // Handle archive logic here
  };

  const handleDelete = (id) => {
    // Handle delete logic here
  };

  return (
    <div className="bg-white min-h-screen px-12 pt-4 text-gray-800">
      {/* Title and Horizontal Rule */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-2">Courses</h1>
        <div className="relative" ref={plusMenuRef}>
          <button
            className=" text-orange  hover:bg-orange-700 font-bold text-4xl p-2 rounded-full"
            onClick={() => setPlusMenuOpen(!plusMenuOpen)}
          >
            <BsPlus size={36} />
          </button>
          {plusMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border-2 border-gray-200 rounded-lg shadow-lg">
              <ul className="text-left">
                <li className="w-full rounded-lg px-2 py-2 text-center text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <Link href="/courses/join-course">Join Course</Link>
                </li>
                <li className="w-full rounded-lg px-2 py-2 text-center text-gray-700 hover:bg-gray-100 cursor-pointer">
                  <Link href="/courses/create-course">Create Course</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
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
        <div className="flex items-center ml-auto bg-gray-100 p-2 rounded-lg w-full max-w-2xl max-h-10">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-gray-700 w-full py-0.25 px-2"
          />
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            {/* Title and 3-dot Menu Container */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-700 flex-1">
                {course.title}
              </h3>

              {/* 3-dot Menu Button */}
              <div className="relative" ref={menuRef}>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setMenuOpen(index === menuOpen ? null : index)} // Toggle menu
                >
                  <BsThreeDotsVertical />
                </button>

                {/* Dropdown Menu */}
                {menuOpen === index && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <ul className="text-left">
                      <li
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleEdit(course._id)}
                      >
                        Edit
                      </li>
                      <li
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleArchive(course.id)}
                      >
                        Archive
                      </li>
                      <li
                        className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleDelete(course.id)}
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Card Description */}
            <p className="text-gray-500 mb-4">{course.description}</p>

            {/* View Course Button */}
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
