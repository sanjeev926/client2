import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Eye, EyeOff, KeyRound, AlertCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAdmin();
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Kripya admin passcode enter karein.');
      return;
    }

    const res = login(pin);
    if (!res.success) {
      setError(res.error || 'Galat Passcode');
    } else {
      setPin('');
      setError('');
    }
  };

  const handleClose = () => {
    setPin('');
    setError('');
    closeLoginModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0F1117] border border-white/15 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/20 border border-[#0066FF]/30 text-[#0066FF] flex items-center justify-center mx-auto shadow-lg shadow-[#0066FF]/20">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-white tracking-tight">
            Studio Admin Login
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Website ke photos, categories, timings aur pricing customize karne ke liye passcode enter karein.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Admin Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Passcode enter karein"
                className="w-full bg-[#161822] border border-white/15 focus:border-[#0066FF] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
              <span>Default Passcode: <code className="text-[#0066FF] font-mono font-bold">ramy2026</code></span>
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0066FF]/25 cursor-pointer active:scale-[0.99]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Login as Studio Admin</span>
          </button>
        </form>
      </div>
    </div>
  );
};
