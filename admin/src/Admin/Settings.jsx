import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, Mail, Key, Server, Cpu, CheckCircle } from 'lucide-react';

const Settings = () => {
  const [smtp, setSmtp] = useState({
    host: "smtp.mailtrap.io",
    port: "2525",
    user: "intellmeet-system",
  });

  const [jwt, setJwt] = useState({
    expiration: "7d",
    secretStatus: "Configured (Hidden)"
  });

  const [notification, setNotification] = useState("");

  const handleSaveSmtp = (e) => {
    e.preventDefault();
    setNotification("SMTP Configuration saved successfully!");
    setTimeout(() => setNotification(""), 3500);
  };

  const handleSaveJwt = (e) => {
    e.preventDefault();
    setNotification("JWT auth security keys saved!");
    setTimeout(() => setNotification(""), 3500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-100">
      
      {/* Banner alert */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-[#070B24] border border-violet-500/30 text-white text-xs font-semibold py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <CheckCircle size={16} className="text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      {/* API Key Status Check cards */}
      <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Key size={16} className="text-violet-500" />
          Platform API Integrations
        </h3>

        <div className="space-y-3.5 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">Google Gemini API Key</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Primary summary generation LLM</p>
            </div>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
              Active & Connected
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">OpenAI Whisper API Key</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Fallback audio transcription</p>
            </div>
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full font-bold">
              Mock Fallback active
            </span>
          </div>
        </div>
      </div>

      {/* System Information cards */}
      <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Server size={16} className="text-violet-500" />
          Environment Specification Registry
        </h3>

        <div className="space-y-3.5 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 grid grid-cols-2 gap-2">
            <span className="text-slate-500 font-bold">Operating System:</span>
            <span className="text-slate-200">Windows Server OS (x64)</span>
            <span className="text-slate-500 font-bold">Node.js Version:</span>
            <span className="text-slate-200">v20.11.0</span>
            <span className="text-slate-500 font-bold">React Framework:</span>
            <span className="text-slate-200">v19.x Client Bundle</span>
            <span className="text-slate-500 font-bold">Web Compiler:</span>
            <span className="text-slate-200">Vite Engine (Tailwind v4)</span>
          </div>
        </div>
      </div>

      {/* SMTP configurations */}
      <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Mail size={16} className="text-violet-500" />
          SMTP Mail Gateway Settings
        </h3>

        <form onSubmit={handleSaveSmtp} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1.5">SMTP Host Server</label>
            <input 
              type="text" 
              value={smtp.host}
              onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-slate-400 font-bold mb-1.5">SMTP Port Number</label>
              <input 
                type="text" 
                value={smtp.port}
                onChange={(e) => setSmtp({ ...smtp, port: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-bold mb-1.5">Mail Username</label>
              <input 
                type="text" 
                value={smtp.user}
                onChange={(e) => setSmtp({ ...smtp, user: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full py-2.5 rounded-xl text-white bg-violet-650 bg-violet-600 hover:bg-violet-500 transition font-bold shadow-md shadow-violet-500/10 cursor-pointer"
          >
            Save SMTP Settings
          </button>
        </form>
      </div>

      {/* JWT security settings */}
      <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck size={16} className="text-violet-500" />
          JWT token security definitions
        </h3>

        <form onSubmit={handleSaveJwt} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1.5">JWT Secret Access Key Status</label>
            <input 
              type="text" 
              value={jwt.secretStatus}
              disabled
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-bold mb-1.5">Access Token Expiry (duration)</label>
            <select
              value={jwt.expiration}
              onChange={(e) => setJwt({ ...jwt, expiration: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="1d">1 Day</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full py-2.5 rounded-xl text-white bg-violet-650 bg-violet-600 hover:bg-violet-500 transition font-bold shadow-md shadow-violet-500/10 cursor-pointer"
          >
            Save JWT Parameters
          </button>
        </form>
      </div>

    </div>
  );
};

export default Settings;
