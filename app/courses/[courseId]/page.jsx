"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import CourseHeader from "./components/CourseHeader";
import TabNavigation from "./components/TabNavigation";
import StreamTab from "./components/tabs/StreamTab";
import ClassworkTab from "./components/tabs/ClassworkTab";
import PeopleTab from "./components/tabs/PeopleTab";
import Sidebar from "./components/Sidebar";

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
      <CourseHeader course={course} />

      {/* Main Content */}
      <div className="bg-gray-100 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <Sidebar course={course} courseUsers={courseUsers} />

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-4">
              {activeTab === "stream" && <StreamTab course={course} />}
              {activeTab === "classwork" && <ClassworkTab />}
              {activeTab === "people" && (
                <PeopleTab 
                  courseUsers={courseUsers} 
                  isAdmin={course.admin.includes(userId)}
                  courseId={params.courseId}
                  userId={userId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
