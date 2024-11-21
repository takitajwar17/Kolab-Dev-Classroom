"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function CoursePage({ params }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { userId, isLoaded } = useAuth();

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

    if (userId) {
      fetchCourse();
    }
  }, [params.courseId, userId, isLoaded, router]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
          <h1 className="text-3xl font-bold text-white">{course.title}</h1>
          <p className="text-blue-100 mt-2">Course Code: {course.courseCode}</p>
        </div>

        {/* Course Details */}
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Course</h2>
            <p className="text-gray-600">{course.description}</p>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Enrolled Students</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {course.enrolledStudents?.length || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Tasks</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {course.tasks?.length || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {new Date(course.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Tasks Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Tasks</h2>
            {course.tasks?.length > 0 ? (
              <div className="space-y-4">
                {course.tasks.map((task, index) => (
                  <div
                    key={task._id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">Task {index + 1}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No tasks have been added to this course yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
