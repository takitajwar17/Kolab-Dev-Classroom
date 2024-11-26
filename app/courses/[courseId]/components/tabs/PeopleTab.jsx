"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const PeopleTab = ({ courseUsers, isAdmin, courseId, userId }) => {
  const [isPromoting, setIsPromoting] = useState(false);
  const [isDemoting, setIsDemoting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

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

  const demoteAdmin = async (adminId) => {
    try {
      setIsDemoting(true);
      console.log('Demoting admin with ID:', adminId);
      const response = await fetch(`/api/courses/${courseId}/demote-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminId }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error response:', error);
        throw new Error(error.error || 'Failed to demote admin');
      }

      // Refresh the page to show updated roles
      window.location.reload();
    } catch (error) {
      console.error('Error demoting admin:', error);
      alert(error.message || 'Failed to demote admin');
    } finally {
      setIsDemoting(false);
    }
  };

  const removeFromClass = async (userId, role) => {
    try {
      setIsRemoving(true);
      console.log('Removing user with ID:', userId);
      const response = await fetch(`/api/courses/${courseId}/remove-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userToRemoveId: userId,
          userRole: role 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error response:', error);
        throw new Error(error.error || 'Failed to remove user from class');
      }

      // Refresh the page to show updated roles
      window.location.reload();
    } catch (error) {
      console.error('Error removing user:', error);
      alert(error.message || 'Failed to remove user from class');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Teachers/Admin Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Teachers ({courseUsers?.admin?.length || 0})</h2>
        <div className="space-y-4">
          {courseUsers?.admin?.map((admin, index) => (
            <div key={admin._id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
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
              <div className="flex space-x-2">
                {/* Show demote button only if current user is creator (0th admin) and target is not creator */}
                {isAdmin && courseUsers?.admin[0]?.clerkId === userId && index !== 0 && (
                  <>
                    <button
                      onClick={() => demoteAdmin(admin.clerkId)}
                      disabled={isDemoting || isRemoving}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDemoting ? 'Demoting...' : 'Demote from Teacher'}
                    </button>
                    <button
                      onClick={() => removeFromClass(admin.clerkId, 'admin')}
                      disabled={isDemoting || isRemoving}
                      className="px-4 py-2 text-sm bg-red-700 text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRemoving ? 'Removing...' : 'Remove from Class'}
                    </button>
                  </>
                )}
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
              <div className="flex space-x-2">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => promoteToAdmin(student.clerkId)}
                      disabled={isPromoting || isRemoving}
                      className="px-4 py-2 text-sm bg-orange text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPromoting ? 'Promoting...' : 'Make Teacher'}
                    </button>
                    <button
                      onClick={() => removeFromClass(student.clerkId, 'student')}
                      disabled={isPromoting || isRemoving}
                      className="px-4 py-2 text-sm bg-red-700 text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRemoving ? 'Removing...' : 'Remove from Class'}
                    </button>
                  </>
                )}
              </div>
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
