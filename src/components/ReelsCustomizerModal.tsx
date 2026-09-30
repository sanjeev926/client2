import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Check, 
  RotateCcw, 
  Play, 
  ExternalLink,
  Upload,
  HardDrive,
  FileVideo,
  FileImage,
  Loader2,
  Trash2
} from 'lucide-react';
import { ReelMedia, studioReels } from '../data/media';
import { 
  saveDeviceMediaFile, 
  resolvePlayableUrl, 
  formatBytes,
  deleteDeviceMedia,
  isDeviceMediaKey 
} from '../utils/mediaStorage';
import { uploadMediaToServer } from '../utils/mediaUpload';

interface ReelsCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  reels: ReelMedia[];
  onSaveReels: (updatedReels: ReelMedia[]) => void;
  onResetReels: () => void;
  initialSelectedId?: string;
}

const DANCE_PRESETS: {
  name: string;
  categoryTag: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  badge: string;
}[] = [
  {
    name: 'Urban Street & Hip Hop',
    categoryTag: 'URBAN HIP HOP',
    title: 'Urban Grooves & Isolation Routine',
    description: 'High octane popping, locking and footwork synchronized to hard-hitting beats.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-in-a-dance-hall-39824-large.mp4',
    badge: 'Trending 🔥'
  },
  {
    name: 'Bollywood Commercial Fusion',
    categoryTag: 'BOLLYWOOD FUSION',
    title: 'Bollywood Hits Mega Choreography',
    description: 'Thumkas, energetic hook-steps, and cinematic stage expressions for all dance lovers.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-dancers-performing-a-choreography-42999-large.mp4',
    badge: 'Most Loved ❤️'
  },
  {
    name: 'Kids Superstars Showcase',
    categoryTag: 'KIDS BATCH',
    title: 'Junior Champs Stage Debut',
    description: 'Energetic young dancers shining on stage with rhythm training and cheerful confidence.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-dancer-spinning-gracefully-on-the-dance-floor-41604-large.mp4',
    badge: 'Super Champs'
  },
  {
    name: 'Grand Wedding Sangeet',
    categoryTag: 'WEDDING SPECIAL',
    title: 'Royal Couple & Family Rehearsal',
    description: 'Custom customized routines for bride, groom and family members with smooth transitions.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-couple-dancing-at-their-wedding-party-43615-large.mp4',
    badge: 'Wedding Hit'
  },
  {
    name: 'Contemporary & Lyrical',
    categoryTag: 'CONTEMPORARY',
    title: 'Lyrical Soul Expressions',
    description: 'Fluid extensions, floor work, and emotional storytelling through mindful movements.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-ballerina-dancing-in-a-studio-41600-large.mp4',
    badge: 'Masterclass'
  }
];

export const ReelsCustomizerModal: React.FC<ReelsCustomizerModalProps> = ({
  isOpen,
  onClose,
  reels,
  onSaveReels,
  onResetReels,
  initialSelectedId
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialSelectedId || reels[0]?.id || 'reel-hiphop');
  const [draftReels, setDraftReels] = useState<ReelMedia[]>(reels);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Device upload state
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'video' | 'photo'; text: string } | null>(null);

  // Resolved active preview URLs for currently viewed reel
  const [previewThumbnail, setPreviewThumbnail] = useState<string>('');
  const [previewVideo, setPreviewVideo] = useState<string>('');

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  // Sync draft when opened or initial id changes
  useEffect(() => {
    setDraftReels(reels);
    if (initialSelectedId) {
      setSelectedId(initialSelectedId);
    }
  }, [isOpen, reels, initialSelectedId]);

  const currentReel = draftReels.find((r) => r.id === selectedId) || draftReels[0];

  // Resolve preview urls whenever currentReel changes
  useEffect(() => {
    let isMounted = true;
    if (currentReel) {
      resolvePlayableUrl(currentReel.thumbnailUrl).then((url) => {
        if (isMounted) setPreviewThumbnail(url);
      });
      if (currentReel.videoUrl) {
        resolvePlayableUrl(currentReel.videoUrl).then((url) => {
          if (isMounted) setPreviewVideo(url);
        });
      } else {
        setPreviewVideo('');
      }
    }
    return () => {
      isMounted = false;
    };
  }, [currentReel?.thumbnailUrl, currentReel?.videoUrl, currentReel?.id]);

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof ReelMedia, value: string) => {
    setDraftReels((prev) =>
      prev.map((r) => (r.id === currentReel.id ? { ...r, [field]: value } : r))
    );
  };

  // Direct Device Video Upload (From phone camera roll, gallery, desktop files)
  const handleDeviceVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setUploadMessage(null);

    try {
      const serverUrl = await uploadMediaToServer(file, `reel_vid_${currentReel.id}`);

      setDraftReels((prev) =>
        prev.map((r) =>
          r.id === currentReel.id
            ? {
                ...r,
                videoUrl: serverUrl,
              }
            : r
        )
      );

      setPreviewVideo(serverUrl);
      setUploadMessage({
        type: 'video',
        text: `✅ Video uploaded & synced to server: ${file.name} (${formatBytes(file.size)})`,
      });
    } catch (err) {
      console.error('Device video upload error:', err);
      setUploadMessage({
        type: 'video',
        text: '❌ Could not load video from device. Please try another format (MP4/WebM/MOV).',
      });
    } finally {
      setIsUploadingVideo(false);
      if (videoFileInputRef.current) {
        videoFileInputRef.current.value = '';
      }
    }
  };

  // Direct Device Photo / Thumbnail Upload
  const handleDevicePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setUploadMessage(null);

    try {
      const serverUrl = await uploadMediaToServer(file, `reel_thumb_${currentReel.id}`);

      setDraftReels((prev) =>
        prev.map((r) =>
          r.id === currentReel.id
            ? {
                ...r,
                thumbnailUrl: serverUrl,
              }
            : r
        )
      );

      setPreviewThumbnail(serverUrl);
      setUploadMessage({
        type: 'photo',
        text: `✅ Photo uploaded & synced to server: ${file.name} (${formatBytes(file.size)})`,
      });
    } catch (err) {
      console.error('Device photo upload error:', err);
      setUploadMessage({
        type: 'photo',
        text: '❌ Could not load image from device.',
      });
    } finally {
      setIsUploadingPhoto(false);
      if (photoFileInputRef.current) {
        photoFileInputRef.current.value = '';
      }
    }
  };

  const handleApplyPreset = (preset: typeof DANCE_PRESETS[0]) => {
    setDraftReels((prev) =>
      prev.map((r) =>
        r.id === currentReel.id
          ? {
              ...r,
              title: preset.title,
              categoryTag: preset.categoryTag,
              description: preset.description,
              thumbnailUrl: preset.thumbnailUrl,
              videoUrl: preset.videoUrl,
              badge: preset.badge,
            }
          : r
      )
    );
    setUploadMessage(null);
  };

  const handleSave = () => {
    onSaveReels(draftReels);
    // Auto-sync globally to server so other tabs, clients and phones see it immediately
    fetch('/api/reels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reels: draftReels, adminPin: 'ramy2026' }),
    }).catch((err) => {
      console.warn('Could not auto-sync reels to server:', err);
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetCurrent = async () => {
    const original = studioReels.find((r) => r.id === currentReel.id);
    if (original) {
      await deleteDeviceMedia(`reel_video_${currentReel.id}`);
      await deleteDeviceMedia(`reel_thumb_${currentReel.id}`);
      setDraftReels((prev) =>
        prev.map((r) => (r.id === currentReel.id ? { ...original } : r))
      );
      setUploadMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#12141A] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden Device File Inputs (Supporting all mobile, tablet and PC file pickers) */}
        <input
          ref={videoFileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
          className="hidden"
          onChange={handleDeviceVideoUpload}
        />
        <input
          ref={photoFileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg,image/*"
          className="hidden"
          onChange={handleDevicePhotoUpload}
        />

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0066FF]/20 border border-[#0066FF]/40 flex items-center justify-center text-[#0066FF]">
              <HardDrive className="w-5 h-5 text-[#0066FF]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-display tracking-tight text-white flex items-center gap-2">
                <span>Direct Device Media Manager</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Device Upload Ready
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Apne phone, tablet ya computer se direct photos aur videos upload karein.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close customizer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reel Selector Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2.5 border-b border-white/10 bg-black/30 shrink-0">
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
            Choose Reel Slot To Upload / Customize:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {draftReels.map((reel, idx) => (
              <button
                key={reel.id}
                type="button"
                onClick={() => setSelectedId(reel.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left flex flex-col gap-0.5 border cursor-pointer ${
                  selectedId === reel.id
                    ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] opacity-75 font-semibold">Slot #{idx + 1}</span>
                  {isDeviceMediaKey(reel.videoUrl) && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Has device uploaded video" />
                  )}
                </div>
                <span className="truncate">{reel.categoryTag || reel.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Status Message if file was uploaded */}
          {uploadMessage && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in ${
              uploadMessage.text.startsWith('✅')
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}>
              <span>{uploadMessage.text}</span>
              <button
                type="button"
                onClick={() => setUploadMessage(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Live Card Preview Box */}
          <div className="rounded-2xl border border-white/15 bg-black/50 p-4 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-48 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
              {previewVideo ? (
                <video
                  key={previewVideo}
                  src={previewVideo}
                  poster={previewThumbnail || currentReel.thumbnailUrl}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={previewThumbnail || currentReel.thumbnailUrl}
                  alt={currentReel.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              )}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold bg-[#0066FF] text-white px-2 py-0.5 rounded-full uppercase">
                  {currentReel.categoryTag || 'CATEGORY'}
                </span>
                {currentReel.badge && (
                  <span className="text-[10px] font-bold bg-white text-neutral-900 px-2 py-0.5 rounded-full shadow-xs">
                    {currentReel.badge}
                  </span>
                )}
                {isDeviceMediaKey(currentReel.videoUrl) && (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    📱 Device Video Active
                  </span>
                )}
              </div>
              <h4 className="text-base font-bold text-white truncate font-display">
                {currentReel.title}
              </h4>
              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {currentReel.description || 'No description entered yet.'}
              </p>
              {previewVideo && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold pt-1">
                  <span>✓ Video preview ready to test above</span>
                </p>
              )}
            </div>
          </div>

          {/* Direct Device Upload Action Card (PROMINENT) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0066FF]/15 via-white/[0.03] to-white/[0.01] border border-[#0066FF]/30 space-y-4">
            {/* 3GB FREE STORAGE & REELS RECOMMENDATION GUIDE */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-[#0066FF]/40 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-white">
                  <HardDrive className="w-4 h-4 text-[#0066FF]" />
                  <span>3.0 GB Free Cloud Storage Active</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Capacity: 150+ Dance Reels
                </span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                <p>
                  <span className="font-bold text-white">💡 Recommended Video Size: </span>
                  <span className="text-[#0066FF] font-extrabold">8 MB to 25 MB</span> (30–60 sec vertical reel, 1080x1920)
                </p>
                <p className="mt-0.5">
                  <span className="font-bold text-white">💡 Recommended Thumbnail: </span>
                  <span className="text-emerald-400 font-extrabold">200 KB to 1 MB</span> (JPG/WebP)
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Is size me reels users ke mobile pe instant swipe aur load hongi, aur aapka 3GB free space bilkul enough rahega!
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#0066FF]" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Direct Upload From This Device
                </h3>
              </div>
              <span className="text-[11px] text-neutral-400">
                Phone Gallery, Camera Roll ya Files
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Upload Video Button */}
              <button
                type="button"
                onClick={() => videoFileInputRef.current?.click()}
                disabled={isUploadingVideo}
                className="group p-3.5 rounded-xl bg-white/5 hover:bg-[#0066FF]/20 border border-white/10 hover:border-[#0066FF]/50 transition-all flex items-center gap-3 text-left cursor-pointer active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/30 flex items-center justify-center text-[#0066FF] group-hover:scale-105 transition-transform shrink-0">
                  {isUploadingVideo ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <FileVideo className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Upload Video File</span>
                    <span className="text-[9px] bg-[#0066FF] px-1.5 py-0.2 rounded text-white font-semibold">Direct</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">
                    MP4, MOV, WebM, 3GP from phone/PC
                  </p>
                </div>
              </button>

              {/* Upload Thumbnail Photo Button */}
              <button
                type="button"
                onClick={() => photoFileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="group p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center gap-3 text-left cursor-pointer active:scale-[0.98] shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                  {isUploadingPhoto ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <FileImage className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Upload Thumbnail Photo</span>
                    <span className="text-[9px] bg-emerald-600 px-1.5 py-0.5 rounded text-white font-bold">Thumbnail</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 truncate">
                    Phone gallery ya camera se thumbnail photo set karein
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Dance Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>Or Choose Curated Preset:</span>
              </label>
              <button
                type="button"
                onClick={handleResetCurrent}
                className="text-[11px] font-semibold text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Slot to Original</span>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {DANCE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer"
                >
                  ⚡ {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields for Title, Tags & URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Title */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Reel Title
              </label>
              <input
                type="text"
                value={currentReel.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g. Hip Hop Choreography Routine"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#0066FF] text-sm"
              />
            </div>

            {/* Category Tag */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Category / Style Tag
              </label>
              <input
                type="text"
                value={currentReel.categoryTag}
                onChange={(e) => handleFieldChange('categoryTag', e.target.value)}
                placeholder="e.g. ADVANCE / HIP HOP"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#0066FF] text-sm"
              />
            </div>

            {/* Badge */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                value={currentReel.badge || ''}
                onChange={(e) => handleFieldChange('badge', e.target.value)}
                placeholder="e.g. Featured Reel, Trending 🔥"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#0066FF] text-sm"
              />
            </div>

            {/* Video Source URL or Key */}
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>Video Source URL / Status</span>
                </label>
                {isDeviceMediaKey(currentReel.videoUrl) && (
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    Stored locally in browser database
                  </span>
                )}
              </div>
              <input
                type="text"
                value={currentReel.videoUrl || ''}
                onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                placeholder="https://...mp4 ya direct video URL ya upar Upload karein"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#0066FF] text-xs font-mono"
              />
            </div>

            {/* Thumbnail URL or Key */}
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Thumbnail Photo (Device Photo ya Image URL)</span>
                </label>
                {isDeviceMediaKey(currentReel.thumbnailUrl) && (
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Active Thumbnail Photo Set
                  </span>
                )}
              </div>
              <input
                type="text"
                value={currentReel.thumbnailUrl}
                onChange={(e) => handleFieldChange('thumbnailUrl', e.target.value)}
                placeholder="Device se thumbnail photo upload karein ya image URL dalein"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-400 text-xs font-mono"
              />
            </div>

            {/* Description */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Description / Caption
              </label>
              <textarea
                rows={2}
                value={currentReel.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Routine details, student achievements..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-[#0066FF] text-sm resize-none"
              />
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onResetReels}
            className="text-xs font-bold text-neutral-400 hover:text-white px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Reels to Original</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-xs font-extrabold text-white transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                  <span>Saved &amp; Updated!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
