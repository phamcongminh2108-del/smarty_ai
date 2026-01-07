
import React, { useState } from 'react';
import { UserProfile, LessonTheme, Language } from '../types';
import { translations } from '../translations';

interface OnboardingQuizProps {
  userName: string;
  lang: Language;
  onComplete: (profile: Omit<UserProfile, 'email' | 'onboarded'>) => void;
}

const OnboardingQuiz: React.FC<OnboardingQuizProps> = ({ userName: initialName, lang, onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialName || '');
  const [grade, setGrade] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced' | ''>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [theme, setTheme] = useState<LessonTheme | ''>('');

  const t = translations[lang].onboarding;

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleFinish = () => {
    if (name && grade && level && theme) {
      onComplete({
        name,
        grade,
        level: level as any,
        interests,
        theme: theme as LessonTheme,
        language: lang,
      });
    }
  };

  const interestOptions = Object.keys(t.steps[4].options);
  const themeOptions: { id: LessonTheme; label: string; icon: string; desc: string }[] = [
    { id: 'minimal', label: t.steps[5].minimal.label, icon: '⚪', desc: t.steps[5].minimal.desc },
    { id: 'cyberpunk', label: t.steps[5].cyberpunk.label, icon: '🌌', desc: t.steps[5].cyberpunk.desc },
    { id: 'academic', label: t.steps[5].academic.label, icon: '📜', desc: t.steps[5].academic.desc },
    { id: 'playful', label: t.steps[5].playful.label, icon: '🍭', desc: t.steps[5].playful.desc }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6 selection:bg-indigo-100">
      <div className="max-w-3xl w-full animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">{t.title}</h2>
          <p className="text-slate-500 font-bold text-lg">{t.sub}</p>
          <div className="flex justify-center gap-4 mt-10">
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className={`h-3 w-20 rounded-full transition-all duration-700 ${s <= step ? 'bg-indigo-600 shadow-xl shadow-indigo-100 scale-105' : 'bg-slate-200'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[64px] p-16 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.12)] border border-slate-50 min-h-[650px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-16 opacity-[0.05] select-none pointer-events-none transition-all">
             <div className="text-[160px] font-black leading-none">{step}</div>
          </div>

          {step === 1 && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{t.steps[1].q}</h3>
              <div className="space-y-4">
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.steps[1].placeholder}
                  className="w-full px-8 py-7 rounded-[32px] border-4 border-slate-700 bg-slate-900 text-white focus:ring-[10px] focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-600 text-3xl font-black tracking-tight"
                />
                <p className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] pl-4 pt-4">{t.steps[1].desc}</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{t.steps[2].q}</h3>
              <div className="grid grid-cols-2 gap-6">
                {t.steps[2].options.map((g: string) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`p-10 rounded-[40px] border-4 text-left transition-all duration-300 ${grade === g ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xl scale-105' : 'border-slate-50 hover:border-slate-200 bg-slate-50/50 text-slate-600'}`}
                  >
                    <span className="font-black text-2xl tracking-tight">{g}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{t.steps[3].q}</h3>
              <div className="space-y-6">
                {[
                  { id: 'beginner', label: t.steps[3].beginner.label, desc: t.steps[3].beginner.desc },
                  { id: 'intermediate', label: t.steps[3].intermediate.label, desc: t.steps[3].intermediate.desc },
                  { id: 'advanced', label: t.steps[3].advanced.label, desc: t.steps[3].advanced.desc }
                ].map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLevel(l.id as any)}
                    className={`w-full p-8 rounded-[40px] border-4 text-left transition-all duration-300 flex justify-between items-center ${level === l.id ? 'border-indigo-600 bg-indigo-50 shadow-xl' : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'}`}
                  >
                    <div>
                      <p className={`font-black text-2xl ${level === l.id ? 'text-indigo-700' : 'text-slate-900'}`}>{l.label}</p>
                      <p className="text-base text-slate-500 mt-2 font-bold opacity-80">{l.desc}</p>
                    </div>
                    {level === l.id && <div className="text-3xl">✨</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{t.steps[4].q}</h3>
              <div className="grid grid-cols-2 gap-6">
                {interestOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => toggleInterest(option)}
                    className={`p-7 rounded-[32px] border-4 transition-all font-black text-lg tracking-tight ${interests.includes(option) ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg' : 'border-slate-50 bg-slate-50/50 text-slate-500'}`}
                  >
                    {t.steps[4].options[option]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{t.steps[5].q}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {themeOptions.map(tOption => (
                  <button
                    key={tOption.id}
                    onClick={() => setTheme(tOption.id)}
                    className={`p-10 rounded-[48px] border-4 text-left transition-all duration-500 ${theme === tOption.id ? 'border-indigo-600 bg-indigo-50 shadow-2xl scale-[1.02]' : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'}`}
                  >
                    <div className="flex items-center gap-6 mb-4">
                      <span className="text-4xl drop-shadow-md">{tOption.icon}</span>
                      <span className="font-black text-2xl text-slate-900 tracking-tight">{tOption.label}</span>
                    </div>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">{tOption.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-16 flex justify-between items-center">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="text-slate-400 font-black hover:text-slate-600 transition-all uppercase tracking-[0.3em] text-xs">{t.back}</button>
            ) : <div />}
            
            <button
              onClick={() => step < 5 ? setStep(step + 1) : handleFinish()}
              disabled={step === 1 ? !name : step === 2 ? !grade : step === 3 ? !level : step === 5 ? !theme : false}
              className="bg-indigo-600 text-white px-16 py-6 rounded-[32px] font-black text-2xl shadow-[0_25px_50px_-12px_rgba(79,70,229,0.3)] hover:bg-indigo-700 disabled:opacity-30 transition-all hover:-translate-y-2 active:scale-95"
            >
              {step === 5 ? t.launch : t.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuiz;
