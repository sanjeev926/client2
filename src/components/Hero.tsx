import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Award, Sliders, Play, Settings, Edit2 } from 'lucide-react';
import {
  VideoCustomizerModal,
  HeroVideoConfig,
  defaultHeroVideoConfig,
} from './VideoCustomizerModal';
import {
  HeroButtonCustomizerModal,
  HeroButtonsConfig,
  defaultHeroButtonsConfig,
  COLOR_THEMES,
  renderButtonIcon,
  ButtonActionType,
} from './HeroButtonCustomizerModal';
import { resolvePlayableUrl, isDeviceMediaKey, getDeviceMediaBlob } from '../utils/mediaStorage';
import { useAdmin } from '../context/AdminContext';

const VIDEO_CONFIG_STORAGE_KEY = 'ramys_hero_video_config_v2';
const BUTTONS_CONFIG_STORAGE_KEY = 'ramys_hero_buttons_config_v1';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const { isAdmin, openLoginModal } = useAdmin();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isButtonCustomizerOpen, setIsButtonCustomizerOpen] = useState(false);
  const [buttonCustomizerTab, setButtonCustomizerTab] = useState<'secondary' | 'primary'>('secondary');

  // Load persistent video config or fallback to defaults
  const [videoConfig, setVideoConfig] = useState<HeroVideoConfig>(() => {
    try {
      const saved = localStorage.getItem(VIDEO_CONFIG_STORAGE_KEY);
      if (saved) {
        return { ...defaultHeroVideoConfig, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return defaultHeroVideoConfig;
  });

  // Load persistent hero buttons config or fallback to defaults
  const [buttonsConfig, setButtonsConfig] = useState<HeroButtonsConfig>(() => {
    try {
      const saved = localStorage.getItem(BUTTONS_CONFIG_STORAGE_KEY);
      if (saved) {
        return { ...defaultHeroButtonsConfig, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return defaultHeroButtonsConfig;
  });

  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string>('/hero-loop.mp4');

  // Resolve device media url if needed, sync to server, and handle fallbacks
  useEffect(() => {
    let isMounted = true;

    if (isDeviceMediaKey(videoConfig.videoUrl)) {
      const key = videoConfig.videoUrl.replace('device-idb:', '');
      getDeviceMediaBlob(key).then(async (blob) => {
        if (!isMounted) return;

        if (blob) {
          // 1. Play locally immediately
          const localUrl = URL.createObjectURL(blob);
          setResolvedVideoUrl(localUrl);

          // 2. Stream to server in background so all other tabs & clients see it!
          try {
            console.log('Syncing video to server for global availability...');
            const res = await fetch('/api/upload-hero-video', {
              method: 'POST',
              headers: { 'Content-Type': blob.type || 'video/mp4' },
              body: blob,
            });
            if (res.ok) {
              const data = await res.json();
              if (data.success && isMounted) {
                console.log('Video saved to server:', data.url);
                setVideoConfig(data.config);
                try {
                  localStorage.setItem(VIDEO_CONFIG_STORAGE_KEY, JSON.stringify(data.config));
                } catch {}
              }
            }
          } catch (err) {
            console.warn('Could not sync video to server:', err);
          }
        } else {
          // Browser does not have this IndexedDB file (e.g. opened in another tab/device)
          // Check if server already has the uploaded video file
          fetch('/hero-uploaded.mp4', { method: 'HEAD' })
            .then((res) => {
              if (res.ok && isMounted) {
                setResolvedVideoUrl('/hero-uploaded.mp4');
              } else if (isMounted) {
                setResolvedVideoUrl('/hero-loop.mp4');
              }
            })
            .catch(() => {
              if (isMounted) setResolvedVideoUrl('/hero-loop.mp4');
            });
        }
      });
    } else if (videoConfig.videoUrl) {
      setResolvedVideoUrl(videoConfig.videoUrl);
    } else {
      setResolvedVideoUrl('/hero-loop.mp4');
    }

    return () => {
      isMounted = false;
    };
  }, [videoConfig.videoUrl]);

  // Fetch live global config from server on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/hero-video')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && data.videoUrl) {
          setVideoConfig(data);
          try {
            localStorage.setItem(VIDEO_CONFIG_STORAGE_KEY, JSON.stringify(data));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // server offline fallback
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Save config on change
  const handleConfigChange = (updated: HeroVideoConfig) => {
    setVideoConfig(updated);
    try {
      localStorage.setItem(VIDEO_CONFIG_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleResetConfig = () => {
    setVideoConfig(defaultHeroVideoConfig);
    try {
      localStorage.removeItem(VIDEO_CONFIG_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Sync playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = videoConfig.playbackSpeed || 1.0;
    }
  }, [videoConfig.playbackSpeed, resolvedVideoUrl]);

  // Restart video playback when url changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // autoplay restriction fallback
      });
    }
  }, [resolvedVideoUrl]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden bg-[#101216] select-none">
      {/* Background Full-Screen Looping Video with Dynamic Customization */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <video
          ref={videoRef}
          key={resolvedVideoUrl}
          src={resolvedVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          poster="/ramy-official-banner.jpg"
          onLoadedMetadata={() => {
            videoRef.current?.play().catch(() => {});
          }}
          onCanPlay={() => {
            videoRef.current?.play().catch(() => {});
          }}
          className="w-full h-full object-cover transition-all duration-300 pointer-events-none"
          style={{
            objectPosition: `${videoConfig.xPosition}% ${videoConfig.yPosition}%`,
            transform: `scale(${videoConfig.zoom})`,
            filter: `brightness(${videoConfig.brightness}) contrast(${videoConfig.contrast})`,
          }}
        >
          <source src={resolvedVideoUrl} type="video/mp4" />
          <source src={resolvedVideoUrl} type="video/webm" />
          {/* Fallback image: Official Studio Banner */}
          <img
            src="/ramy-official-banner.jpg"
            alt="Ramy's Dance Studio Ranchi"
            className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
            loading="eager"
          />
        </video>

        {/* Ambient Top & Bottom Lighting Gradients with Dynamic Overlay Darkness */}
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,${Math.min(
              1,
              videoConfig.overlayDarkness + 0.35
            )}) 0%, rgba(0,0,0,${
              videoConfig.overlayDarkness * 0.4
            }) 50%, rgba(0,0,0,${videoConfig.overlayDarkness + 0.2}) 100%)`,
          }}
        />
        
        {/* Subtle ceiling lighting reflection overlay */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Floating Video Customizer Trigger (Bottom-Right) */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center">
        <button
          onClick={() => {
            if (!isAdmin) {
              openLoginModal();
            } else {
              setIsCustomizerOpen(true);
            }
          }}
          className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/75 hover:bg-black text-white/90 hover:text-white border border-white/25 hover:border-[#D8F800]/70 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer shadow-xl active:scale-95"
          title="Change background video (Laptop, Desktop, Phone)"
        >
          <Sliders className="w-3.5 h-3.5 text-[#D8F800] group-hover:rotate-45 transition-transform" />
          <span className="text-[11px] tracking-wide font-bold">Customize Video</span>
        </button>
      </div>

      {/* Main Center-Bottom Actions */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16 md:pb-20 flex flex-col items-center justify-center text-center">
        
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
          {/* CATEGORY Button */}
          <button
            onClick={() => scrollToSection('categories')}
            className="group flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold text-sm md:text-base px-8 py-3.5 rounded-full transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <span>CATEGORY</span>
            <ArrowDown className="w-4 h-4 stroke-[3] group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Watch Showcase Button */}
          <button
            onClick={() => scrollToSection('reels')}
            className="group flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 font-bold text-sm md:text-base px-7 py-3.5 rounded-full transition-all backdrop-blur-md shadow-lg active:scale-95 cursor-pointer"
          >
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-[#0066FF] group-hover:scale-105 transition-all">
              <Play className="w-3 h-3 fill-white text-white translate-x-0.5" />
            </span>
            <span>WATCH SHOWCASE</span>
          </button>
        </div>
      </div>

      {/* Video Customizer Modal */}
      <VideoCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        config={videoConfig}
        onChange={handleConfigChange}
        onReset={handleResetConfig}
      />
    </section>
  );
};
