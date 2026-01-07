
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onSelect: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(course)}
      className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
        isSelected 
          ? 'bg-white border-indigo-500 shadow-xl' 
          : 'bg-white/50 border-transparent hover:border-slate-200 hover:bg-white shadow-sm'
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${course.color}`}>
        {course.icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{course.title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">
        {course.description}
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        {course.lessons.length} Lessons
      </div>
    </div>
  );
};

export default CourseCard;
