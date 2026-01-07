
import React from 'react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isDark?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, onLanguageChange, isDark }) => {
  return (
    <div className={`flex items-center gap-1 p-1 rounded-full border transition-colors ${
      isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/50'
    }`}>
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
          currentLang === 'en' 
            ? 'bg-indigo-600 text-white shadow-sm' 
            : isDark ? 'text-white/40 hover:text-white/70' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange('vi')}
        className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
          currentLang === 'vi' 
            ? 'bg-indigo-600 text-white shadow-sm' 
            : isDark ? 'text-white/40 hover:text-white/70' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        VI
      </button>
    </div>
  );
};

export default LanguageSwitcher;
