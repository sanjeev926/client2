import React, { useState, useEffect } from 'react';
import { Camera, Play, ExternalLink, Sparkles, Edit3, Upload, Smartphone } from 'lucide-react';
import { studioReels, ReelMedia, instagramProfileUrl } from '../data/media';
import { RealInstagramIcon } from './BrandIcons';
import { ReelsCustomizerModal } from './ReelsCustomizerModal';
import { resolvePlayableUrl, isDeviceMediaKey } from '../utils/mediaStorage';
import { useAdmin } from '../context/AdminContext';

interface ReelsSectionProps {
  onSelectReel: (reel: ReelMedia) => void;
}

const STORAGE_KEY = 'ramys_studio_reels_custom_v2';

export const ReelsSection: React.FC<ReelsSectionProps> = ({ onSelectReel }) => {
  const { isAdmin } = useAdmin();
  const [reels, setReels] = useState<ReelMedia[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return studioReels;
  });

  // State holding resolved active URLs (blob URLs for device uploads or regular URLs)
  const [resolvedReels, setResolvedReels] = useState<ReelMedia[]>(reels);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [editingReelId, setEditingReelId] = useState<string | undefined>(undefined);

  // Fetch live global reels from server
  useEffect(() => {
    let isMounted = true;
    fetch('/api/reels')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length >= 4) {
          setReels(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Resolve media URLs whenever reels state changes
  useEffect(() => {
    let isMounted = true;
    const resolveAllMedia = async () => {
      const resolved = await Promise.all(
        reels.map(async (reel) => {
          let videoUrl = reel.videoUrl;
          let thumbnailUrl = reel.thumbnailUrl;

          if (isDeviceMediaKey(videoUrl)) {
            const resolvedVideo = await resolvePlayableUrl(videoUrl);
            if (resolvedVideo) videoUrl = resolvedVideo;
          }
          if (isDeviceMediaKey(thumbnailUrl)) {
            const resolvedThumb = await resolvePlayableUrl(thumbnailUrl);
            if (resolvedThumb) thumbnailUrl = resolvedThumb;
          }

          return { ...reel, videoUrl, thumbnailUrl };
        })
      );

      if (isMounted) {
        setResolvedReels(resolved);
      }
    };

    resolveAllMedia();

    return () => {
      isMounted = false;
    };
  }, [reels]);

  const handleSaveReels = (updatedReels: ReelMedia[]) => {
    setReels(updatedReels);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReels));
    } catch {
      // Storage error
    }
  };

  const handleResetReels = () => {
    setReels(studioReels);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage error
    }
  };

  const handleOpenEditSlot = (e: React.MouseEvent, reelId: string) => {
    e.stopPropagation();
    setEditingReelId(reelId);
    setIsCustomizerOpen(true);
  };

  const hiphopReel = resolvedReels.find((r) => r.id === 'reel-hiphop') || resolvedReels[0];
  const kidsReel = resolvedReels.find((r) => r.id === 'reel-kids') || resolvedReels[1];
  const bollywoodReel = resolvedReels.find((r) => r.id === 'reel-bollywood') || resolvedReels[2];
  const weddingReel = resolvedReels.find((r) => r.id === 'reel-wedding') || resolvedReels[3];

  return (
    <section id="reels" className="relative py-16 sm:py-20 md:py-28 bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0066FF] text-xs font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>STUDIO MEDIA SHOWCASE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-neutral-950 uppercase">
              REELS &amp; PERFORMANCES
            </h2>
          </div>

          {/* Action Buttons: Direct Device Upload / Customizer Trigger + Instagram */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Direct Device Upload Trigger (Admin only) */}
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingReelId(undefined);
                  setIsCustomizerOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052cc] text-xs font-bold text-white transition-all cursor-pointer shadow-md active:scale-95"
                title="Upload photos & videos from any phone, tablet or PC"
              >
                <Upload className="w-3.5 h-3.5 text-white" />
                <span>Upload Video / Photo</span>
              </button>
            )}

            <a
              href={instagramProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-xs font-bold text-neutral-900 transition-colors shadow-xs"
            >
              <RealInstagramIcon className="w-4 h-4 shrink-0" />
              <span className="uppercase tracking-wider hidden sm:inline">@RAMYSDANCESTUDIO</span>
              <span className="uppercase tracking-wider sm:hidden">Instagram</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </a>
          </div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Large Bento Card: Hip Hop Choreography (spans 6 cols) */}
          <div
            onClick={() => onSelectReel(hiphopReel)}
            className="lg:col-span-6 relative h-[420px] sm:h-[480px] lg:h-[560px] rounded-3xl overflow-hidden border border-neutral-200/90 bg-neutral-900 cursor-pointer group flex flex-col justify-between p-6 sm:p-8 transition-all hover:shadow-xl select-none"
          >
            {/* Background image */}
            <div className="absolute inset-0 z-0">
              <img
                src={hiphopReel.thumbnailUrl}
                alt={hiphopReel.title}
                className="w-full h-full object-cover object-center filter brightness-[0.75] group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* Top row with Badge & Quick Edit Button */}
            <div className="relative z-10 flex items-center justify-between">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={(e) => handleOpenEditSlot(e, hiphopReel.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-white/20 text-white text-[11px] font-bold transition-all shadow-sm cursor-pointer"
                  title="Change or upload video for this card"
                >
                  <Edit3 className="w-3 h-3 text-[#0066FF]" />
                  <span>Change / Upload</span>
                </button>
              ) : <div />}

              <span className="bg-white/95 text-neutral-900 text-xs font-black px-3 py-1 rounded-full shadow-md">
                {hiphopReel.badge || 'Featured Reel'}
              </span>
            </div>

            {/* Center Play Button */}
            <div className="relative z-10 flex items-center justify-center my-auto">
              <div className="w-16 h-16 rounded-full bg-[#0066FF] group-hover:bg-blue-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="relative z-10 space-y-2">
              <span className="text-[#0066FF] bg-white text-[11px] font-black tracking-wider uppercase inline-block px-2.5 py-0.5 rounded-full shadow">
                {hiphopReel.categoryTag}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                {hiphopReel.title}
              </h3>
              {hiphopReel.description && (
                <p className="text-neutral-200 text-xs sm:text-sm font-normal leading-relaxed max-w-lg">
                  {hiphopReel.description}
                </p>
              )}
            </div>
          </div>

          {/* Right Bento Column: 2 Top Half Cards + 1 Bottom Wide Card (spans 6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Right Top 2 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-auto sm:h-[260px] lg:h-[268px]">
              
              {/* Kids Dance Card */}
              <div
                onClick={() => onSelectReel(kidsReel)}
                className="relative h-[220px] sm:h-full rounded-3xl overflow-hidden border border-neutral-200/90 bg-neutral-900 cursor-pointer group flex flex-col justify-between p-5 sm:p-6 transition-all hover:shadow-lg select-none"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={kidsReel.thumbnailUrl}
                    alt={kidsReel.title}
                    className="w-full h-full object-cover filter brightness-[0.75] group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Top Bar with Play indicator and Admin edit button */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#0066FF] transition-all shadow-xs">
                    <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
                  </span>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditSlot(e, kidsReel.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Edit3 className="w-2.5 h-2.5 text-[#0066FF]" />
                      <span>Upload / Edit</span>
                    </button>
                  )}
                </div>

                {/* Bottom Anchored Text (Niche) */}
                <div className="relative z-10 mt-auto pt-4 space-y-1.5">
                  <span className="text-[#0066FF] bg-white text-[10px] font-bold tracking-wider uppercase inline-block px-2.5 py-0.5 rounded-full shadow-xs">
                    {kidsReel.categoryTag}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold font-display text-white">
                    {kidsReel.title}
                  </h4>
                </div>
              </div>

              {/* Bollywood Ladies Card */}
              <div
                onClick={() => onSelectReel(bollywoodReel)}
                className="relative h-[220px] sm:h-full rounded-3xl overflow-hidden border border-neutral-200/90 bg-neutral-900 cursor-pointer group flex flex-col justify-between p-5 sm:p-6 transition-all hover:shadow-lg select-none"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={bollywoodReel.thumbnailUrl}
                    alt={bollywoodReel.title}
                    className="w-full h-full object-cover filter brightness-[0.75] group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>

                {/* Top Bar with Play indicator and Admin edit button */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#0066FF] transition-all shadow-xs">
                    <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
                  </span>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditSlot(e, bollywoodReel.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Edit3 className="w-2.5 h-2.5 text-[#0066FF]" />
                      <span>Upload / Edit</span>
                    </button>
                  )}
                </div>

                {/* Bottom Anchored Text (Niche) */}
                <div className="relative z-10 mt-auto pt-4 space-y-1.5">
                  <span className="text-[#0066FF] bg-white text-[10px] font-bold tracking-wider uppercase inline-block px-2.5 py-0.5 rounded-full shadow-xs">
                    {bollywoodReel.categoryTag}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold font-display text-white">
                    {bollywoodReel.title}
                  </h4>
                </div>
              </div>

            </div>

            {/* Right Bottom Wide Card: Wedding Choreography */}
            <div
              onClick={() => onSelectReel(weddingReel)}
              className="relative h-[240px] sm:h-[260px] lg:h-[268px] rounded-3xl overflow-hidden border border-neutral-200/90 bg-neutral-900 cursor-pointer group flex flex-col justify-between p-6 sm:p-8 transition-all hover:shadow-lg select-none"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={weddingReel.thumbnailUrl}
                  alt={weddingReel.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.72] group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>

              {/* Top Bar with Play indicator and Admin edit button */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#0066FF] transition-all shadow-xs">
                  <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
                </span>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditSlot(e, weddingReel.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Edit3 className="w-2.5 h-2.5 text-[#0066FF]" />
                    <span>Upload / Edit</span>
                  </button>
                )}
              </div>

              {/* Bottom Anchored Text (Niche) */}
              <div className="relative z-10 mt-auto pt-4 space-y-1.5">
                <span className="text-[#0066FF] bg-white text-[10px] font-black tracking-wider uppercase inline-block px-2.5 py-0.5 rounded-full shadow-xs">
                  {weddingReel.categoryTag}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {weddingReel.title}
                </h3>
                {weddingReel.description && (
                  <p className="text-neutral-200 text-xs sm:text-sm font-normal leading-relaxed max-w-md">
                    {weddingReel.description}
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Live Device Upload Banner (Admin only) */}
        {isAdmin && (
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-blue-50/40 border border-blue-200/70 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-800">
              <div className="w-10 h-10 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-neutral-950 flex items-center gap-2">
                  <span>Any Device Media Upload Ready</span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Admin Tool
                  </span>
                </p>
                <p className="text-neutral-600 text-xs mt-0.5">
                  Aap apne phone gallery, camera roll, tablet ya laptop files se direct video clips aur cover photos upload karke instant live play kar sakte hain.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setEditingReelId(undefined);
                  setIsCustomizerOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
              </button>
              <a
                href={instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-neutral-700 hover:text-[#0066FF] transition-colors flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-neutral-100"
              >
                <span>Instagram Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Live Reels Customizer Modal */}
      <ReelsCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        reels={reels}
        onSaveReels={handleSaveReels}
        onResetReels={handleResetReels}
        initialSelectedId={editingReelId}
      />
    </section>
  );
};
