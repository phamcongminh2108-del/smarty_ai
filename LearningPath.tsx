
import React from 'react';
import { Course, Lesson, Language } from '../types';
import { translations } from '../translations';

interface LearningPathProps {
  courses: Course[];
  completedLessons: Set<string>;
  activeLessonId: string;
  onLessonClick: (course: Course, lesson: Lesson) => void;
  lang: Language;
}

const Confetti = () => {
  const colors = ['bg-yellow-400', 'bg-blue-400', 'bg-pink-400', 'bg-green-400', 'bg-purple-400'];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`confetti-piece animate-confetti ${colors[i % colors.length]}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );
};

const LearningPath: React.FC<LearningPathProps> = ({ courses, completedLessons, activeLessonId, onLessonClick, lang }) => {
  const allNodes = courses.flatMap(course => 
    course.lessons.map(lesson => ({ course, lesson }))
  );
  
  const t = translations[lang].pathway;

  return (
    <div className="flex flex-col items-center py-12 relative">
      {allNodes.map((node, index) => {
        const isCompleted = completedLessons.has(node.lesson.id);
        const isActive = activeLessonId === node.lesson.id;
        const isLocked = !isCompleted && !isActive && index > 0 && !completedLessons.has(allNodes[index-1].lesson.id);
        
        const offset = Math.sin(index * 1.5) * 80;

        return (
          <div key={node.lesson.id} className="relative flex flex-col items-center mb-16 animate-in fade-in slide-in-from-bottom" style={{ animationDelay: `${index * 100}ms` }}>
            {index < allNodes.length - 1 && (
              <div 
                className={`absolute top-full w-2 h-20 -z-10 transition-all duration-1000 ${isCompleted ? 'bg-gradient-to-b from-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'bg-slate-200'}`}
                style={{ 
                  transform: `translateX(${offset}px) rotate(${Math.sin((index + 0.5) * 1.5) * 15}deg)`,
                  height: '130px'
                }}
              />
            )}

            <div style={{ transform: `translateX(${offset}px)` }} className="relative">
              <button
                onClick={() => !isLocked && onLessonClick(node.course, node.lesson)}
                className={`group relative flex items-center justify-center w-28 h-28 rounded-[36px] transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-2xl animate-glow-pulse hover:scale-110' 
                    : isActive 
                      ? 'bg-white border-[6px] border-indigo-600 scale-125 shadow-[0_25px_60px_rgba(99,102,241,0.4)] ring-[14px] ring-indigo-50 z-10' 
                      : isLocked
                        ? 'bg-slate-100 text-slate-300 border-2 border-slate-200'
                        : 'bg-white border-[4px] border-slate-200 hover:border-indigo-400 hover:scale-105 shadow-sm'
                }`}
              >
                {isCompleted && <Confetti />}
                
                <div className={`text-4xl transition-transform duration-500 ${isActive ? 'animate-bounce' : 'group-hover:scale-110'}`}>
                  {isLocked ? '🔒' : isCompleted ? '✨' : node.course.icon}
                </div>

                <div className="absolute left-full ml-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap z-50">
                  <div className="bg-slate-900 text-white p-5 rounded-[24px] shadow-2xl border border-white/10 backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">{node.course.title}</p>
                    <p className="text-sm font-black">{node.lesson.title}</p>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute inset-0 rounded-[36px] animate-ping bg-indigo-400/30 -z-10" />
                )}
                
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg border-4 border-white">
                    ✓
                  </div>
                )}
              </button>

              <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-black text-sm transition-all duration-500 ${isActive ? 'text-indigo-600 scale-110' : isLocked ? 'text-slate-300' : 'text-slate-500'}`}>
                {node.lesson.title}
              </div>
            </div>
          </div>
        );
      })}

      <div className="pt-24 flex flex-col items-center">
        <div className="w-24 h-24 rounded-[40px] bg-slate-100 flex items-center justify-center text-5xl text-slate-300 border-4 border-dashed border-slate-200 animate-pulse relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          🚀
        </div>
        <p className="text-center mt-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.comingSoon}</p>
      </div>
    </div>
  );
};

export default LearningPath;
