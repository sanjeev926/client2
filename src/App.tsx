import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PromoBanner } from './components/PromoBanner';
import { CategoriesSection } from './components/CategoriesSection';
import { AchievementsSection } from './components/AchievementsSection';
import { ReelsSection } from './components/ReelsSection';
import { GallerySection } from './components/GallerySection';
import { FooterSection } from './components/FooterSection';
import { BookDemoModal } from './components/BookDemoModal';
import { VideoModal } from './components/VideoModal';
import { CategoriesCustomizerModal } from './components/CategoriesCustomizerModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminFloatingBar } from './components/AdminFloatingBar';
import { ClientDraftModal } from './components/ClientDraftModal';
import { AdminProvider } from './context/AdminContext';
import { ReelMedia } from './data/media';
import {
  CategoryItem,
  loadCategories,
  saveCategories,
  resetCategories
} from './data/categoriesData';

function AppContent() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [clientDraftOpen, setClientDraftOpen] = useState(false);
  const [selectedCategoryForBooking, setSelectedCategoryForBooking] = useState('Kids Dance');
  const [activeReel, setActiveReel] = useState<ReelMedia | null>(null);

  // Categories state
  const [categories, setCategories] = useState<CategoryItem[]>(loadCategories);
  const [isCategoryCustomizerOpen, setIsCategoryCustomizerOpen] = useState(false);
  const [customizingCatId, setCustomizingCatId] = useState<string | undefined>(undefined);

  // Sync with live server on load
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          saveCategories(data);
        }
      })
      .catch((err) => {
        console.log('Using local categories cache', err);
      });
  }, []);

  const handleOpenBooking = (category?: string) => {
    if (category) {
      setSelectedCategoryForBooking(category);
    }
    setBookingModalOpen(true);
  };

  const handleSelectReel = (reel: ReelMedia) => {
    setActiveReel(reel);
  };

  const handleUpdateCategories = (updated: CategoryItem[]) => {
    setCategories(updated);
    saveCategories(updated);
  };

  const handleResetCategories = () => {
    const defaults = resetCategories();
    setCategories(defaults);
  };

  const handleOpenCategoryCustomizer = (catId?: string) => {
    setCustomizingCatId(catId);
    setIsCategoryCustomizerOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 selection:bg-[#0066FF] selection:text-white font-sans">
      {/* Fixed Navigation Bar */}
      <Navbar
        onOpenBooking={handleOpenBooking}
        onOpenClientDraft={() => setClientDraftOpen(true)}
      />

      {/* Main Sections */}
      <main>
        {/* Hero Section */}
        <Hero onOpenBooking={handleOpenBooking} />

        {/* Studio Official Photo Banner (Between Hero & Category Section) */}
        <PromoBanner onOpenBooking={handleOpenBooking} />

        {/* Categories Section - 3x3 Grid of 9 Categories */}
        <CategoriesSection
          onSelectCategory={handleOpenBooking}
          categories={categories}
          onUpdateCategories={handleUpdateCategories}
        />

        {/* Achievements Section */}
        <AchievementsSection />

        {/* Studio Reels & Showcase Bento Grid */}
        <ReelsSection onSelectReel={handleSelectReel} />

        {/* Studio Photo Gallery Section */}
        <GallerySection />
      </main>

      {/* Footer Section with Admin Login Link */}
      <FooterSection onOpenBooking={handleOpenBooking} />

      {/* Interactive Booking Demo Modal */}
      <BookDemoModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialCategory={selectedCategoryForBooking}
        categories={categories}
        onOpenCustomizer={handleOpenCategoryCustomizer}
      />

      {/* Video Reels Modal */}
      <VideoModal
        reel={activeReel}
        onClose={() => setActiveReel(null)}
      />

      {/* Categories, Timings & Pricing Customizer Modal */}
      <CategoriesCustomizerModal
        isOpen={isCategoryCustomizerOpen}
        onClose={() => setIsCategoryCustomizerOpen(false)}
        categories={categories}
        onSave={handleUpdateCategories}
        onReset={handleResetCategories}
        initialCategoryId={customizingCatId}
      />

      {/* Admin Login Modal (Triggered from Footer) */}
      <AdminLoginModal />

      {/* Admin Floating Shortcut Bar (Visible only when logged in as admin) */}
      <AdminFloatingBar
        onOpenCategoriesCustomizer={() => handleOpenCategoryCustomizer()}
      />

      {/* Client Project Features Draft Modal */}
      <ClientDraftModal
        isOpen={clientDraftOpen}
        onClose={() => setClientDraftOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
}
