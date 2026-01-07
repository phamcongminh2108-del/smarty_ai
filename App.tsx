
import React, { useState, useEffect, useMemo } from 'react';
import { COURSES } from './constants';
import { Course, Lesson, UserProfile, LessonTheme, Language, QuizQuestion } from './types';
import { gemini } from './services/geminiService';
import { translations } from './translations';
import AudioButton from './components/AudioButton';
import EmailSignIn from './components/EmailSignIn';
import OnboardingQuiz from './components/OnboardingQuiz';
import LearningPath from './components/LearningPath';
import LanguageSwitcher from './components/LanguageSwitcher';
import ChatBot from './components/ChatBot';

const ColorfulLogo = ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-xl",
    lg: "w-24 h-24 text-5xl"
  };
  return (
    <div className={`${sizes[size]} ${className} bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[28%] flex items-center justify-center text-white font-black shadow-2xl transform transition-transform hover:rotate-3 cursor-pointer ring-4 ring-white/20`}>
      S
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'landing' | 'auth' | 'onboarding' | 'generating' | 'pathway' | 'lesson' | 'chatbot'>('landing');
  const [selectedCourse, setSelectedCourse] = useState<Course>(COURSES[0]);
  const [activeLesson, setActiveLesson] = useState<Lesson>(COURSES[0].lessons[0]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('smarty_language') as Language) || 'en';
  });

  const t = useMemo(() => translations[language], [language]);

  useEffect(() => {
    const savedUser = localStorage.getItem('smarty_profile');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as UserProfile;
      setUser(parsedUser);
      if (parsedUser.language && !localStorage.getItem('smarty_language')) {
        setLanguage(parsedUser.language);
      }
      if (parsedUser.onboarded) setView('pathway');
      else setView('onboarding');
    }
    const savedProgress = localStorage.getItem('smarty_progress');
    if (savedProgress) setCompletedLessons(new Set(JSON.parse(savedProgress)));
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('smarty_language', lang);
    if (user) {
      const updated = { ...user, language: lang };
      setUser(updated);
      localStorage.setItem('smarty_profile', JSON.stringify(updated));
    }
  };

  const handleStartSignIn = () => {
    setView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (email: string) => {
    const newUser: UserProfile = {
      email,
      name: '',
      grade: '',
      level: 'beginner',
      interests: [],
      theme: 'minimal',
      onboarded: false,
      language,
      coins: 100,
      streak: 1
    };
    setUser(newUser);
    localStorage.setItem('smarty_profile', JSON.stringify(newUser));
    setView('onboarding');
  };

  const handleOnboardingComplete = async (quizData: Omit<UserProfile, 'email' | 'onboarded'>) => {
    if (user) {
      setView('generating');
      const partialUser = { ...user, ...quizData, language };
      setUser(partialUser);

      const insights = await gemini.generateSmartPathInsights(partialUser);
      
      const updatedUser: UserProfile = {
        ...partialUser,
        smartInsights: insights,
        onboarded: true
      };
      
      setUser(updatedUser);
      localStorage.setItem('smarty_profile', JSON.stringify(updatedUser));
      setTimeout(() => setView('pathway'), 2000); 
    }
  };

  const handleLessonClick = (course: Course, lesson: Lesson) => {
    setSelectedCourse(course);
    setActiveLesson(lesson);
    setView('lesson');
    setQuizActive(false);
    setCurrentQuizIndex(0);
    setQuizFeedback(null);
    setSelectedAnswer(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [quizActive, setQuizActive] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleQuizAnswer = (answerIndex: number) => {
    if (quizFeedback) return;
    setSelectedAnswer(answerIndex);
    const correct = activeLesson.quiz?.[currentQuizIndex]?.answerIndex === answerIndex;
    setQuizFeedback(correct ? 'correct' : 'wrong');
    
    if (correct) {
      if (user) {
        const updated = { ...user, coins: (user.coins || 0) + 10 };
        setUser(updated);
        localStorage.setItem('smarty_profile', JSON.stringify(updated));
      }

      setTimeout(() => {
        if (activeLesson.quiz && currentQuizIndex < activeLesson.quiz.length - 1) {
          setCurrentQuizIndex(prev => prev + 1);
          setQuizFeedback(null);
          setSelectedAnswer(null);
        } else {
          markCompleteAndNext();
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setQuizFeedback(null);
        setSelectedAnswer(null);
      }, 1000);
    }
  };

  const markCompleteAndNext = () => {
    const newCompleted = new Set(completedLessons);
    newCompleted.add(activeLesson.id);
    setCompletedLessons(newCompleted);
    localStorage.setItem('smarty_progress', JSON.stringify(Array.from(newCompleted)));
    
    const allLessons = COURSES.flatMap(c => c.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex < allLessons.length - 1) {
      const next = allLessons[currentIndex + 1];
      const nextCourse = COURSES.find(c => c.lessons.some(l => l.id === next.id))!;
      setSelectedCourse(nextCourse);
      setActiveLesson(next);
      setQuizActive(false);
      setCurrentQuizIndex(0);
      setQuizFeedback(null);
      setSelectedAnswer(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView('pathway');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('smarty_profile');
    localStorage.removeItem('smarty_progress');
    setUser(null);
    setCompletedLessons(new Set());
    setView('landing');
  };

  const themeClasses = useMemo(() => {
    const theme = user?.theme || 'minimal';
    switch (theme) {
      case 'cyberpunk':
        return {
          bg: 'bg-slate-950 text-cyan-400',
          card: 'bg-slate-900/90 border-cyan-500/30 text-white shadow-[0_0_60px_rgba(6,182,212,0.15)] rounded-[48px] backdrop-blur-2xl',
          prose: 'prose-invert prose-cyan',
          accent: 'text-cyan-400',
          button: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/40 rounded-2xl',
          nav: 'bg-slate-900/95 border-cyan-900/50 text-cyan-400',
          writingBox: 'bg-slate-900 text-white border-cyan-500/50',
          secondary: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          quizOption: 'bg-slate-800 border-cyan-500/30 hover:bg-slate-700',
          quizCorrect: 'bg-emerald-500/20 border-emerald-500 text-emerald-400',
          quizWrong: 'bg-rose-500/20 border-rose-500 text-rose-400'
        };
      case 'academic':
        return {
          bg: 'bg-[#f9f7f2] text-[#2c3e50]',
          card: 'bg-white border-[#e0d9c8] shadow-sm rounded-none border-t-[8px] border-t-[#2c3e50] p-16',
          prose: 'prose-slate font-serif',
          accent: 'text-[#2c3e50]',
          button: 'bg-[#2c3e50] hover:bg-[#34495e] rounded-none',
          nav: 'bg-white border-slate-200 text-slate-800',
          writingBox: 'bg-slate-100 text-[#2c3e50] border-slate-300',
          secondary: 'bg-slate-100 text-slate-600 border-slate-200',
          quizOption: 'bg-white border-slate-200 hover:bg-slate-50',
          quizCorrect: 'bg-emerald-50 border-emerald-500 text-emerald-700',
          quizWrong: 'bg-rose-50 border-rose-500 text-rose-700'
        };
      case 'playful':
        return {
          bg: 'bg-yellow-50 text-indigo-900',
          card: 'bg-white border-yellow-200 border-b-[12px] border-b-yellow-400 shadow-2xl rounded-[60px]',
          prose: 'prose-indigo',
          accent: 'text-pink-500',
          button: 'bg-pink-500 hover:bg-pink-400 rounded-full shadow-pink-200',
          nav: 'bg-white/95 border-yellow-100 text-indigo-900',
          writingBox: 'bg-slate-900 text-white border-slate-700',
          secondary: 'bg-pink-50 text-pink-600 border-pink-100',
          quizOption: 'bg-white border-pink-100 hover:bg-pink-50',
          quizCorrect: 'bg-emerald-100 border-emerald-500 text-emerald-700',
          quizWrong: 'bg-rose-100 border-rose-500 text-rose-700'
        };
      default:
        return {
          bg: 'bg-white text-slate-900',
          card: 'bg-white border-slate-100 shadow-2xl shadow-slate-200/40 rounded-[48px]',
          prose: 'prose-slate',
          accent: 'text-indigo-600',
          button: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-100 rounded-3xl',
          nav: 'bg-white/95 border-slate-100 text-slate-900',
          writingBox: 'bg-slate-900 text-white border-slate-700',
          secondary: 'bg-indigo-50 text-indigo-600 border-indigo-100',
          quizOption: 'bg-white border-slate-200 hover:bg-slate-50',
          quizCorrect: 'bg-emerald-50 border-emerald-500 text-emerald-700',
          quizWrong: 'bg-rose-50 border-rose-500 text-rose-700'
        };
    }
  }, [user?.theme]);

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-white animate-in fade-in duration-500 selection:bg-indigo-100 selection:text-indigo-600">
        <nav className="sticky top-0 z-50 px-6 py-5 glass border-b border-slate-100">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ColorfulLogo size="sm" />
              <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tighter">
                Smarty
              </span>
            </div>
            <div className="flex items-center gap-6">
              <LanguageSwitcher currentLang={language} onLanguageChange={handleLanguageChange} />
              <button onClick={handleStartSignIn} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95">
                {t.nav.signIn}
              </button>
            </div>
          </div>
        </nav>

        <section className="px-6 py-32 md:py-48 text-center max-w-6xl mx-auto relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[160px] -z-10 animate-pulse"></div>
          
          <div className="inline-block px-5 py-2 mb-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-black uppercase tracking-[0.25em] animate-in slide-in-from-bottom-4 duration-500">
            {t.landing.tagline}
          </div>
          <h1 className="text-7xl md:text-[120px] font-black text-slate-900 mb-12 tracking-tighter leading-[0.85] animate-in slide-in-from-bottom-4 duration-700 uppercase whitespace-pre-line">
            {language === 'en' ? (
              <>THINK <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">BIGGER</span>{"\n"}LEARN AI</>
            ) : (
              <>NGHĨ <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">LỚN HƠN</span>{"\n"}HỌC AI</>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-16 max-w-3xl mx-auto font-medium opacity-90 animate-in slide-in-from-bottom-8 duration-700">
            {t.landing.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-in slide-in-from-bottom-8 duration-1000">
            <button onClick={handleStartSignIn} className="w-full sm:w-auto px-16 py-7 bg-indigo-600 text-white rounded-[40px] font-black text-3xl hover:bg-indigo-700 transition-all shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] hover:-translate-y-2 active:scale-95">
              {t.landing.cta}
            </button>
            <div className="flex items-center gap-5 bg-white p-3 pr-8 rounded-full border border-slate-100 shadow-xl shadow-slate-200/30">
              <div className="flex -space-x-4">
                {[10, 22, 43, 64].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=smarty-${i}`} alt="student avatar" />
                  </div>
                ))}
              </div>
              <div className="text-left">
                <span className="block text-lg font-black text-slate-900 leading-none">50,000+</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.landing.students}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-50">
          {COURSES.map((course, idx) => (
            <div key={course.id} className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all group animate-in fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center text-4xl mb-10 ${course.color} transition-transform group-hover:rotate-6 group-hover:scale-110 shadow-lg`}>
                {course.icon}
              </div>
              <h3 className="text-3xl font-black mb-5 text-slate-900 tracking-tight">{course.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-lg">
                {course.description}
              </p>
            </div>
          ))}
        </section>

        <footer className="py-24 text-center border-t border-slate-100">
            <div className="flex items-center justify-center gap-3 mb-6 opacity-40 grayscale">
                <ColorfulLogo size="sm" />
                <span className="text-xl font-black">Smarty Academy</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">Join the frontier of the intelligence revolution. © 2024</p>
        </footer>
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-indigo-100">
        <div className="max-w-md w-full bg-white rounded-[56px] p-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] text-center border border-slate-50 animate-in zoom-in duration-500">
          <div className="mb-8 flex justify-between items-start">
             <div className="opacity-0"><LanguageSwitcher currentLang={language} onLanguageChange={handleLanguageChange} /></div>
             <div className="scale-125"><ColorfulLogo size="lg" /></div>
             <LanguageSwitcher currentLang={language} onLanguageChange={handleLanguageChange} />
          </div>
          <EmailSignIn onSuccess={handleAuthSuccess} lang={language} />
          <button onClick={() => setView('landing')} className="mt-10 text-slate-400 font-bold text-sm hover:text-slate-600 flex items-center gap-3 mx-auto transition-all hover:-translate-x-1">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             {t.auth.back}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'onboarding' && user) {
    return (
      <>
        <div className="fixed top-8 right-8 z-[60]">
          <LanguageSwitcher currentLang={language} onLanguageChange={handleLanguageChange} />
        </div>
        <OnboardingQuiz userName={user.name} lang={language} onComplete={handleOnboardingComplete} />
      </>
    );
  }

  if (view === 'generating') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
        <div className="relative mb-20 scale-150">
          <div className="absolute inset-0 bg-indigo-500/30 blur-3xl animate-pulse rounded-full" />
          <ColorfulLogo size="lg" className="relative z-10 animate-bounce" />
        </div>
        <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">{t.pathway.generating}</h2>
        <p className="text-slate-400 max-w-sm mx-auto font-medium text-xl italic animate-pulse">
          {t.pathway.generatingSub}
        </p>
        <div className="mt-20 w-80 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50 shadow-inner">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[loading_3s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-700 ${view === 'lesson' || view === 'chatbot' ? themeClasses.bg : 'bg-slate-50'} flex flex-col`}>
      <nav className={`sticky top-0 z-50 border-b px-6 py-5 backdrop-blur-xl transition-all ${themeClasses.nav} flex-shrink-0`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('pathway')}>
            <ColorfulLogo size="sm" />
            <span className="text-3xl font-black tracking-tighter transition-all group-hover:scale-105">Smarty</span>
          </div>
          <div className="flex items-center gap-8">
            <LanguageSwitcher currentLang={language} onLanguageChange={handleLanguageChange} isDark={user?.theme === 'cyberpunk'} />
            {user && (
              <div className="flex items-center gap-4 px-6 py-3 bg-white/40 rounded-full border border-slate-200/50 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-2 mr-2 text-sm font-black text-amber-500">
                  <span>🪙</span>
                  <span>{user.coins || 0}</span>
                </div>
                <div className="flex items-center gap-2 mr-4 text-sm font-black text-orange-500">
                  <span>🔥</span>
                  <span>{user.streak || 1}</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-black shadow-xl">
                  {user.name.charAt(0) || 'S'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-0.5">Student</p>
                  <p className="text-base font-black leading-none">{user.name.split(' ')[0] || 'Member'}</p>
                </div>
                <button onClick={handleLogout} className="ml-3 text-slate-300 hover:text-red-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 border-r border-slate-100 bg-white/50 backdrop-blur-sm p-8 hidden md:flex flex-col gap-12 overflow-y-auto">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4">{t.nav.modules}</p>
            <nav className="flex flex-col gap-2">
              <button 
                onClick={() => setView('pathway')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all ${view === 'pathway' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <span className="text-xl">🎓</span>
                <span>{t.nav.academy}</span>
              </button>
              <button 
                onClick={() => setView('chatbot')}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all ${view === 'chatbot' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <span className="text-xl">🤖</span>
                <span>{t.nav.chatbot}</span>
              </button>
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4">{t.nav.rewards}</p>
            <nav className="flex flex-col gap-2">
              <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-slate-400 cursor-not-allowed grayscale opacity-50">
                <span className="text-xl">🎮</span>
                <span>{t.nav.games}</span>
              </button>
              <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-slate-400 cursor-not-allowed grayscale opacity-50">
                <span className="text-xl">🛒</span>
                <span>{t.nav.shop}</span>
              </button>
            </nav>
          </div>

          <div className="mt-auto bg-slate-50 p-6 rounded-3xl border border-slate-100">
             <div className="flex justify-between items-center mb-4">
                <p className="text-xs font-black uppercase text-slate-400">{t.nav.goal}</p>
                <span className="text-indigo-600 font-black">75%</span>
             </div>
             <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '75%' }}></div>
             </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto relative">
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            {view === 'pathway' && (
              <div className="animate-in fade-in duration-700">
                {user?.smartInsights && (
                  <div className="mb-20 bg-white p-12 rounded-[56px] border-2 border-indigo-50 shadow-2xl shadow-indigo-100/50 flex flex-col md:flex-row items-center md:items-start gap-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 transition-opacity group-hover:opacity-10">
                       <ColorfulLogo size="lg" />
                    </div>
                    <div className="w-24 h-24 rounded-3xl bg-indigo-50 flex items-center justify-center text-5xl shrink-0 animate-bounce shadow-inner">🤖</div>
                    <div className="relative z-10">
                      <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4">{t.pathway.mentorTitle}</h4>
                      <p className="text-slate-800 text-2xl font-bold leading-[1.4] italic pr-10">
                        "{user.smartInsights}"
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-center mb-32">
                  <h2 className="text-7xl font-black text-slate-900 mb-8 tracking-tighter">{t.pathway.title}</h2>
                  <div className="flex items-center justify-center gap-5">
                     <span className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm border ${themeClasses.secondary}`}>{user?.level} {t.pathway.levelPath}</span>
                     <span className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm border ${themeClasses.secondary}`}>{user?.grade}</span>
                  </div>
                </div>
                
                <LearningPath 
                  courses={COURSES} 
                  completedLessons={completedLessons}
                  activeLessonId={activeLesson.id}
                  onLessonClick={handleLessonClick}
                  lang={language}
                />
              </div>
            )}

            {view === 'chatbot' && user && (
              <ChatBot user={user} lang={language} themeClasses={themeClasses} />
            )}

            {view === 'lesson' && (
              <div className="animate-in slide-in-from-right-12 duration-700 max-w-4xl mx-auto">
                <button 
                  onClick={() => setView('pathway')}
                  className="flex items-center gap-4 text-slate-400 font-black mb-12 hover:text-indigo-600 transition-all hover:-translate-x-1 uppercase tracking-widest text-xs"
                >
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                  {t.lesson.back}
                </button>

                <div className={`p-16 md:p-24 transition-all duration-700 ${themeClasses.card} overflow-hidden`}>
                  {!quizActive ? (
                    <div className="animate-in fade-in duration-500">
                      {activeLesson.imageUrl && (
                        <div className="w-full h-80 rounded-[32px] overflow-hidden mb-12 shadow-2xl relative group">
                          <img 
                            src={activeLesson.imageUrl} 
                            alt={activeLesson.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-12 mb-20">
                        <div className="space-y-8">
                          <div className="flex items-center gap-5">
                            <span className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm border border-black/5 ${selectedCourse.color}`}>
                              {selectedCourse.title}
                            </span>
                            <span className="opacity-40 font-black text-[11px] uppercase tracking-[0.2em]">{t.lesson.duration} {activeLesson.duration}</span>
                          </div>
                          <h1 className="text-7xl font-black leading-[0.95] tracking-tighter">
                            {activeLesson.title}
                          </h1>
                        </div>
                        <div className="shrink-0 scale-150 origin-top-right">
                          <AudioButton text={activeLesson.content} lang={language} />
                        </div>
                      </div>

                      <div className={`prose prose-2xl max-w-none mb-20 ${themeClasses.prose}`}>
                        <p className="leading-relaxed font-bold opacity-95 text-3xl">
                          {activeLesson.content}
                        </p>
                      </div>

                      <div className="space-y-8">
                        <div className={`p-10 rounded-[40px] border-4 transition-all ${themeClasses.writingBox}`}>
                          <h5 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 opacity-40">{t.lesson.notes}</h5>
                          <textarea 
                            placeholder={t.lesson.notesPlaceholder}
                            className="w-full bg-transparent border-none outline-none resize-none h-48 placeholder:text-white/10 font-bold text-2xl leading-relaxed"
                          />
                        </div>

                        <button 
                          onClick={() => setQuizActive(true)}
                          className={`w-full py-10 text-white font-black text-3xl transition-all active:scale-[0.97] hover:-translate-y-2 shadow-2xl ${themeClasses.button}`}
                        >
                          {t.lesson.takeCheck}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in slide-in-from-right-12 duration-500 min-h-[500px] flex flex-col">
                      <div className="mb-12 flex justify-between items-center">
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500 mb-2">
                            {t.lesson.knowledgeCheck}
                          </h3>
                          <p className="text-4xl font-black tracking-tighter">
                            {activeLesson.quiz?.[currentQuizIndex]?.question}
                          </p>
                        </div>
                        <div className="shrink-0 w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl font-black text-indigo-600 border border-indigo-100">
                          {currentQuizIndex + 1}/{activeLesson.quiz?.length}
                        </div>
                      </div>

                      <div className="space-y-4 mb-12">
                        {activeLesson.quiz?.[currentQuizIndex]?.options.map((option, idx) => {
                          const isCorrect = idx === activeLesson.quiz?.[currentQuizIndex]?.answerIndex;
                          const isSelected = idx === selectedAnswer;
                          
                          let variantClasses = themeClasses.quizOption;
                          if (quizFeedback === 'correct' && isCorrect) variantClasses = themeClasses.quizCorrect;
                          if (quizFeedback === 'wrong' && isSelected) variantClasses = themeClasses.quizWrong;

                          return (
                            <button
                              key={idx}
                              disabled={!!quizFeedback}
                              onClick={() => handleQuizAnswer(idx)}
                              className={`w-full p-8 text-left rounded-[32px] border-4 transition-all duration-300 font-bold text-2xl ${variantClasses} ${!quizFeedback ? 'hover:-translate-y-1 shadow-sm' : ''} flex items-center justify-between group`}
                            >
                              <span>{option}</span>
                              {quizFeedback === 'correct' && isCorrect && <span className="text-3xl animate-bounce">✨</span>}
                              {quizFeedback === 'wrong' && isSelected && <span className="text-3xl animate-shake">❌</span>}
                            </button>
                          );
                        })}
                      </div>

                      <button 
                        onClick={() => setQuizActive(false)}
                        className="mt-auto text-slate-400 font-black uppercase tracking-[0.3em] text-xs hover:text-indigo-600 transition-colors"
                      >
                        {t.lesson.backToLesson}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {view === 'pathway' && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md px-6 animate-in slide-in-from-bottom-12 duration-1000 z-50">
           <div className="bg-slate-900/95 text-white p-8 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] flex items-center justify-between border border-white/10 backdrop-blur-3xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-500 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-pulse">🏅</div>
                <div>
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.4em] mb-1.5">{t.pathway.rankTitle}</p>
                  <p className="text-xl font-black tracking-tight">{t.pathway.rank}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <p className="text-base font-black text-white/90 leading-none">{completedLessons.size} / {COURSES.flatMap(c=>c.lessons).length}</p>
                <div className="w-32 h-3 bg-white/10 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${(completedLessons.size / COURSES.flatMap(c=>c.lessons).length) * 100}%` }} />
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
