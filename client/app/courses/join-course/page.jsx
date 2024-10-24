"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinCoursePage() {
  const [courseCode, setCourseCode] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courseCode) {
      alert("Please enter a course code");
      return;
    }

    try {
      const response = await fetch("/api/join-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseCode }),
      });

      if (response.ok) {
        alert("Joined course successfully!");
        setCourseCode(""); // Clear the input field
        router.push("/courses"); // Redirect to courses page
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to join course");
      }
    } catch (error) {
      console.error("Error joining course:", error);
      alert("Error joining course. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen px-12 pt-6 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Join Course</h1>
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700">Course Code</label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="mt-2 block w-full border border-gray-300 rounded-lg p-3 focus:border-orange"
            placeholder="Enter course code"
          />
        </div>
        <div className="flex space-x-6">
          <button type="submit" className="bg-orange text-white px-6 py-3 rounded-lg hover:bg-red-600 transition">
            Join
          </button>
        </div>
      </form>
    </div>
  );
}