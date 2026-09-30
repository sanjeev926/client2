import React, { useState, useRef } from 'react';
import { X, Check, RotateCcw, Sliders, Image as ImageIcon, Sparkles, Globe, Key, Phone, Tag, Upload, Loader2, HardDrive } from 'lucide-react';
import { uploadMediaToServer } from '../utils/mediaUpload';

export interface PromoBannerConfig {
  badgeText: string;
  headline: string;
  subheadline: string;
  discountHighlight: string;
  spotsRemaining: number;
  bannerImageUrl?: string;
  useCustomImageOnly: boolean;
  ctaText: string;
  phoneWhatsapp: string;
  showUrgencyTicker: boolean;
  themeColor: string;
  updatedAt?: string;
}

export const defaultPromoBannerConfig: PromoBannerConfig = {
  badgeText: '🔥 LIMITED SEATS • ADMISSION OPEN 2026',
  headline: 'NEW BATCHES STARTING THIS WEEK',
  subheadline: 'Book your Free Demo Trial Class & Get up to 50% OFF on 3-Month & Annual Registrations!',
  discountHighlight: 'FLAT 50% OFF',
  spotsRemaining: 7,
  bannerImageUrl: '',
  useCustomImageOnly: false,
  ctaText: 'Book Free Demo Class',
  phoneWhatsapp: '+91 98765 43210',
  showUrgencyTicker: true,
  themeColor: '#D8F800',
};

interface BannerCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PromoBannerConfig;
  onSave: (newConfig: PromoBannerConfig) => void;
  onReset: () => void;
}

export const BannerCustomizerModal: React.FC<BannerCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onReset,
}) => {
  const [draft, setDraft] = useState<PromoBannerConfig>(config);
  const [adminPin, setAdminPin] = useState('ramy2026');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [publishStatus, setPublishStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleDeviceBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const serverUrl = await uploadMediaToServer(file, 'banner');
      setDraft((prev) => ({
        ...prev,
        bannerImageUrl: serverUrl,
        useCustomImageOnly: true,
      }));
    } catch (err) {
      console.error('Banner upload error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePublishToLive = async () => {
    setIsPublishing(true);
    setPublishStatus(null);
    try {
      const res = await fetch('/api/banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: draft, adminPin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPublishStatus({
          type: 'success',
          message: 'Banner live website par successfully update ho gaya hai!',
        });
        onSave(draft);
      } else {
        setPublishStatus({
          type: 'error',
          message: data.error || 'Server error: Update nahi ho paya.',
        });
      }
    } catch (err) {
      console.error(err);
      setPublishStatus({
        type: 'error',
        message: 'Network issue. Server se connect nahi ho saka.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleApplyLocally = () => {
    onSave(draft);
    // Auto-sync globally to server
    fetch('/api/banner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: draft, adminPin: 'ramy2026' }),
    }).catch((err) => {
      console.warn('Could not auto-sync banner to server:', err);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f1117] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D8F800]/15 flex items-center justify-center text-[#D8F800] border border-[#D8F800]/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Customize Promo Banner
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#D8F800]/20 text-[#D8F800] border border-[#D8F800]/30">
                  Live Sync
                </span>
              </h2>
              <p className="text-xs text-white/60">
                Hero aur Category ke bich banner ka text, offer ya custom image badlein
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto custom-scrollbar">
          
          {/* Badge & Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D8F800]" />
                Top Badge Tag
              </label>
              <input
                type="text"
                value={draft.badgeText}
                onChange={(e) => setDraft({ ...draft, badgeText: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D8F800] transition-colors"
                placeholder="e.g. 🔥 LIMITED SEATS • ADMISSION OPEN 2026"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#D8F800]" />
                Offer / Discount Pill
              </label>
              <input
                type="text"
                value={draft.discountHighlight}
                onChange={(e) => setDraft({ ...draft, discountHighlight: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D8F800] transition-colors"
                placeholder="e.g. FLAT 50% OFF"
              />
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1.5">
              Main Headline Text
            </label>
            <input
              type="text"
              value={draft.headline}
              onChange={(e) => setDraft({ ...draft, headline: e.target.value })}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white placeholder-white/40 focus:outline-none focus:border-[#D8F800] transition-colors"
              placeholder="e.g. NEW BATCHES STARTING THIS WEEK"
            />
          </div>

          {/* Subheadline */}
          <div>
            <label className="text-xs font-semibold text-white/70 block mb-1.5">
              Subheadline / Description
            </label>
            <textarea
              rows={2}
              value={draft.subheadline}
              onChange={(e) => setDraft({ ...draft, subheadline: e.target.value })}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D8F800] transition-colors resize-none"
              placeholder="e.g. Book your Free Demo Trial Class & Get up to 50% OFF on 3-Month & Annual Registrations!"
            />
          </div>

          {/* Custom Banner Image Option */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#D8F800]" />
                Custom Image Banner URL (Optional)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/60">Display image only:</span>
                <input
                  type="checkbox"
                  id="useCustomImg"
                  checked={draft.useCustomImageOnly}
                  onChange={(e) => setDraft({ ...draft, useCustomImageOnly: e.target.checked })}
                  className="rounded accent-[#D8F800] cursor-pointer"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={draft.bannerImageUrl || ''}
                onChange={(e) => setDraft({ ...draft, bannerImageUrl: e.target.value })}
                placeholder="https://... image URL (ya niche direct photo upload karein)"
                className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D8F800] transition-colors"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleDeviceBannerUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#D8F800]" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-[#D8F800]" />
                    <span>Upload from Device</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-white/50">
              Note: Agar aap custom image URL dalte hain, toh banner background mein ya full graphic banner ke roop mein display hoga.
            </p>

            {/* 3GB Free Storage & Banner Recommendation */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#D8F800]/10 to-transparent border border-[#D8F800]/30 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-[#D8F800]">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>3.0 GB Free Cloud Storage Active</span>
                </span>
                <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  Recommended: 200 KB - 1.5 MB
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                <span className="font-bold text-white">💡 Tip: </span>
                Banner photo ke liye <strong>200 KB se 1.5 MB</strong> ki wide photo choose karein taaki website speed superfast rahe.
              </p>
            </div>
          </div>

          {/* Contact & CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1.5">
                CTA Button Text
              </label>
              <input
                type="text"
                value={draft.ctaText}
                onChange={(e) => setDraft({ ...draft, ctaText: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D8F800] transition-colors"
                placeholder="Book Free Demo Class"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-white/70 block mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D8F800]" />
                WhatsApp / Call Number
              </label>
              <input
                type="text"
                value={draft.phoneWhatsapp}
                onChange={(e) => setDraft({ ...draft, phoneWhatsapp: e.target.value })}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#D8F800] transition-colors"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Spots Remaining Slider */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white/80">Remaining Demo Spots Ticker:</span>
              <span className="font-bold text-[#D8F800]">{draft.spotsRemaining} spots left</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={draft.spotsRemaining}
              onChange={(e) => setDraft({ ...draft, spotsRemaining: Number(e.target.value) })}
              className="w-full accent-[#D8F800] cursor-pointer"
            />
          </div>

          {/* Live Sync Server Section */}
          <div className="p-4 rounded-2xl bg-[#D8F800]/5 border border-[#D8F800]/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[#D8F800]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Deployed Website Sync
                </span>
              </div>
              <span className="text-[10px] text-[#D8F800] font-mono bg-[#D8F800]/10 px-2 py-0.5 rounded border border-[#D8F800]/30">
                POST /api/banner
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Website deploy hone ke baad sabhi visitors ke liye live website par banner update karne ke liye apna Admin PIN enter karein aur &quot;Publish to Live Website&quot; dabayein.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <div className="relative flex-1">
                <Key className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Admin PIN (Default: ramy2026)"
                  className="w-full bg-black/60 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D8F800]"
                />
              </div>
              <button
                type="button"
                onClick={handlePublishToLive}
                disabled={isPublishing}
                className="px-4 py-2 rounded-xl bg-[#D8F800] text-black font-bold text-xs hover:bg-[#c4e100] transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-[#D8F800]/20 disabled:opacity-50"
              >
                {isPublishing ? (
                  <span className="inline-block animate-spin mr-1">⌛</span>
                ) : (
                  <Globe className="w-3.5 h-3.5" />
                )}
                Publish to Live Website
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

        {/* Footer Buttons */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          <button
            onClick={() => {
              onReset();
              setDraft(defaultPromoBannerConfig);
            }}
            className="flex items-center space-x-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyLocally}
              className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 transition-all flex items-center space-x-1.5 shadow-md"
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
