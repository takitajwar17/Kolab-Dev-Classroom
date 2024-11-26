"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";

export default function CoursePage({ params }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState("stream");
  const [courseUsers, setCourseUsers] = useState(null);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${params.courseId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch course: ${response.status}`);
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCourseUsers = async () => {
      try {
        const response = await fetch(`/api/courses/${params.courseId}/users`);
        if (!response.ok) {
          throw new Error(`Failed to fetch course users: ${response.status}`);
        }
        const data = await response.json();
        setCourseUsers(data);
      } catch (error) {
        console.error("Error fetching course users:", error);
      }
    };

    if (userId) {
      fetchCourse();
      fetchCourseUsers();
    }
  }, [params.courseId, userId, isLoaded, router]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#cf4500]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-gray-800">Error</h1>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-gray-800">Course not found</h1>
        <p className="text-gray-600 mt-2">The course you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Course Header Banner */}
      <div className="relative h-48 md:h-60 bg-gradient-to-br from-[#1e1e1e] to-[#cf4500]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#323231]/70 to-[#ff5500]/80 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-6">
          <h1 className="text-2xl md:text-4xl font-medium text-white mb-2">{course.title}</h1>
          <p className="text-lg md:text-xl text-white/90 mb-2 md:mb-3">Course Code: {course.courseCode}</p>
          <p className="text-sm md:text-base text-white/80 max-w-3xl line-clamp-2 md:line-clamp-none">{course.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-100 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs Navigation */}
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
              <button
                onClick={() => setActiveTab("grades")}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === "grades"
                    ? "text-[#cf4500] border-b-2 border-[#cf4500]"
                    : "text-gray-500 hover:text-[#cf4500]"
                }`}
              >
                Grades
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
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

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-4">
              {activeTab === "stream" && (
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
              )}

              {activeTab === "classwork" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Classwork</h2>
                  <p className="text-gray-600">No assignments yet.</p>
                </div>
              )}

              {activeTab === "people" && (
                <div className="space-y-6">
                  {/* Teachers/Admin Section */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Teachers ({courseUsers?.admin?.length || 0})</h2>
                    <div className="space-y-4">
                      {courseUsers?.admin?.map((admin) => (
                        <div key={admin._id} className="flex items-center space-x-4">
                          <div className="relative w-10 h-10">
                            <Image
                              src={admin.image_url || "/default-avatar.png"}
                              alt={`${admin.firstName} ${admin.lastName}`}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{`${admin.firstName} ${admin.lastName}`}</p>
                            <p className="text-sm text-gray-600">{admin.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Students Section */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Students ({courseUsers?.enrolledStudents?.length || 0})</h2>
                    <div className="space-y-4">
                      {courseUsers?.enrolledStudents?.map((student) => (
                        <div key={student._id} className="flex items-center space-x-4">
                          <div className="relative w-10 h-10">
                            <Image
                              src={student.image_url || "/default-avatar.png"}
                              alt={`${student.firstName} ${student.lastName}`}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{`${student.firstName} ${student.lastName}`}</p>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                        </div>
                      ))}
                      {(!courseUsers?.enrolledStudents || courseUsers.enrolledStudents.length === 0) && (
                        <p className="text-gray-600">No students enrolled yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "grades" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Grades</h2>
                  <p className="text-gray-600">No grades available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
