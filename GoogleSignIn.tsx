
import React, { useState } from 'react';

interface GoogleSignInProps {
  onSuccess: (user: { name: string; email: string }) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSuccess }) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 1 && email.includes('@')) {
      setStep(2);
    } else if (step === 2 && name.trim()) {
      handleSignIn();
    }
  };

  const handleSignIn = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      onSuccess({
        name: name,
        email: email
      });
      setIsSigningIn(false);
    }, 1200);
  };

  return (
    <div className="w-full space-y-4">
      <div className="text-left mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{step === 1 ? 'Sign in' : 'What is your name?'}</h2>
        <p className="text-slate-500 text-sm mt-1">{step === 1 ? 'Use your Google account email' : 'Help us personalize your journey'}</p>
      </div>

      <div className="space-y-4">
        {step === 1 ? (
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or phone"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
            />
          </div>
        ) : (
          <div className="relative">
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
            />
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <button className="text-indigo-600 font-bold text-sm hover:underline">Create account</button>
          <button
            onClick={handleNext}
            disabled={isSigningIn || (step === 1 ? !email.includes('@') : !name.trim())}
            className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
          >
            {isSigningIn ? 'Loading...' : 'Next'}
          </button>
        </div>
      </div>

      <div className="relative py-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">or</span></div>
      </div>

      <button
        onClick={handleSignIn}
        className="flex items-center justify-center gap-3 w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
      >
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        </svg>
        One-tap Sign In
      </button>
    </div>
  );
};

export default GoogleSignIn;
