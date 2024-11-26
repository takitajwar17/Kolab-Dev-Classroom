"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const PeopleTab = ({ courseUsers, isAdmin, courseId }) => {
  const [isPromoting, setIsPromoting] = useState(false);

  const promoteToAdmin = async (studentId) => {
    try {
      setIsPromoting(true);
      console.log('Promoting student with ID:', studentId);
      const response = await fetch(`/api/courses/${courseId}/promote-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error response:', error);
        throw new Error(error.error || 'Failed to promote student');
      }

      // Refresh the page to show updated roles
      window.location.reload();
    } catch (error) {
      console.error('Error promoting student:', error);
      alert(error.message || 'Failed to promote student to admin');
    } finally {
      setIsPromoting(false);
    }
  };

  return (
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
            <div key={student._id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
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
              {isAdmin && (
                <button
                  onClick={() => promoteToAdmin(student.clerkId)}
                  disabled={isPromoting}
                  className="px-4 py-2 text-sm bg-orange text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPromoting ? 'Promoting...' : 'Make Admin'}
                </button>
              )}
            </div>
          ))}
          {(!courseUsers?.enrolledStudents || courseUsers.enrolledStudents.length === 0) && (
            <p className="text-gray-600">No students enrolled yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeopleTab;
