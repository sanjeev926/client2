import React, { useState, useEffect } from 'react';
import {
  Award,
  Tv,
  Film,
  ArrowRight,
  Play,
  ExternalLink,
  Edit3,
  X,
  Check,
  Sparkles,
  Camera,
  Maximize2,
  Calendar,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { studioAchievements, Achievement } from '../data/danceData';
import { RealYoutubeIcon } from './BrandIcons';
import { useAdmin } from '../context/AdminContext';
import { saveDeviceMediaFile } from '../utils/mediaStorage';
import { uploadMediaToServer } from '../utils/mediaUpload';

const STORAGE_KEY = 'ramys_achievements_videos_v2';

export const AchievementsSection: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return studioAchievements.map((item) => {
            const match = parsed.find((p: Achievement) => p.id === item.id);
            return match ? { ...item, ...match } : item;
          });
        }
      }
    } catch {
      // ignore
    }
    return studioAchievements;
  });

  const [editingCard, setEditingCard] = useState<Achievement | null>(null);
  const [activePhotoModal, setActivePhotoModal] = useState<Achievement | null>(null);

  // Form states
  const [formVideoTitle, setFormVideoTitle] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formPlatform, setFormPlatform] = useState<'youtube' | 'instagram' | 'video'>('youtube');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formPhotoTitle, setFormPhotoTitle] = useState('');
  const [formPhotoCaption, setFormPhotoCaption] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Sync to storage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    } catch {
      // ignore
    }
  }, [achievements]);

  // Fetch live global achievements from server
  useEffect(() => {
    let isMounted = true;
    fetch('/api/achievements')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setAchievements(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToCategories = () => {
    const el = document.getElementById('categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenEdit = (e: React.MouseEvent, item: Achievement) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingCard(item);
    setFormVideoTitle(item.videoTitle || '');
    setFormVideoUrl(item.videoUrl || '');
    setFormPlatform(item.videoPlatform || 'youtube');
    setFormImageUrl(item.imageUrl || '');
    setFormPhotoTitle(item.photoTitle || item.title);
    setFormPhotoCaption(item.photoCaption || item.description);
    setSaveSuccess(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCard) return;

    setIsUploading(true);
    try {
      const serverUrl = await uploadMediaToServer(file, `achievement_${editingCard.id}`);
      setFormImageUrl(serverUrl);
    } catch (err) {
      console.error('Achievement photo upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    const trimmedUrl = formVideoUrl.trim() || 'https://www.youtube.com/@ramysdancestudio6278';
    const trimmedTitle = formVideoTitle.trim() || 'Watch Showcase Video';
    const trimmedImage = formImageUrl.trim() || editingCard.imageUrl;

    const updatedAchievements = achievements.map((item) =>
      item.id === editingCard.id
        ? {
            ...item,
            videoUrl: trimmedUrl,
            videoTitle: trimmedTitle,
            videoPlatform: formPlatform,
            imageUrl: trimmedImage,
            photoTitle: formPhotoTitle.trim() || item.title,
            photoCaption: formPhotoCaption.trim() || item.description,
          }
        : item
    );

    setAchievements(updatedAchievements);

    // Sync to live server
    fetch('/api/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        achievements: updatedAchievements,
        adminPin: 'ramy2026',
      }),
    }).catch(() => {});

    setSaveSuccess(true);
    setTimeout(() => {
      setEditingCard(null);
      setSaveSuccess(false);
    }, 600);
  };

  const renderIcon = (type: Achievement['iconType']) => {
    switch (type) {
      case 'tv':
        return <Tv className="w-5 h-5 text-[#0066FF]" />;
      case 'ribbon':
        return <Award className="w-5 h-5 text-[#0066FF]" />;
      case 'film':
        return <Film className="w-5 h-5 text-[#0066FF]" />;
      default:
        return <Award className="w-5 h-5 text-[#0066FF]" />;
    }
  };

  return (
    <section id="achievements" className="relative py-20 md:py-28 bg-neutral-50 text-neutral-900 border-y border-neutral-200 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0066FF] text-xs font-bold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5 text-[#0066FF]" />
            <span>NATIONAL RECOGNITION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight leading-tight text-neutral-950 uppercase">
            Our Legacy &amp; Achievements
          </h2>

          <p className="text-neutral-600 text-sm sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">
            Recognized on national television platforms and blockbuster screens. Click any photo or showcase video to explore!
          </p>

          {/* Admin Indicator */}
          {isAdmin && (
            <div className="pt-2 flex justify-center items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] shadow-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admin Mode: Photo &amp; Video customisation enabled</span>
              </span>
            </div>
          )}
        </div>

        {/* 3 Achievements Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200/90 rounded-3xl p-6 flex flex-col justify-between hover:border-neutral-300 transition-all duration-300 hover:shadow-md relative group/card"
            >
              <div className="space-y-5">
                {/* Header: Icon box + Admin Edit Quick Trigger */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      {renderIcon(item.iconType)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                        {item.tag}
                      </span>
                      <span className="text-xs font-bold text-[#0066FF]">
                        {item.verifiedLabel}
                      </span>
                    </div>
                  </div>

                  {/* Admin Edit Button */}
                  {isAdmin && (
                    <button
                      onClick={(e) => handleOpenEdit(e, item)}
                      title="Admin: Edit photo, video & links"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-[#0066FF] text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {/* Achievement Stage Photo Banner - Interactive Photo Preview */}
                <div
                  onClick={() => setActivePhotoModal(item)}
                  className="group/photo relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/90 hover:border-[#0066FF] transition-all cursor-pointer shadow-xs hover:shadow-lg select-none"
                  title="Click to view full photo"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.photoTitle || item.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.88] group-hover/photo:brightness-100 group-hover/photo:scale-105 transition-all duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/photo:opacity-90 transition-opacity" />

                  {/* Top Badge & Zoom Icon */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15">
                      <Camera className="w-3 h-3 text-[#388bff]" />
                      <span>Stage Photo</span>
                    </span>

                    <span className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 group-hover/photo:bg-[#0066FF] group-hover/photo:text-white transition-all shadow-xs">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Bottom Text Overlay on Photo */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left z-10">
                    <p className="text-xs font-bold text-white truncate font-display drop-shadow-sm">
                      {item.photoTitle || item.title}
                    </p>
                    <p className="text-[10px] text-white/75 truncate">
                      Click to view high-resolution photo
                    </p>
                  </div>
                </div>

                {/* Title and description */}
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-neutral-950 group-hover/card:text-[#0066FF] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Action Buttons: 1) View Photo Modal, 2) Watch Video */}
                <div className="space-y-2 pt-1">
                  {/* Button 1: View Photo */}
                  <button
                    type="button"
                    onClick={() => setActivePhotoModal(item)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/70 transition-all text-left cursor-pointer group/photobtn"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[9px] font-bold text-blue-700 uppercase tracking-wider">
                          Official Photo
                        </span>
                        <span className="block text-xs font-bold text-neutral-900 truncate">
                          View Stage Photo
                        </span>
                      </div>
                    </div>

                    <span className="text-[#0066FF] text-xs font-bold flex items-center gap-1 shrink-0 ml-2">
                      <span className="hidden sm:inline">Open</span>
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  {/* Button 2: Watch Video */}
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-all text-left shadow-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shrink-0 group-hover/btn:scale-105 transition-transform">
                        {item.videoPlatform === 'youtube' ? (
                          <RealYoutubeIcon className="w-4 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 text-red-600 fill-current" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                          Showcase Video
                        </span>
                        <span className="block text-xs font-bold text-neutral-900 group-hover/btn:text-[#0066FF] truncate transition-colors">
                          {item.videoTitle || 'Watch Video'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[#0066FF] text-xs font-bold shrink-0 ml-2">
                      <span className="hidden sm:inline">Play</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </div>
                  </a>
                </div>
              </div>

              {/* Bottom Card Meta */}
              <div className="pt-4 mt-5 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-semibold tracking-wider uppercase text-[11px]">
                  {item.tag}
                </span>
                <span className="text-[#0066FF] font-bold text-xs">
                  {item.verifiedLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Center Bottom Action Button */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToCategories}
            className="group flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white border border-neutral-900 text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            <span>Explore Dance Styles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-xl animate-in fade-in duration-200 select-none"
          onClick={() => setActivePhotoModal(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActivePhotoModal(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Close photo (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image frame */}
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/80 shadow-2xl max-h-[72vh] flex items-center justify-center">
              <img
                src={activePhotoModal.imageUrl}
                alt={activePhotoModal.photoTitle || activePhotoModal.title}
                className="w-auto h-auto max-h-[72vh] max-w-full object-contain rounded-2xl"
              />
            </div>

            {/* Photo Info & Video Button */}
            <div className="mt-4 text-center max-w-2xl px-4 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#0066FF]/20 text-[#3d8dff] border border-[#0066FF]/30">
                  {activePhotoModal.tag}
                </span>
                <span className="text-[11px] text-white/50">
                  {activePhotoModal.verifiedLabel}
                </span>
              </div>

              <h3 className="text-base sm:text-xl font-bold text-white font-display">
                {activePhotoModal.photoTitle || activePhotoModal.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activePhotoModal.photoCaption || activePhotoModal.description}
              </p>

              {/* Watch Video link inside photo modal */}
              <div className="pt-2 flex justify-center">
                <a
                  href={activePhotoModal.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md"
                >
                  <RealYoutubeIcon className="w-4 h-3.5" />
                  <span>Watch Performance Video</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {editingCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setEditingCard(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#14161F] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl text-white space-y-5 my-auto max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-[#0066FF] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-base sm:text-lg font-bold font-display">
                  Edit Photo &amp; Video: {editingCard.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingCard(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Photo Image URL & Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Achievement Photo Image
                </label>
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black/60 border border-white/10">
                  <img
                    src={formImageUrl || editingCard.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://... photo image URL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF] text-xs font-mono"
                  required
                />
                <div className="flex gap-2">
                  <label className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer border border-white/10">
                    <Upload className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Photo from Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Photo Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Photo Title
                </label>
                <input
                  type="text"
                  value={formPhotoTitle}
                  onChange={(e) => setFormPhotoTitle(e.target.value)}
                  placeholder="e.g. India's Got Talent Stage Spotlight"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF] text-xs"
                />
              </div>

              {/* Photo Caption */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Photo Caption
                </label>
                <textarea
                  rows={2}
                  value={formPhotoCaption}
                  onChange={(e) => setFormPhotoCaption(e.target.value)}
                  placeholder="Short description of this achievement moment..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF] text-xs resize-none"
                />
              </div>

              {/* Video Title */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Video Showcase Name / Title
                </label>
                <input
                  type="text"
                  value={formVideoTitle}
                  onChange={(e) => setFormVideoTitle(e.target.value)}
                  placeholder="e.g. Watch Dance India Dance Performance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF] text-xs"
                  required
                />
              </div>

              {/* Video URL Link */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Video URL / Redirect Link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#0066FF] text-xs font-mono"
                    required
                  />
                  {formVideoUrl && (
                    <a
                      href={formVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-[#388bff] flex items-center gap-1 transition-colors"
                    >
                      <span>Test</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Platform Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Platform Icon
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormPlatform('youtube')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      formPlatform === 'youtube'
                        ? 'bg-red-500/20 border-red-500 text-white'
                        : 'bg-black/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <RealYoutubeIcon className="w-4 h-4" />
                    <span>YouTube</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPlatform('instagram')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      formPlatform === 'instagram'
                        ? 'bg-pink-500/20 border-pink-500 text-white'
                        : 'bg-black/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 text-pink-400 fill-current" />
                    <span>Instagram</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPlatform('video')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      formPlatform === 'video'
                        ? 'bg-[#0066FF]/20 border-[#0066FF] text-[#0066FF]'
                        : 'bg-black/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Direct Video</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{saveSuccess ? 'Saved!' : 'Save Changes'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </section>
  );
};
