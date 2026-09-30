import React, { useState, useEffect } from 'react';
import { Award, Sliders, Edit3 } from 'lucide-react';
import { CategoryItem, loadCategories, saveCategories, resetCategories } from '../data/categoriesData';
import { CategoriesCustomizerModal } from './CategoriesCustomizerModal';
import { resolvePlayableUrl, isDeviceMediaKey } from '../utils/mediaStorage';
import { useAdmin } from '../context/AdminContext';

interface CategoriesSectionProps {
  onSelectCategory: (categoryTitle: string) => void;
  categories?: CategoryItem[];
  onUpdateCategories?: (updated: CategoryItem[]) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onSelectCategory,
  categories: propCategories,
  onUpdateCategories
}) => {
  const { isAdmin } = useAdmin();
  const [internalCategories, setInternalCategories] = useState<CategoryItem[]>(() => {
    return propCategories || loadCategories();
  });

  const [resolvedCategories, setResolvedCategories] = useState<CategoryItem[]>(internalCategories);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | undefined>(undefined);

  // Sync internal state if propCategories changes
  useEffect(() => {
    if (propCategories && propCategories.length > 0) {
      setInternalCategories(propCategories);
    }
  }, [propCategories]);

  // Resolve IndexedDB device media URLs for uploaded photos if needed
  useEffect(() => {
    let isMounted = true;
    const resolveImages = async () => {
      const resolved = await Promise.all(
        internalCategories.map(async (cat) => {
          let imageUrl = cat.imageUrl;
          if (isDeviceMediaKey(imageUrl)) {
            const resolvedImg = await resolvePlayableUrl(imageUrl);
            if (resolvedImg) imageUrl = resolvedImg;
          }
          return { ...cat, imageUrl };
        })
      );
      if (isMounted) {
        setResolvedCategories(resolved);
      }
    };
    resolveImages();
    return () => {
      isMounted = false;
    };
  }, [internalCategories]);

  const handleSaveCategories = (updated: CategoryItem[]) => {
    setInternalCategories(updated);
    saveCategories(updated);
    if (onUpdateCategories) {
      onUpdateCategories(updated);
    }
  };

  const handleResetCategories = () => {
    const def = resetCategories();
    setInternalCategories(def);
    if (onUpdateCategories) {
      onUpdateCategories(def);
    }
  };

  const handleOpenCustomizer = (catId?: string) => {
    setEditingCategoryId(catId);
    setIsCustomizerOpen(true);
  };

  return (
    <section id="categories" className="relative bg-white text-neutral-900 overflow-hidden">
      {/* Sleek Dark Media & TV Press Recognition Ribbon */}
      <div className="w-full bg-neutral-950 text-neutral-300 py-3.5 px-4 sm:px-6 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          <div className="flex items-center gap-2 text-white font-bold">
            <Award className="w-4 h-4 text-[#0066FF]" />
            <span>FEATURED &amp; RECOGNIZED ON</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-neutral-300 font-display font-extrabold text-xs sm:text-sm tracking-widest">
            <span className="hover:text-white transition-colors">DANCE INDIA DANCE</span>
            <span className="text-neutral-700 hidden sm:inline">•</span>
            <span className="hover:text-white transition-colors">INDIA&apos;S GOT TALENT</span>
            <span className="text-neutral-700 hidden sm:inline">•</span>
            <span className="hover:text-white transition-colors">SO YOU THINK YOU CAN DANCE</span>
            <span className="text-neutral-700 hidden md:inline">•</span>
            <span className="hover:text-white transition-colors hidden md:inline">ZEE TV</span>
          </div>
        </div>
      </div>

      {/* Main Categories Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16">
        
        {/* Section Header: Title & Description */}
        <div className="relative mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-950 font-display tracking-tight">
            Select Your Program
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-xl mx-auto">
            Choose your preferred dance style and book your demo session with Master Ramy and team.
          </p>

          {isAdmin && (
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => handleOpenCustomizer()}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-600 hover:text-neutral-900 text-xs font-medium transition-all cursor-pointer"
                title="Customize categories, photos, timings and pricing"
              >
                <Sliders className="w-3 h-3 text-[#0066FF]" />
                <span>Customize</span>
              </button>
            </div>
          )}
        </div>

        {/* 3x3 Grid Form (9 Categories arranged in 3 columns x 3 rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {resolvedCategories.map((category: CategoryItem) => {
            return (
              <div
                key={category.id}
                onClick={() => onSelectCategory(category.title)}
                className="group cursor-pointer flex flex-col select-none relative"
              >
                {/* Card Container (Clean, rounded-2xl, high contrast photography) */}
                <div className="relative w-full aspect-[16/10.5] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/90 shadow-xs transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-md group-hover:border-neutral-300">
                  <img
                    src={category.imageUrl}
                    alt={category.title}
                    className="w-full h-full object-cover object-center transition-all duration-300 group-hover:brightness-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Quick Edit Card Button (Visible only to Admin on hover) */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCustomizer(category.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-black/75 hover:bg-[#0066FF] text-white opacity-0 group-hover:opacity-100 transition-all shadow-md backdrop-blur-md cursor-pointer z-10"
                      title={`Edit ${category.title} photo, timings & pricing`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Single Bold Text Label Centered Directly Below Each Card */}
                <h3 className="mt-3 text-center font-bold text-neutral-950 text-sm sm:text-base md:text-lg tracking-tight group-hover:text-[#0066FF] transition-colors">
                  {category.title}
                </h3>
              </div>
            );
          })}
        </div>

      </div>

      {/* Categories, Timings & Pricing Customizer Modal */}
      <CategoriesCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        categories={internalCategories}
        onSave={handleSaveCategories}
        onReset={handleResetCategories}
        initialCategoryId={editingCategoryId}
      />
    </section>
  );
};
