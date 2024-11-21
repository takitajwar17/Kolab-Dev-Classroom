// CourseSection.js
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CourseCard from "./CourseCard";
import Header from "./Header";
import JoinCourseModal from "./JoinCourseModal";
import LoadingSkeleton from "./LoadingSkeleton";
import TabsAndSearch from "./TabsAndSearch";
import { FiPlus, FiMoreVertical } from "react-icons/fi";
import { toast } from "react-toastify";
import Link from "next/link";

const CourseSection = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Latest", "Owned", "Enrolled", "Archived"];
  const [courses, setCourses] = useState({ owned: [], enrolled: [] });
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRefs = useRef([]);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const plusMenuRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch courses effect
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses/all-courses");
        if (response.ok) {
          const data = await response.json();
          const ownedCourses = data.owned.map((course) => ({
            ...course,
            courseType: "owned",
          }));
          const enrolledCourses = data.enrolled.map((course) => ({
            ...course,
            courseType: "enrolled",
          }));
          setCourses({ owned: ownedCourses, enrolled: enrolledCourses });
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Click outside effect for menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close course menus
      if (!menuRefs.current.some((ref) => ref && ref.contains(event.target))) {
        setMenuOpen(null);
      }
      
      // Close plus menu
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target)) {
        setPlusMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = (id) => {
    router.push(`/courses/edit-course/${id}`);
  };

  const handleArchive = (id, courseType) => {
    // Handle archive logic here
    console.log(`Archiving course with ID: ${id}`);
  };

  const handleDelete = (id, courseType) => {
    // Handle delete logic here
    console.log(`Deleting course with ID: ${id}`);
  };

  const handleUnenroll = (id, courseType) => {
    // Placeholder for unenroll logic
    console.log(`Unenrolling from course with ID: ${id}`);
  };

  const handleJoinCourse = async (courseCode) => {
    try {
      console.log("Joining course with code:", courseCode);
      setJoinModalOpen(false);
    } catch (error) {
      console.error("Error joining course:", error);
    }
  };

  const handleCreateCourse = () => {
    router.push("/courses/create-course");
    setPlusMenuOpen(false);
  };

  const handleViewCourse = (courseId) => {
    router.push(`/courses/${courseId}`);
  };

  let displayedCourses = [];
  if (activeTab === "All") {
    displayedCourses = [...courses.owned, ...courses.enrolled];
  } else if (activeTab === "Owned") {
    displayedCourses = courses.owned;
  } else if (activeTab === "Enrolled") {
    displayedCourses = courses.enrolled;
  } else if (activeTab === "Latest") {
    displayedCourses = [...courses.owned, ...courses.enrolled].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } else if (activeTab === "Archived") {
    displayedCourses = [...courses.owned, ...courses.enrolled].filter(
      (course) => course.archived
    );
  }

  // Filter courses based on search query
  if (searchQuery) {
    displayedCourses = displayedCourses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-br from-[#1e1e1e] to-[#cf4500] py-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#323231]/70 to-[#ff5500]/80 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-medium text-white">My Courses</h1>
            <div className="flex space-x-4">
              <div className="relative" ref={plusMenuRef}>
                <button
                  onClick={() => setPlusMenuOpen(!plusMenuOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#cf4500] hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  aria-label="Add or join course"
                >
                  <FiPlus className="w-6 h-6" />
                </button>
                {plusMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        setJoinModalOpen(true);
                        setPlusMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Join Course
                    </button>
                    <Link
                      href="/courses/create-course"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Create Course
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Search and Tabs */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex space-x-1 overflow-x-auto pb-2 sm:pb-0">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? "text-white bg-white/20"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-md placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : displayedCourses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating or joining a course"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedCourses.map((course, index) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer"
                onClick={() => handleViewCourse(course._id)}
              >
                <div
                  className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 relative"
                  style={{
                    backgroundColor: course.backgroundColor || "#1a1a1a",
                  }}
                >
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-3 right-3">
                    <div className="relative" ref={(el) => (menuRefs.current[index] = el)}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === index ? null : index);
                        }}
                        className="p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white/90 hover:text-white transition-colors"
                      >
                        <FiMoreVertical />
                      </button>
                      {menuOpen === index && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                          {course.courseType === "owned" ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(course._id);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchive(course._id, course.courseType);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Archive
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(course._id, course.courseType);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                Delete
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnenroll(course._id);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Unenroll
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description || "No description provided"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {course.courseType === "owned" ? "Teaching" : "Enrolled"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {course.enrolledStudents?.length || 0} students
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Join Course Modal */}
      <JoinCourseModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onJoin={handleJoinCourse}
      />
    </div>
  );
};

export default CourseSection;
