import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Calendar,
  Award,
  Video,
  Camera,
  MapPin,
  Send,
  Zap,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { studioInfo } from '../data/danceData';

interface ClientDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientDraftModal: React.FC<ClientDraftModalProps> = ({ isOpen, onClose }) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const liveUrl = currentOrigin && !currentOrigin.includes('ais-pre-')
    ? currentOrigin
    : "https://ais-dev-lovs2moqkhiarxkvz36xhh-846292938378.asia-southeast1.run.app";

  const clientDraftMessage = 
`🌟 *RAMY'S DANCE STUDIO - OFFICIAL WEBSITE & BOOKING PLATFORM*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Namaste! Humne aapke Ramy's Dance Studio ke liye ek modern, high-speed aur fully-featured website platform ready kar diya hai.

🌐 *Live Website Link:*
👉 ${liveUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ *KEY FEATURES INCLUDED IN THIS BUILD:*

1️⃣ *Interactive Demo Booking System*
• Students & parents can book trial classes (₹99) and appointments directly.
• Select Dance Style, Batch timing, and starting date.
• Clean in-app confirmation with lead capture (Phone: ${studioInfo.phoneDisplay}).
• Zero annoying forced redirects!

2️⃣ *9 Core Dance Programs & Schedule Engine*
• Kids Dance, Bollywood Ladies, Hip-Hop, Contemporary, Acrobatics & Gymnastics, Wedding Choreography, Classical Kathak, Zumba, Aerobics.
• Live batch slots, timing details, and fees clearly displayed.

3️⃣ *National Achievements & TV Showcase*
• Dance India Dance & India's Got Talent recognition.
• High-res stage photo lightbox viewer + direct YouTube showcase video integration.

4️⃣ *Studio Reels & Performance Bento Hub*
• Modern vertical reel cards for student dance videos.
• Direct connection to Instagram & YouTube channels.

5️⃣ *High-Definition Studio Photo Gallery*
• Clean, distraction-free visual grid with fullscreen high-res zoom lightbox.

6️⃣ *Studio Location & Helpline Lockup*
• 2nd Floor, Metro Market, Kutchery Road, Ranchi.
• 1-Click Google Maps direction, Direct Phone Call (${studioInfo.phoneDisplay}) & WhatsApp link.

7️⃣ *Built-in Admin CMS Panel*
• Studio owner can edit batch timings, fees, photos, videos and banner directly from phone (PIN: ramy2026).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 *Mobile & Tablet Optimized:*
Bilkul fast loading aur kisi bhi Android / iPhone screen par flawless experience.

Kripya link open karke check karein aur apna feedback dein! 🙏`;

  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(clientDraftMessage);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ramy's Dance Studio - Website Platform",
          text: "Check out the official website and booking platform for Ramy's Dance Studio!",
          url: liveUrl,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopyDraft();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0E0F14] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[92vh] overflow-y-auto space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-[#388bff] border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Client Share &amp; Project Draft</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Ramy's Dance Studio Platform Draft
          </h2>

          <p className="text-xs sm:text-sm text-slate-400">
            A complete feature summary ready to review or share directly with the client on WhatsApp or Email.
          </p>
        </div>

        {/* Live URL Card */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Live Website Link (Client URL)
            </span>
            <span className="block text-xs sm:text-sm font-mono text-[#388bff] truncate font-semibold">
              {liveUrl}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white transition-all shadow-xs"
              title="Open Live Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Key Features Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#0066FF]" />
            <span>Platform Features Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <Calendar className="w-4 h-4 text-[#0066FF]" />
                <span>Demo Booking System</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Seamless ₹99 trial booking with batch timing, date picker, student lead capture and no forced redirects.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <Award className="w-4 h-4 text-[#0066FF]" />
                <span>National TV Recognition</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Dance India Dance &amp; India's Got Talent showcase with fullscreen stage photo lightbox &amp; video link.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <Video className="w-4 h-4 text-[#0066FF]" />
                <span>Reels &amp; Bento Showcase</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Mobile-first vertical reel videos for Kids, Bollywood, and Wedding Choreography with bottom text lockup.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <Camera className="w-4 h-4 text-[#0066FF]" />
                <span>HD Visual Gallery</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Clean, distraction-free photo grid with instant high-resolution lightbox preview on click.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <MapPin className="w-4 h-4 text-[#0066FF]" />
                <span>Ranchi Studio Helpline</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Metro Market Kutchery Road address, 1-click Google Maps, and direct calls to <strong>{studioInfo.phoneDisplay}</strong>.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                <span>Live Admin CMS (PIN: ramy2026)</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Customize batch timings, fees, upload photos &amp; videos directly from any smartphone or laptop.
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp Ready Share Draft Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ready WhatsApp Message for Client</span>
            </span>

            <button
              onClick={handleCopyDraft}
              className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedText ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Draft Copied!' : 'Copy Message'}</span>
            </button>
          </div>

          <div className="bg-black/60 border border-white/10 rounded-2xl p-3.5 text-slate-300 font-mono text-[11px] sm:text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
            {clientDraftMessage}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopyDraft}
            className="w-full sm:flex-1 py-3 px-5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-95"
          >
            {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? 'Copied to Clipboard!' : 'Copy WhatsApp Draft for Client'}</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto py-3 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
