import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Globe,
  Check,
  RotateCcw,
  Sparkles,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { GalleryPhoto, INITIAL_GALLERY_PHOTOS } from '../data/galleryData';
import { saveDeviceMediaFile } from '../utils/mediaStorage';
import { uploadMediaToServer } from '../utils/mediaUpload';

interface GalleryAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: GalleryPhoto[];
  onSave: (photos: GalleryPhoto[]) => void;
  onReset: () => void;
  editingPhotoId?: string;
}

const GALLERY_PRESETS = [
  {
    title: 'Master Ramy Studio Portrait',
    url: '/ramy/ramy-portrait.jpg',
    category: 'studio' as const,
    categoryLabel: 'Studio Life',
    caption: 'Official studio portrait of founder and choreographer Master Ramy.'
  },
  {
    title: 'India’s Got Talent Stage Spotlight',
    url: '/ramy/ramy-igt.jpg',
    category: 'stage' as const,
    categoryLabel: 'Stage & TV',
    caption: 'Dynamic acrobatic performance on national television.'
  },
  {
    title: 'Junior Hip Hop Cypher',
    url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    category: 'kids' as const,
    categoryLabel: 'Kids & Juniors',
    caption: 'Kids dance session focusing on musicality and footwork.'
  },
  {
    title: 'Street Dance Intensive Workshop',
    url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
    category: 'workshops' as const,
    categoryLabel: 'Workshops & Events',
    caption: 'Energy-packed weekend workshop at Metro Market studio.'
  },
  {
    title: 'Bollywood Expressions & Grace',
    url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1200&q=80',
    category: 'studio' as const,
    categoryLabel: 'Studio Life',
    caption: 'Classical hand mudras and energetic Bollywood choreography.'
  },
  {
    title: 'Acro & Flexibility Training',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    category: 'studio' as const,
    categoryLabel: 'Studio Life',
    caption: 'Gymnastic jumps, cartwheels, and backflips training.'
  },
  {
    title: 'Royal Wedding Sangeet Practice',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    category: 'workshops' as const,
    categoryLabel: 'Workshops & Events',
    caption: 'Family sangeet dance routine rehearsal at studio.'
  },
  {
    title: 'Urban Hip Hop Crew Battle',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    category: 'stage' as const,
    categoryLabel: 'Stage & TV',
    caption: 'Stage cypher and crew performance with synchronised beats.'
  }
];

export const GalleryAdminModal: React.FC<GalleryAdminModalProps> = ({
  isOpen,
  onClose,
  photos,
  onSave,
  onReset,
  editingPhotoId
}) => {
  const [draftPhotos, setDraftPhotos] = useState<GalleryPhoto[]>(photos);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>(
    editingPhotoId || photos[0]?.id || 'photo-1'
  );
  const [adminPin, setAdminPin] = useState('ramy2026');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setDraftPhotos(photos);
      if (editingPhotoId) {
        setSelectedPhotoId(editingPhotoId);
      }
      setPublishStatus(null);
    }
  }, [isOpen, editingPhotoId, photos]);

  if (!isOpen) return null;

  const currentPhoto =
    draftPhotos.find((p) => p.id === selectedPhotoId) || draftPhotos[0];

  const updateCurrentPhoto = (updater: (photo: GalleryPhoto) => GalleryPhoto) => {
    if (!currentPhoto) return;
    setDraftPhotos((prev) =>
      prev.map((p) => (p.id === currentPhoto.id ? updater(p) : p))
    );
  };

  const handleAddNewPhoto = () => {
    const newId = `photo-${Date.now()}`;
    const newPhoto: GalleryPhoto = {
      id: newId,
      title: 'New Studio Dance Photo',
      caption: 'Studio practice and choreography moment.',
      category: 'studio',
      categoryLabel: 'Studio Life',
      imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: 'wide',
      date: 'Latest'
    };
    setDraftPhotos((prev) => [newPhoto, ...prev]);
    setSelectedPhotoId(newId);
  };

  const handleDeletePhoto = (id: string) => {
    if (draftPhotos.length <= 1) {
      alert('Gallery me kam se kam 1 photo honi chahiye.');
      return;
    }
    const filtered = draftPhotos.filter((p) => p.id !== id);
    setDraftPhotos(filtered);
    setSelectedPhotoId(filtered[0]?.id || '');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentPhoto) return;

    setIsUploading(true);
    try {
      const serverUrl = await uploadMediaToServer(file, `gallery_${currentPhoto.id}`);
      updateCurrentPhoto((p) => ({ ...p, imageUrl: serverUrl }));
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublishToLive = async () => {
    setIsPublishing(true);
    setPublishStatus(null);
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photos: draftPhotos, adminPin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPublishStatus({
          type: 'success',
          message: 'Gallery photos live website par successfully publish ho gaye!'
        });
        onSave(draftPhotos);
      } else {
        setPublishStatus({
          type: 'error',
          message: data.error || 'Server error: Update nahi ho saka.'
        });
      }
    } catch {
      setPublishStatus({
        type: 'error',
        message: 'Network issue. Server se connect nahi ho saka.'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleApply = () => {
    onSave(draftPhotos);
    // Auto-sync globally to server so other tabs, clients and phones see it immediately
    fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos: draftPhotos, adminPin: 'ramy2026' })
    }).catch((err) => {
      console.warn('Could not auto-sync gallery to server:', err);
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0f1117] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto text-white max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-white/[0.02] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0066FF]/20 flex items-center justify-center text-[#0066FF] border border-[#0066FF]/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Manage Studio Gallery Photos
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#0066FF]/20 text-[#388bff] border border-[#0066FF]/30">
                  {draftPhotos.length} Photos
                </span>
              </h2>
              <p className="text-xs text-white/60">
                Photo add karein, device se upload karein, category aur caption customize karein.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddNewPhoto}
              className="px-3 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photo</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thumbnail ribbon */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40 overflow-x-auto shrink-0 scrollbar-none flex items-center gap-2">
          {draftPhotos.map((p, idx) => {
            const isSelected = p.id === currentPhoto?.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPhotoId(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30 scale-[1.02]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <img
                  src={p.imageUrl}
                  alt=""
                  className="w-5 h-5 rounded-md object-cover"
                />
                <span>#{idx + 1} {p.title.slice(0, 16)}</span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        {currentPhoto && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
              {/* Photo Preview */}
              <div className="sm:col-span-5 space-y-3">
                <label className="text-xs font-semibold text-white/70 block">
                  Photo Preview
                </label>
                <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-white/20 bg-black/60 shadow-lg group">
                  <img
                    src={currentPhoto.imageUrl}
                    alt={currentPhoto.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                    <span className="text-[10px] font-bold text-[#0066FF] uppercase">
                      {currentPhoto.categoryLabel}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">
                      {currentPhoto.title}
                    </h4>
                  </div>
                </div>

                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-[#0066FF]" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Photo from Device / Phone'}</span>
                </button>

                {draftPhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(currentPhoto.id)}
                    className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-400 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete This Photo</span>
                  </button>
                )}
              </div>

              {/* Form Fields */}
              <div className="sm:col-span-7 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={currentPhoto.imageUrl}
                    onChange={(e) => updateCurrentPhoto((p) => ({ ...p, imageUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">
                    Photo Title
                  </label>
                  <input
                    type="text"
                    value={currentPhoto.title}
                    onChange={(e) => updateCurrentPhoto((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Master Ramy Studio Portrait"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1.5">
                      Category
                    </label>
                    <select
                      value={currentPhoto.category}
                      onChange={(e) => {
                        const cat = e.target.value as any;
                        const labelMap: Record<string, string> = {
                          studio: 'Studio Life',
                          stage: 'Stage & TV',
                          workshops: 'Workshops & Events',
                          kids: 'Kids & Juniors'
                        };
                        updateCurrentPhoto((p) => ({
                          ...p,
                          category: cat,
                          categoryLabel: labelMap[cat] || 'Dance'
                        }));
                      }}
                      className="w-full bg-[#161822] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0066FF]"
                    >
                      <option value="studio">Studio Life</option>
                      <option value="stage">Stage &amp; TV</option>
                      <option value="workshops">Workshops &amp; Events</option>
                      <option value="kids">Kids &amp; Juniors</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1.5">
                      Date / Tag (Optional)
                    </label>
                    <input
                      type="text"
                      value={currentPhoto.date || ''}
                      onChange={(e) => updateCurrentPhoto((p) => ({ ...p, date: e.target.value }))}
                      placeholder="e.g. March 2026"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">
                    Caption / Description
                  </label>
                  <textarea
                    rows={2}
                    value={currentPhoto.caption}
                    onChange={(e) => updateCurrentPhoto((p) => ({ ...p, caption: e.target.value }))}
                    placeholder="Short description of the dance moment..."
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Photo Presets Grid */}
            <div className="pt-3 border-t border-white/10">
              <label className="text-xs font-semibold text-white/80 block mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D8F800]" />
                <span>Quick Photo Presets (Click to apply)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                {GALLERY_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      updateCurrentPhoto((p) => ({
                        ...p,
                        title: preset.title,
                        imageUrl: preset.url,
                        category: preset.category,
                        categoryLabel: preset.categoryLabel,
                        caption: preset.caption
                      }))
                    }
                    className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-[#0066FF] transition-all cursor-pointer text-left"
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/40 hover:bg-black/10 transition-colors flex items-end p-1">
                      <span className="text-[9px] font-bold text-white truncate w-full">
                        {preset.categoryLabel}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Sync Section */}
            <div className="p-4 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-[#0066FF]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Publish Gallery to Live Website
                  </span>
                </div>
                <span className="text-[10px] text-[#0066FF] font-mono bg-[#0066FF]/10 px-2 py-0.5 rounded border border-[#0066FF]/30">
                  POST /api/gallery
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Admin PIN (Default: ramy2026)"
                  className="w-full sm:w-64 bg-black/60 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                />
                <button
                  type="button"
                  onClick={handlePublishToLive}
                  disabled={isPublishing}
                  className="px-4 py-2 rounded-xl bg-[#0066FF] text-white font-bold text-xs hover:bg-[#0052cc] transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-[#0066FF]/30 disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {isPublishing ? 'Publishing...' : 'Publish to Live'}
                </button>
              </div>

              {publishStatus && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-medium ${
                    publishStatus.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {publishStatus.message}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-white/10 bg-white/[0.02] shrink-0">
          <button
            onClick={() => {
              onReset();
              setDraftPhotos(INITIAL_GALLERY_PHOTOS);
            }}
            className="flex items-center space-x-1.5 text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs transition-all flex items-center space-x-1.5 shadow-md shadow-[#0066FF]/20 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
