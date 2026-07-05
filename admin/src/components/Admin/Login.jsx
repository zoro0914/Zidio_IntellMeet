import React, { useState } from 'react';
import api from '../../Utils/api';
import { ShieldAlert, Key, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      
      if (res.data.success || res.data.accessToken) {
        const token = res.data.accessToken || res.data.token;
        const user = res.data.user;

        if (user.role !== "admin") {
          setError("Access Denied: Only administrators can access this control panel.");
          setLoading(false);
          return;
        }

        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        
        setSuccess("Authentication successful! Loading dashboard...");
        setTimeout(() => {
          onLoginSuccess(token);
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials or network connection issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20 mx-auto">
            <ShieldAlert size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Intell<span className="text-violet-500">Admin</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Secure Access Control Panel</p>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-start gap-2.5">
            <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1.5 flex items-center gap-1.5">
              <Mail size={12} className="text-slate-500" />
              Administrator Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@intellmeet.com"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1.5 flex items-center gap-1.5">
              <Lock size={12} className="text-slate-500" />
              Secure Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-violet-605 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition shadow-lg shadow-violet-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-200 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Key size={14} />
                Authenticate & Login
              </>
            )}
          </button>
        </form>

        <div className="text-center border-t border-slate-800 pt-4">
          <p className="text-[10px] text-slate-500">
            Note: Admin accounts can be created or promoted using the backend CLI seeder script.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
