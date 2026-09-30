import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { GalleryPhoto } from '../data/galleryData';

interface GalleryLightboxModalProps {
  photo: GalleryPhoto | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const GalleryLightboxModal: React.FC<GalleryLightboxModalProps> = ({
  photo,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-xl animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer border border-white/10"
        title="Close photo (Esc)"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-3 sm:left-6 z-50 p-3 rounded-full bg-black/60 hover:bg-[#0066FF] text-white/80 hover:text-white border border-white/15 transition-all cursor-pointer shadow-xl backdrop-blur-md"
          title="Previous photo (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-3 sm:right-6 z-50 p-3 rounded-full bg-black/60 hover:bg-[#0066FF] text-white/80 hover:text-white border border-white/15 transition-all cursor-pointer shadow-xl backdrop-blur-md"
          title="Next photo (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Content Container */}
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/80 shadow-2xl max-h-[75vh] flex items-center justify-center">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-auto h-auto max-h-[75vh] max-w-full object-contain rounded-2xl"
          />
        </div>

        {/* Caption & Meta footer */}
        <div className="mt-4 text-center max-w-2xl px-4 space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#0066FF]/20 text-[#3d8dff] border border-[#0066FF]/30">
              {photo.categoryLabel}
            </span>
            {photo.date && (
              <span className="text-[11px] text-white/50 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{photo.date}</span>
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white font-display">
            {photo.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {photo.caption}
          </p>
        </div>
      </div>
    </div>
  );
};
