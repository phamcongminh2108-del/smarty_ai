
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface EmailSignInProps {
  onSuccess: (email: string) => void;
  lang: Language;
}

const EmailSignIn: React.FC<EmailSignInProps> = ({ onSuccess, lang }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgot, setIsForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const t = translations[lang].auth;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    
    setIsLoading(true);
    // Simulate authentication
    setTimeout(() => {
      onSuccess(email);
      setIsLoading(false);
    }, 1500);
  };

  if (isForgot) {
    return (
      <div className="w-full text-left space-y-6 animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-black text-slate-900">{t.forgotTitle}</h2>
        <p className="text-slate-500 text-sm">{t.forgotSub}</p>
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.email}
            className="w-full px-5 py-4 rounded-2xl border border-slate-700 bg-slate-900 text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-500"
          />
          <button 
            onClick={() => setIsForgot(false)}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            {t.sendLink}
          </button>
          <button onClick={() => setIsForgot(false)} className="w-full text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors">
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full text-left space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.welcome}</h2>
        <p className="text-slate-500 text-sm font-medium">{t.sub}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">{t.email}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@smarty.ai"
            className="w-full px-5 py-4 rounded-2xl border border-slate-700 bg-slate-900 text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.password}</label>
            <button type="button" onClick={() => setIsForgot(true)} className="text-xs font-bold text-indigo-600 hover:underline">{t.forgot}</button>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-5 py-4 rounded-2xl border border-slate-700 bg-slate-900 text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             <span>{t.loading}</span>
          </div>
        ) : t.submit}
      </button>

      <div className="text-center pt-2">
        <p className="text-sm text-slate-400 font-medium">{t.newStudent} <span className="text-indigo-600 font-bold cursor-pointer hover:underline">{t.register}</span></p>
      </div>
    </form>
  );
};

export default EmailSignIn;
