"use client";

import React from 'react';
import Image from 'next/image';

const PeopleTab = ({ courseUsers }) => {
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
  );
};

export default PeopleTab;
