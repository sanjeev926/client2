import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Sliders, Maximize2, Plus, Edit3 } from 'lucide-react';
import {
  GalleryPhoto,
  GALLERY_CATEGORIES,
  loadGalleryPhotos,
  saveGalleryPhotos,
  resetGalleryPhotos
} from '../data/galleryData';
import { GalleryLightboxModal } from './GalleryLightboxModal';
import { GalleryAdminModal } from './GalleryAdminModal';
import { resolvePlayableUrl, isDeviceMediaKey } from '../utils/mediaStorage';
import { useAdmin } from '../context/AdminContext';

export const GallerySection: React.FC = () => {
  const { isAdmin } = useAdmin();
  const [photos, setPhotos] = useState<GalleryPhoto[]>(loadGalleryPhotos);
  const [resolvedPhotos, setResolvedPhotos] = useState<GalleryPhoto[]>(photos);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | undefined>(undefined);

  // Sync from live server API on mount
  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPhotos(data);
          saveGalleryPhotos(data);
        }
      })
      .catch(() => {});
  }, []);

  // Resolve IndexedDB local blob URLs if uploaded from device
  useEffect(() => {
    let isMounted = true;
    const resolveImages = async () => {
      const resolved = await Promise.all(
        photos.map(async (photo) => {
          let imageUrl = photo.imageUrl;
          if (isDeviceMediaKey(imageUrl)) {
            const resolvedImg = await resolvePlayableUrl(imageUrl);
            if (resolvedImg) imageUrl = resolvedImg;
          }
          return { ...photo, imageUrl };
        })
      );
      if (isMounted) {
        setResolvedPhotos(resolved);
      }
    };
    resolveImages();
    return () => {
      isMounted = false;
    };
  }, [photos]);

  const filteredPhotos =
    activeCategory === 'all'
      ? resolvedPhotos
      : resolvedPhotos.filter((p) => p.category === activeCategory);

  const handleOpenPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < filteredPhotos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handleSavePhotos = (updated: GalleryPhoto[]) => {
    setPhotos(updated);
    saveGalleryPhotos(updated);
  };

  const handleResetPhotos = () => {
    const defaults = resetGalleryPhotos();
    setPhotos(defaults);
  };

  const handleOpenAdmin = (photoId?: string) => {
    setEditingPhotoId(photoId);
    setIsAdminModalOpen(true);
  };

  return (
    <section id="gallery" className="relative bg-white text-neutral-950 py-16 sm:py-20 md:py-24 overflow-hidden border-t border-neutral-200/80">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0066FF] text-xs font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>STUDIO PHOTO GALLERY</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-neutral-950 uppercase">
              STUDIO &amp; STAGE GALLERY
            </h2>
          </div>

          {/* Admin Management Button (visible only when logged in as admin) */}
          {isAdmin && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleOpenAdmin()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                title="Manage Gallery Photos"
              >
                <Sliders className="w-3.5 h-3.5 text-white" />
                <span>Manage Photos</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Categories Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {GALLERY_CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? resolvedPhotos.length
                : resolvedPhotos.filter((p) => p.category === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/25 scale-[1.02]'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-950 border border-neutral-200/90 shadow-xs'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                  isActive ? 'bg-black/20 text-white' : 'bg-white text-neutral-700 border border-neutral-200'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredPhotos.map((photo, index) => {
            return (
              <div
                key={photo.id}
                onClick={() => handleOpenPhoto(index)}
                className="group relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/90 hover:border-neutral-400 transition-all duration-300 shadow-xs hover:shadow-xl cursor-pointer flex flex-col justify-end p-4 sm:p-5 select-none"
              >
                {/* Background Image */}
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] group-hover:brightness-100 group-hover:scale-105 transition-all duration-500 ease-out"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-40 group-hover:opacity-70 transition-opacity" />

                {/* Top Badge & Zoom Icon */}
                <div className="relative z-10 flex items-center justify-between mb-auto">
                  <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full bg-white/95 text-[#0066FF] shadow-xs">
                    {photo.categoryLabel}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Admin Quick Edit Button */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAdmin(photo.id);
                        }}
                        className="p-1.5 rounded-full bg-black/70 hover:bg-[#0066FF] text-white transition-colors cursor-pointer border border-white/20 shadow-xs"
                        title="Edit this photo"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}

                    <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/90 group-hover:text-white group-hover:bg-[#0066FF] transition-all shadow-xs">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal */}
      <GalleryLightboxModal
        photo={selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null}
        onClose={handleCloseLightbox}
        onPrev={handlePrevPhoto}
        onNext={handleNextPhoto}
        hasPrev={selectedPhotoIndex !== null && selectedPhotoIndex > 0}
        hasNext={selectedPhotoIndex !== null && selectedPhotoIndex < filteredPhotos.length - 1}
      />

      {/* Admin Photo Manager Modal */}
      <GalleryAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        photos={photos}
        onSave={handleSavePhotos}
        onReset={handleResetPhotos}
        editingPhotoId={editingPhotoId}
      />
    </section>
  );
};
