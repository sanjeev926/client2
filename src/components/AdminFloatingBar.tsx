import React, { useState } from 'react';
import { ShieldCheck, LogOut, Sliders, Video, Camera, ChevronDown, ChevronUp } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface AdminFloatingBarProps {
  onOpenCategoriesCustomizer: () => void;
  onOpenVideoCustomizer?: () => void;
}

export const AdminFloatingBar: React.FC<AdminFloatingBarProps> = ({
  onOpenCategoriesCustomizer,
  onOpenVideoCustomizer
}) => {
  const { isAdmin, logout } = useAdmin();
  const [minimized, setMinimized] = useState(false);

  if (!isAdmin) return null;

  return (
    <aside aria-label="Studio Admin Bar" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all select-none">
      <div className="bg-[#0B0D13]/95 border border-white/20 backdrop-blur-xl rounded-full p-1.5 sm:p-2 shadow-2xl flex items-center gap-2 text-white">
        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Admin Mode</span>
        </div>

        {!minimized && (
          <div className="flex items-center gap-1.5">
            {/* Quick Categories Customizer */}
            <button
              onClick={onOpenCategoriesCustomizer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#0066FF] text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Edit dance categories, timings and prices"
            >
              <Sliders className="w-3.5 h-3.5 text-[#0066FF] hover:text-white" />
              <span>Categories &amp; Pricing</span>
            </button>

            {/* Quick Hero Video Customizer */}
            {onOpenVideoCustomizer && (
              <button
                onClick={onOpenVideoCustomizer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                title="Edit hero background video"
              >
                <Video className="w-3.5 h-3.5 text-white/70" />
                <span className="hidden sm:inline">Hero Video</span>
              </button>
            )}

            {/* Quick Gallery Scroll */}
            <button
              onClick={() => {
                const el = document.getElementById('gallery');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#0066FF] text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Jump to Photo Gallery"
            >
              <Camera className="w-3.5 h-3.5 text-white/80" />
              <span className="hidden sm:inline">Gallery</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer border border-red-500/20"
              title="Exit Admin Mode"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Minimize / Expand Toggle */}
        <button
          onClick={() => setMinimized(!minimized)}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={minimized ? "Expand admin controls" : "Minimize admin bar"}
        >
          {minimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  );
};
