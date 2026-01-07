
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { UserProfile, Language, ChatMessage } from '../types';
import { translations } from '../translations';

interface ChatBotProps {
  user: UserProfile;
  lang: Language;
  themeClasses: any;
}

const ChatBot: React.FC<ChatBotProps> = ({ user, lang, themeClasses }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`smarty_chat_${user.email}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const t = translations[lang].chatbot;

  useEffect(() => {
    localStorage.setItem(`smarty_chat_${user.email}`, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, user.email]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Use the correct model name 'gemini-3-flash-preview' for general text tasks
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // In the @google/genai SDK, define the model directly in the call
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            ...history.flatMap(h => h.parts),
            { text: input }
          ]
        },
        config: {
          systemInstruction: `You are a friendly and encouraging AI study mentor for a student named ${user.name}. 
          They are currently in ${user.grade} at a ${user.level} level. 
          Their interests include ${user.interests.join(', ')}.
          Explain concepts simply, be encouraging, and use the language: ${lang === 'vi' ? 'Vietnamese' : 'English'}.`,
        }
      });

      // Correctly extract text using the .text property (not a method)
      const generatedText = response.text || '';
      const aiMsg: ChatMessage = { role: 'model', text: generatedText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat failed:", error);
      const errorMessage: ChatMessage = { 
        role: 'model', 
        text: lang === 'vi' 
          ? "Rất tiếc, mình đang gặp chút sự cố kết nối. Bạn thử lại sau nhé!" 
          : "Sorry, I'm having some connection issues. Please try again later!", 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (confirm(t.newChat + '?')) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{t.nav?.chatbot || 'AI Assistant'}</h2>
        <button 
          onClick={clearChat}
          className="px-6 py-2 rounded-2xl bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
        >
          {t.newChat}
        </button>
      </div>

      <div className={`flex-1 overflow-hidden flex flex-col p-6 md:p-8 ${themeClasses.card} shadow-2xl`}>
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-4 scroll-smooth">
          {messages.length === 0 && (
            <div className="text-center py-20 opacity-40">
              <div className="text-7xl mb-6">🤖</div>
              <p className="text-2xl font-black italic tracking-tight">"{t.welcome}"</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`max-w-[85%] p-5 md:p-6 rounded-[32px] ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-xl shadow-indigo-100' 
                  : `${themeClasses.secondary} border rounded-bl-none shadow-sm`
              }`}>
                <p className="text-lg font-bold leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className={`p-4 rounded-full ${themeClasses.secondary} border`}>
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className={`flex-1 px-8 py-5 rounded-[32px] border-4 transition-all outline-none text-lg font-bold ${themeClasses.writingBox} focus:ring-8 focus:ring-indigo-500/10`}
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className={`px-10 rounded-[32px] text-white font-black text-xl shadow-xl transition-all active:scale-95 disabled:opacity-50 ${themeClasses.button}`}
          >
            {t.send}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
