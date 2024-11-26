"use client";

import React from 'react';

const CourseHeader = ({ course }) => {
  return (
    <div className="relative h-48 md:h-60 bg-gradient-to-br from-[#1e1e1e] to-[#cf4500]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#323231]/70 to-[#ff5500]/80 backdrop-blur-sm"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-6">
        <h1 className="text-2xl md:text-4xl font-medium text-white mb-2">{course.title}</h1>
        <p className="text-lg md:text-xl text-white/90 mb-2 md:mb-3">Course Code: {course.courseCode}</p>
        <p className="text-sm md:text-base text-white/80 max-w-3xl line-clamp-2 md:line-clamp-none">{course.description}</p>
      </div>
    </div>
  );
};

export default CourseHeader;
