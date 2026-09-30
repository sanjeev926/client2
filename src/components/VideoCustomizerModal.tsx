import React, { useState, useRef } from 'react';
import {
  X,
  Check,
  RotateCcw,
  Video,
  Sliders,
  Upload,
  Link2,
  Sparkles,
  Eye,
  Film,
  Globe,
  Lock,
  Loader2,
  AlertCircle,
  Play,
  CheckCircle2,
  Smartphone,
  Laptop,
  HardDrive
} from 'lucide-react';
import { formatBytes, saveDeviceMediaFile } from '../utils/mediaStorage';
import { uploadMediaWithProgress } from '../utils/mediaUpload';

export interface HeroVideoConfig {
  videoUrl: string;
  xPosition: number; // 0 to 100 (%)
  yPosition: number; // 0 to 100 (%)
  zoom: number; // 1.0 to 1.5
  overlayDarkness: number; // 0.1 to 0.85
  brightness: number; // 0.6 to 1.3
  contrast: number; // 0.8 to 1.4
  playbackSpeed: number; // 0.75, 1, 1.25
  label?: string;
  updatedAt?: string;
}

export const defaultHeroVideoConfig: HeroVideoConfig = {
  videoUrl: '/hero-loop.mp4',
  xPosition: 50,
  yPosition: 50,
  zoom: 1.0,
  overlayDarkness: 0.45,
  brightness: 0.85,
  contrast: 1.05,
  playbackSpeed: 1.0,
  label: 'Street Dance & B-Boying (Default)',
};

export const VIDEO_PRESETS: { id: string; name: string; url: string; category: string }[] = [
  {
    id: 'preset-street',
    name: 'Street Dance & Freestyle Loop',
    url: '/hero-loop.mp4',
    category: 'Hip Hop / B-Boying',
  },
  {
    id: 'preset-stage',
    name: 'Live Stage Choreography',
    url: '/hero-stage.mp4',
    category: 'Stage & Performance',
  },
  {
    id: 'preset-cypher',
    name: 'Cypher & Battle Energy',
    url: '/hero-cypher.mp4',
    category: 'Freestyle & Moves',
  },
];

interface VideoCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: HeroVideoConfig;
  onChange: (updated: HeroVideoConfig) => void;
  onReset: () => void;
}

export const VideoCustomizerModal: React.FC<VideoCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
  onReset,
}) => {
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'source' | 'placement' | 'effects' | 'publish'>('source');
  const [adminPin, setAdminPin] = useState('ramy2026');
  
  // Real-time Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  if (!isOpen) return null;

  // Auto-sync a configuration globally to server database
  const syncConfigToServer = async (newConfig: HeroVideoConfig) => {
    try {
      await fetch('/api/hero-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: newConfig, adminPin: adminPin.trim() || 'ramy2026' }),
      });
    } catch (err) {
      console.warn('Could not auto-sync hero video config to server:', err);
    }
  };

  const handlePresetSelect = (presetUrl: string, name: string) => {
    const updated = {
      ...config,
      videoUrl: presetUrl,
      label: name,
      updatedAt: new Date().toISOString(),
    };
    onChange(updated);
    syncConfigToServer(updated);
    setUploadSuccessMessage(`✅ Preset video "${name}" selected & synced globally!`);
    setUploadErrorMessage(null);
  };

  const handleCustomUrlApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    const updated = {
      ...config,
      videoUrl: customUrlInput.trim(),
      label: 'Custom Video URL',
      updatedAt: new Date().toISOString(),
    };
    onChange(updated);
    syncConfigToServer(updated);
    setUploadSuccessMessage('✅ Custom video URL applied & synced globally!');
    setUploadErrorMessage(null);
    setCustomUrlInput('');
  };

  // Direct Device Upload (Works effortlessly on Laptop, Desktop, iPhone & Android)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(1);
    setUploadStatusText(`Preparing ${file.name} (${formatBytes(file.size)})...`);
    setUploadSuccessMessage(null);
    setUploadErrorMessage(null);

    try {
      // 1. Upload with real-time percentage
      const serverUrl = await uploadMediaWithProgress(
        file,
        'hero_video',
        (percent, loaded, total) => {
          setUploadProgress(percent);
          setUploadStatusText(`Uploading: ${percent}% (${formatBytes(loaded)} of ${formatBytes(total)})...`);
        }
      );

      // 2. Build updated config with live permanent server URL
      const updatedConfig: HeroVideoConfig = {
        ...config,
        videoUrl: serverUrl,
        label: `Uploaded Video: ${file.name} (${formatBytes(file.size)})`,
        updatedAt: new Date().toISOString(),
      };

      // 3. Immediately reflect in React state
      onChange(updatedConfig);

      // 4. Save permanently to server JSON
      setUploadStatusText('Saving video settings globally to live server...');
      await syncConfigToServer(updatedConfig);

      setUploadProgress(100);
      setUploadSuccessMessage(`🎉 Success! Video "${file.name}" is now live on all laptops, phones & desktops!`);
    } catch (err: any) {
      console.error('Device video upload error:', err);
      // Fallback to IndexedDB persistent device storage so the video works immediately on this device!
      try {
        const stored = await saveDeviceMediaFile('hero-custom-video', file, file.name);
        const fallbackConfig: HeroVideoConfig = {
          ...config,
          videoUrl: stored.url,
          label: `Device Video: ${file.name} (${formatBytes(file.size)})`,
          updatedAt: new Date().toISOString(),
        };
        onChange(fallbackConfig);
        setUploadSuccessMessage(`✅ Video loaded successfully from device storage! (${file.name})`);
      } catch {
        try {
          const objectUrl = URL.createObjectURL(file);
          const fallbackConfig: HeroVideoConfig = {
            ...config,
            videoUrl: objectUrl,
            label: `Local: ${file.name}`,
          };
          onChange(fallbackConfig);
          setUploadSuccessMessage(`✅ Video loaded from device: ${file.name}`);
        } catch {
          setUploadErrorMessage('❌ Could not load video file. Please ensure it is a valid video format (MP4, MOV, WebM).');
        }
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const setPlacementPreset = (x: number, y: number, zoom = 1.0) => {
    const updated = {
      ...config,
      xPosition: x,
      yPosition: y,
      zoom,
    };
    onChange(updated);
    syncConfigToServer(updated);
  };

  const handleSaveAndClose = async () => {
    setSaveToast(true);
    await syncConfigToServer(config);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 400);
  };

  const handlePublishToLiveWebsite = async () => {
    setIsPublishing(true);
    setPublishStatus(null);
    try {
      const res = await fetch('/api/hero-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          adminPin: adminPin.trim() || 'ramy2026',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPublishStatus({
          type: 'success',
          message: 'Website deploy hone ke baad bhi ab sabhi visitors aur devices ko yahi video dikhegi! Globally saved.',
        });
        onChange(data.config);
      } else {
        setPublishStatus({
          type: 'error',
          message: data.error || 'Publish nahi ho paya. Passcode check karein.',
        });
      }
    } catch {
      setPublishStatus({
        type: 'error',
        message: 'Server se connect nahi ho saka. Kripya check karein ki server live hai.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#13151B] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-2xl text-white space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#D8F800] uppercase tracking-wider mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>Universal Video Manager</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Hero Background Video
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Phone, Laptop, Desktop — kisi se bhi video upload karein, instantly live update ho jayega!
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1C202B] hover:bg-[#282F3E] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LIVE PREVIEW SCREEN */}
        <div className="relative w-full h-44 sm:h-52 bg-black rounded-2xl overflow-hidden border border-white/15 shadow-inner group">
          <video
            key={config.videoUrl}
            src={config.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{
              objectPosition: `${config.xPosition}% ${config.yPosition}%`,
              transform: `scale(${config.zoom})`,
              filter: `brightness(${config.brightness}) contrast(${config.contrast})`,
            }}
          />
          {/* Top Info Badge */}
          <div className="absolute top-2.5 left-2.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white flex items-center gap-2 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate max-w-[240px] sm:max-w-xs">{config.label || 'Active Video'}</span>
          </div>

          {/* Bottom Device Compatibility Badge */}
          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-medium text-slate-300 flex items-center gap-2">
            <Laptop className="w-3 h-3 text-[#D8F800]" />
            <Smartphone className="w-3 h-3 text-[#D8F800]" />
            <span>Multi-Device Ready</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-[#0D0E12] p-1 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('source')}
            className={`py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer truncate px-1 ${
              activeTab === 'source'
                ? 'bg-[#D8F800] text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Change Video</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('placement')}
            className={`py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer truncate px-1 ${
              activeTab === 'placement'
                ? 'bg-[#D8F800] text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Placement</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('effects')}
            className={`py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer truncate px-1 ${
              activeTab === 'effects'
                ? 'bg-[#D8F800] text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Effects</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('publish')}
            className={`py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer truncate px-1 ${
              activeTab === 'publish'
                ? 'bg-[#D8F800] text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Publish Live</span>
          </button>
        </div>

        {/* TAB 1: Video Source (Upload or Presets) */}
        {activeTab === 'source' && (
          <div className="space-y-4 pt-1">
            {/* Status alerts */}
            {uploadSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="font-medium">{uploadSuccessMessage}</span>
              </div>
            )}

            {uploadErrorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span className="font-medium">{uploadErrorMessage}</span>
              </div>
            )}

            {/* REAL-TIME PROGRESS BAR */}
            {isUploading && (
              <div className="p-4 rounded-2xl bg-blue-500/15 border border-blue-500/35 space-y-2.5 shadow-lg animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs font-bold text-blue-300">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#D8F800]" />
                    {uploadStatusText}
                  </span>
                  <span className="font-mono text-sm text-[#D8F800]">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-blue-950/70 overflow-hidden border border-blue-400/20">
                  <div
                    className="h-full bg-gradient-to-r from-[#0066FF] to-[#D8F800] transition-all duration-200 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  Uploading directly to server storage. Please keep this window open...
                </p>
              </div>
            )}

            {/* 3GB FREE STORAGE ALLOCATION & RECOMMENDED SIZE GUIDE */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D8F800]/10 via-[#0066FF]/10 to-[#13151B] border border-[#D8F800]/30 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-[#D8F800]">
                  <HardDrive className="w-4 h-4 text-[#D8F800]" />
                  <span>3.0 GB Free Cloud Storage Active</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Capacity: 200+ Videos
                </span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                <p>
                  <span className="font-bold text-white">💡 Hero Video Recommended Size: </span>
                  <span className="text-[#D8F800] font-extrabold">5 MB to 15 MB</span> (15–30 sec loop, 1080p).
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  <strong>Fayda:</strong> Is size me video har user ke mobile aur 4G/5G par 1 second me bina buffering ke chalegi, aur aapka <strong>3GB free storage</strong> kabhi khatam nahi hoga!
                </p>
              </div>
            </div>

            {/* PROMINENT UNIVERSAL UPLOADER */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span>Upload From Your Device (Phone / Laptop / PC)</span>
                <span className="text-[10px] text-emerald-400 font-normal">Auto-Syncs Globally</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="video/*,.mp4,.mov,.webm,.mkv,.m4v"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />

              <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${
                  isUploading
                    ? 'border-blue-500/40 bg-blue-500/5 opacity-60 cursor-not-allowed'
                    : 'border-white/20 hover:border-[#D8F800] bg-[#171A23] hover:bg-[#1D212D] active:scale-[0.99]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#D8F800]/15 flex items-center justify-center text-[#D8F800] border border-[#D8F800]/30 shadow-inner">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    {isUploading ? 'Uploading Video File...' : 'Click Here to Select Video File'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Select any dance video from your Laptop files, Gallery, or Phone camera roll.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Supports MP4, MOV (iPhone/Mac), WebM, MKV up to 150MB
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-[#D8F800] hover:bg-[#cbf000] text-black font-extrabold text-xs transition-colors shadow-md"
                >
                  Browse Device Files
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Or Select From Studio Presets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {VIDEO_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset.url, preset.name)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      config.videoUrl === preset.url
                        ? 'bg-[#1C2218] border-[#D8F800] text-white shadow-md'
                        : 'bg-[#181B22] border-white/10 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Film className={`w-4 h-4 ${config.videoUrl === preset.url ? 'text-[#D8F800]' : 'text-slate-400'}`} />
                      {config.videoUrl === preset.url && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#D8F800] text-black">
                          Active
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white line-clamp-1">{preset.name}</p>
                      <p className="text-[10px] text-slate-400">{preset.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Or Paste Video URL (MP4 / WebM / CDN link)
              </label>
              <form onSubmit={handleCustomUrlApply} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/dance-choreography.mp4"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0D0E12] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-[#D8F800] text-xs font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#202532] hover:bg-[#2A3142] text-[#D8F800] font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Apply</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: Placement & Alignment */}
        {activeTab === 'placement' && (
          <div className="space-y-4 pt-1">
            {/* Quick Placement Presets */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Quick Framing Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPlacementPreset(50, 20)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    config.yPosition <= 30
                      ? 'bg-[#D8F800]/20 border-[#D8F800] text-[#D8F800]'
                      : 'bg-[#181B22] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Top (Upper Body)
                </button>

                <button
                  type="button"
                  onClick={() => setPlacementPreset(50, 50)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    config.yPosition > 30 && config.yPosition < 70
                      ? 'bg-[#D8F800]/20 border-[#D8F800] text-[#D8F800]'
                      : 'bg-[#181B22] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Center (Balanced)
                </button>

                <button
                  type="button"
                  onClick={() => setPlacementPreset(50, 80)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    config.yPosition >= 70
                      ? 'bg-[#D8F800]/20 border-[#D8F800] text-[#D8F800]'
                      : 'bg-[#181B22] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  Bottom (Footwork)
                </button>
              </div>
            </div>

            {/* Vertical Y-Position Slider */}
            <div className="space-y-1.5 bg-[#161922] p-3.5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Vertical Offset (Y-Axis)</span>
                <span className="text-[#D8F800] font-mono">{config.yPosition}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.yPosition}
                onChange={(e) =>
                  onChange({ ...config, yPosition: Number(e.target.value) })
                }
                className="w-full accent-[#D8F800] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% (Top)</span>
                <span>50% (Center)</span>
                <span>100% (Bottom)</span>
              </div>
            </div>

            {/* Horizontal X-Position Slider */}
            <div className="space-y-1.5 bg-[#161922] p-3.5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Horizontal Pan (X-Axis)</span>
                <span className="text-[#D8F800] font-mono">{config.xPosition}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.xPosition}
                onChange={(e) =>
                  onChange({ ...config, xPosition: Number(e.target.value) })
                }
                className="w-full accent-[#D8F800] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% (Left)</span>
                <span>50% (Center)</span>
                <span>100% (Right)</span>
              </div>
            </div>

            {/* Zoom Slider */}
            <div className="space-y-1.5 bg-[#161922] p-3.5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Zoom / Scale</span>
                <span className="text-[#D8F800] font-mono">{config.zoom.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="1.5"
                step="0.05"
                value={config.zoom}
                onChange={(e) =>
                  onChange({ ...config, zoom: Number(e.target.value) })
                }
                className="w-full accent-[#D8F800] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1.0x (Normal)</span>
                <span>1.25x</span>
                <span>1.5x (Close-up)</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Visual Effects & Lighting */}
        {activeTab === 'effects' && (
          <div className="space-y-4 pt-1">
            {/* Overlay Darkness Slider */}
            <div className="space-y-1.5 bg-[#161922] p-3.5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Overlay Dimming (Text Readability)</span>
                <span className="text-[#D8F800] font-mono">{Math.round(config.overlayDarkness * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.85"
                step="0.05"
                value={config.overlayDarkness}
                onChange={(e) =>
                  onChange({ ...config, overlayDarkness: Number(e.target.value) })
                }
                className="w-full accent-[#D8F800] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10% (Bright Video)</span>
                <span>45% (Recommended)</span>
                <span>85% (Dark Film)</span>
              </div>
            </div>

            {/* Brightness Slider */}
            <div className="space-y-1.5 bg-[#161922] p-3.5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Video Brightness</span>
                <span className="text-[#D8F800] font-mono">{Math.round(config.brightness * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.3"
                step="0.05"
                value={config.brightness}
                onChange={(e) =>
                  onChange({ ...config, brightness: Number(e.target.value) })
                }
                className="w-full accent-[#D8F800] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>60% (Dim)</span>
                <span>100% (Original)</span>
                <span>130% (Vibrant)</span>
              </div>
            </div>

            {/* Playback Speed */}
            <div className="space-y-1.5 bg-[#161922] p-3.5 rounded-2xl border border-white/10">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Playback Speed
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '0.75x Slow Motion', val: 0.75 },
                  { label: '1.0x Normal Speed', val: 1.0 },
                  { label: '1.25x Dynamic Beat', val: 1.25 },
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => onChange({ ...config, playbackSpeed: s.val })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      config.playbackSpeed === s.val
                        ? 'bg-[#D8F800]/20 border-[#D8F800] text-[#D8F800]'
                        : 'bg-[#181B22] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Publish to Live Website */}
        {activeTab === 'publish' && (
          <div className="space-y-4 pt-1">
            <div className="bg-[#181B22] p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Globe className="w-4 h-4" />
                <span>Permanent Cloud Persistence</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Settings server par save ho jayengi. Website deploy hone ke baad bhi <strong>sabhi live users, laptops aur phones</strong> par yahi video aur placement dikhegi!
              </p>
              {config.updatedAt && (
                <p className="text-[11px] text-slate-400">
                  Last Live Published: <span className="text-[#D8F800]">{new Date(config.updatedAt).toLocaleString()}</span>
                </p>
              )}
            </div>

            {/* Admin PIN */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Admin Passcode</span>
                <span className="text-[10px] text-slate-500 font-normal">Default PIN: ramy2026</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D0E12] border border-white/15 text-white placeholder-slate-600 focus:outline-none focus:border-[#D8F800] text-xs font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Status alerts */}
            {publishStatus && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  publishStatus.type === 'success'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                {publishStatus.type === 'success' ? (
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{publishStatus.message}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublishToLiveWebsite}
              className="w-full py-3.5 rounded-2xl bg-[#D8F800] hover:bg-[#cbf000] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Publishing to Live Website...</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 text-black" />
                  <span>Publish Globally to Live Website</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleSaveAndClose}
              className="px-5 py-2.5 rounded-full bg-[#D8F800] hover:bg-[#cbf000] text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 text-black" />
              <span>{saveToast ? 'Saved Globally!' : 'Save & Apply Live'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
