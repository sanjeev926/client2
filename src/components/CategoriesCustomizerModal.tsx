import React, { useState, useRef } from 'react';
import {
  X,
  Check,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  Clock,
  IndianRupee,
  Plus,
  Trash2,
  Upload,
  Globe,
  Key,
  Calendar,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { CategoryItem, DEFAULT_CATEGORIES } from '../data/categoriesData';
import { saveDeviceMediaFile } from '../utils/mediaStorage';
import { uploadMediaToServer } from '../utils/mediaUpload';

interface CategoriesCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  onSave: (updated: CategoryItem[]) => void;
  onReset: () => void;
  initialCategoryId?: string;
}

const DANCE_PHOTO_PRESETS = [
  {
    name: 'Kids Dance Studio',
    url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80',
    tag: 'Kids'
  },
  {
    name: 'Urban Hip Hop Street',
    url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1000&q=80',
    tag: 'Hip Hop'
  },
  {
    name: 'Bollywood & Expressions',
    url: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1000&q=80',
    tag: 'Bollywood'
  },
  {
    name: 'Gymnastics & Acro Balance',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    tag: 'Gymnastic'
  },
  {
    name: 'Beginner & Adult Movement',
    url: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=1000&q=80',
    tag: 'Adults'
  },
  {
    name: 'Private Mentorship & Solo',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
    tag: 'Private'
  },
  {
    name: 'In-Home Dance Session',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
    tag: 'Home'
  },
  {
    name: 'Evening Urban Choreography',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    tag: 'Job Person'
  },
  {
    name: 'Wedding & Sangeet Flashmob',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    tag: 'Wedding'
  },
  {
    name: 'Master Ramy Studio Portrait',
    url: '/ramy/ramy-portrait.jpg',
    tag: 'Ramy Studio'
  },
  {
    name: 'India’s Got Talent Stage',
    url: '/ramy/ramy-igt.jpg',
    tag: 'IGT Showcase'
  }
];

export const CategoriesCustomizerModal: React.FC<CategoriesCustomizerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSave,
  onReset,
  initialCategoryId
}) => {
  const [draftCategories, setDraftCategories] = useState<CategoryItem[]>(categories);
  const [selectedCatId, setSelectedCatId] = useState<string>(
    initialCategoryId || categories[0]?.id || 'kids-dance'
  );
  const [activeTab, setActiveTab] = useState<'photo' | 'timings' | 'pricing'>('photo');
  const [adminPin, setAdminPin] = useState('ramy2026');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync draft when opened or initialCategoryId changes
  React.useEffect(() => {
    if (isOpen) {
      setDraftCategories(categories);
      if (initialCategoryId) {
        setSelectedCatId(initialCategoryId);
      }
      setPublishStatus(null);
    }
  }, [isOpen, initialCategoryId, categories]);

  if (!isOpen) return null;

  const currentCategory =
    draftCategories.find((c) => c.id === selectedCatId) || draftCategories[0] || DEFAULT_CATEGORIES[0];

  const updateCurrentCategory = (updater: (cat: CategoryItem) => CategoryItem) => {
    setDraftCategories((prev) =>
      prev.map((cat) => (cat.id === currentCategory.id ? updater(cat) : cat))
    );
  };

  // Image Upload handler (Device Photo -> Direct Server Upload)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const serverUrl = await uploadMediaToServer(file, `cat_${currentCategory.id}`);
      updateCurrentCategory((cat) => ({ ...cat, imageUrl: serverUrl }));
    } catch (err) {
      console.error('Category photo upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Batch Timing handlers
  const handleAddBatch = () => {
    const newBatchId = `batch-${Date.now()}`;
    updateCurrentCategory((cat) => ({
      ...cat,
      batches: [
        ...cat.batches,
        {
          id: newBatchId,
          name: `Batch ${cat.batches.length + 1}`,
          days: 'Mon, Wed, Fri',
          schedules: ['Monday — 5:00 PM', 'Wednesday — 5:00 PM', 'Friday — 5:00 PM']
        }
      ]
    }));
  };

  const handleRemoveBatch = (batchIndex: number) => {
    updateCurrentCategory((cat) => ({
      ...cat,
      batches: cat.batches.filter((_, idx) => idx !== batchIndex)
    }));
  };

  const handleUpdateBatch = (
    batchIndex: number,
    field: string,
    value: any
  ) => {
    updateCurrentCategory((cat) => ({
      ...cat,
      batches: cat.batches.map((batch, idx) =>
        idx === batchIndex ? { ...batch, [field]: value } : batch
      )
    }));
  };

  const handleAddScheduleLine = (batchIndex: number) => {
    updateCurrentCategory((cat) => ({
      ...cat,
      batches: cat.batches.map((batch, idx) => {
        if (idx !== batchIndex) return batch;
        return {
          ...batch,
          schedules: [...batch.schedules, 'New Day — 5:00 PM']
        };
      })
    }));
  };

  const handleUpdateScheduleLine = (
    batchIndex: number,
    scheduleIndex: number,
    text: string
  ) => {
    updateCurrentCategory((cat) => ({
      ...cat,
      batches: cat.batches.map((batch, bIdx) => {
        if (bIdx !== batchIndex) return batch;
        const newSched = [...batch.schedules];
        newSched[scheduleIndex] = text;
        return { ...batch, schedules: newSched };
      })
    }));
  };

  const handleRemoveScheduleLine = (batchIndex: number, scheduleIndex: number) => {
    updateCurrentCategory((cat) => ({
      ...cat,
      batches: cat.batches.map((batch, bIdx) => {
        if (bIdx !== batchIndex) return batch;
        return {
          ...batch,
          schedules: batch.schedules.filter((_, sIdx) => sIdx !== scheduleIndex)
        };
      })
    }));
  };

  // Publish to Live Website
  const handlePublishToLive = async () => {
    setIsPublishing(true);
    setPublishStatus(null);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: draftCategories, adminPin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPublishStatus({
          type: 'success',
          message: 'Categories, Timings aur Pricing live website par successfully update ho gaya!'
        });
        onSave(draftCategories);
      } else {
        setPublishStatus({
          type: 'error',
          message: data.error || 'Server error: Update nahi ho saka.'
        });
      }
    } catch (err) {
      console.error(err);
      setPublishStatus({
        type: 'error',
        message: 'Network issue. Server se connect nahi ho saka.'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleApplyLocally = () => {
    onSave(draftCategories);
    // Auto-sync globally to server so other tabs, clients and phones see it immediately
    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories: draftCategories, adminPin: 'ramy2026' })
    }).catch((err) => {
      console.warn('Could not auto-sync categories to server:', err);
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
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
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Customize Categories &amp; Pricing
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#0066FF]/20 text-[#388bff] border border-[#0066FF]/30">
                  Photo • Timing • Price
                </span>
              </h2>
              <p className="text-xs text-white/60">
                Photo change karein, book demo ke timing aur days badlein, demo fee aur pricing customize karein.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Horizontal Selector Ribbon */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40 overflow-x-auto shrink-0 scrollbar-none flex items-center gap-2">
          {draftCategories.map((cat) => {
            const isSelected = cat.id === currentCategory.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30 scale-[1.02]'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <img
                  src={cat.imageUrl}
                  alt=""
                  className="w-5 h-5 rounded-md object-cover"
                />
                <span>{cat.title}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-white/60'
                }`}>
                  {cat.demoPrice}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-white/[0.01] px-5 sm:px-6 shrink-0">
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'photo'
                ? 'border-[#0066FF] text-white bg-[#0066FF]/10'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#0066FF]" />
            <span>1. Photo &amp; Card Details</span>
          </button>

          <button
            onClick={() => setActiveTab('timings')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'timings'
                ? 'border-[#0066FF] text-white bg-[#0066FF]/10'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-[#D8F800]" />
            <span>2. Batches, Timings &amp; Days</span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full text-white/70">
              {currentCategory.batches.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'pricing'
                ? 'border-[#0066FF] text-white bg-[#0066FF]/10'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            <span>3. Demo Price &amp; Fees</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">

          {/* TAB 1: Photo & Card Details */}
          {activeTab === 'photo' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Image Preview & Upload Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                {/* Photo Preview Box */}
                <div className="sm:col-span-5">
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">
                    Category Card Image Preview
                  </label>
                  <div className="relative aspect-[16/10.5] rounded-2xl overflow-hidden border border-white/20 bg-black/50 shadow-lg group">
                    <img
                      src={currentCategory.imageUrl}
                      alt={currentCategory.title}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066FF]">
                        {currentCategory.pillTag}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {currentCategory.title}
                      </h4>
                      <span className="text-xs font-bold text-emerald-400">
                        {currentCategory.demoPrice}
                      </span>
                    </div>
                  </div>

                  {/* Device Upload Button */}
                  <div className="mt-3">
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
                      <span>{isUploading ? 'Uploading Image...' : 'Upload Photo from Device / Phone'}</span>
                    </button>
                  </div>
                </div>

                {/* Details Form Inputs */}
                <div className="sm:col-span-7 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1.5">
                      Image URL (Direct link)
                    </label>
                    <input
                      type="url"
                      value={currentCategory.imageUrl}
                      onChange={(e) => updateCurrentCategory((cat) => ({ ...cat, imageUrl: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1.5">
                      Category Title
                    </label>
                    <input
                      type="text"
                      value={currentCategory.title}
                      onChange={(e) => updateCurrentCategory((cat) => ({ ...cat, title: e.target.value }))}
                      placeholder="e.g. Kids dance"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-white/70 block mb-1.5">
                        Level Label
                      </label>
                      <input
                        type="text"
                        value={currentCategory.levelLabel}
                        onChange={(e) => updateCurrentCategory((cat) => ({ ...cat, levelLabel: e.target.value }))}
                        placeholder="e.g. LEVEL 1"
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-white/70 block mb-1.5">
                        Pill Tag
                      </label>
                      <input
                        type="text"
                        value={currentCategory.pillTag}
                        onChange={(e) => updateCurrentCategory((cat) => ({ ...cat, pillTag: e.target.value }))}
                        placeholder="e.g. FOUNDATIONAL"
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1.5">
                      Short Description / Tagline
                    </label>
                    <input
                      type="text"
                      value={currentCategory.description}
                      onChange={(e) => updateCurrentCategory((cat) => ({ ...cat, description: e.target.value }))}
                      placeholder="e.g. Rhythm, Coordination & Confidence"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Presets Grid */}
              <div className="pt-3 border-t border-white/10">
                <label className="text-xs font-semibold text-white/80 block mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D8F800]" />
                  <span>Curated High-Res Dance Photo Presets (Click to apply)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {DANCE_PHOTO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateCurrentCategory((cat) => ({ ...cat, imageUrl: preset.url }))}
                      className="group relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 hover:border-[#0066FF] transition-all cursor-pointer text-left"
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/50 hover:bg-black/20 transition-colors flex items-end p-1.5">
                        <span className="text-[10px] font-bold text-white truncate w-full">
                          {preset.tag}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Demo Batches, Timings & Days */}
          {activeTab === 'timings' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-blue-950/20 border border-[#0066FF]/30 p-3.5 rounded-xl">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#0066FF]" />
                    Batches &amp; Timings for &quot;{currentCategory.title}&quot;
                  </h4>
                  <p className="text-[11px] text-white/70">
                    Yeh batches aur timing Book Demo modal mein select karne ke liye display hote hain.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBatch}
                  className="px-3 py-1.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#0052cc] transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Batch</span>
                </button>
              </div>

              {/* Batches List */}
              <div className="space-y-4">
                {currentCategory.batches.map((batch, bIdx) => (
                  <div
                    key={batch.id || bIdx}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5"
                  >
                    {/* Batch Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <span className="text-xs font-bold text-[#0066FF] bg-[#0066FF]/20 px-2 py-0.5 rounded-md">
                          #{bIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={batch.name}
                          onChange={(e) => handleUpdateBatch(bIdx, 'name', e.target.value)}
                          placeholder="e.g. Batch 1 / Morning Batch"
                          className="bg-white/5 border border-white/15 rounded-lg px-2.5 py-1 text-xs font-bold text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF] flex-1 max-w-xs"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        {/* FULL toggle */}
                        <label className="flex items-center gap-1.5 text-xs text-white/80 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!batch.isFull}
                            onChange={(e) => {
                              handleUpdateBatch(bIdx, 'isFull', e.target.checked);
                              handleUpdateBatch(bIdx, 'badge', e.target.checked ? 'FULL' : undefined);
                            }}
                            className="rounded accent-red-500 cursor-pointer"
                          />
                          <span className={batch.isFull ? 'text-red-400 font-bold' : ''}>
                            Mark as FULL
                          </span>
                        </label>

                        {/* Delete Batch button */}
                        {currentCategory.batches.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBatch(bIdx)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                            title="Delete this batch"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Days Summary Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-white/70 block mb-1">
                          Days Summary
                        </label>
                        <input
                          type="text"
                          value={batch.days || ''}
                          onChange={(e) => handleUpdateBatch(bIdx, 'days', e.target.value)}
                          placeholder="e.g. Thu, Sat, Sun"
                          className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-white/70 block mb-1">
                          Batch Price (Optional override)
                        </label>
                        <input
                          type="text"
                          value={batch.price || ''}
                          onChange={(e) => handleUpdateBatch(bIdx, 'price', e.target.value)}
                          placeholder="e.g. ₹500 or ₹6,000 (leave blank to use demo fee)"
                          className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                        />
                      </div>
                    </div>

                    {/* Timing Lines / Schedules */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-white/70">
                        <span>Timings &amp; Schedules (Visible in Book Demo options):</span>
                        <button
                          type="button"
                          onClick={() => handleAddScheduleLine(bIdx)}
                          className="text-[#0066FF] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Timing Line</span>
                        </button>
                      </div>

                      {batch.schedules.map((schedule, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={schedule}
                            onChange={(e) => handleUpdateScheduleLine(bIdx, sIdx, e.target.value)}
                            placeholder="e.g. Thursday — 5:00 PM"
                            className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                          />
                          {batch.schedules.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveScheduleLine(bIdx, sIdx)}
                              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                              title="Remove timing line"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Pricing & Fees */}
          {activeTab === 'pricing' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Pricing Configuration for &quot;{currentCategory.title}&quot;
                  </h4>
                  <p className="text-xs text-white/70">
                    Book Demo button, registration form aur category card par yahi price display hogi.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Demo / Trial Fee</span>
                  </label>
                  <input
                    type="text"
                    value={currentCategory.demoPrice}
                    onChange={(e) => updateCurrentCategory((cat) => ({ ...cat, demoPrice: e.target.value }))}
                    placeholder="e.g. ₹99 or ₹149 or ₹500 or Free"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-bold text-emerald-400 placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                  <p className="text-[11px] text-white/50 mt-1">
                    Demo booking form aur cards par yahi fee display hogi (e.g. ₹99).
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">
                    Fee Label
                  </label>
                  <input
                    type="text"
                    value={currentCategory.feeLabel}
                    onChange={(e) => updateCurrentCategory((cat) => ({ ...cat, feeLabel: e.target.value }))}
                    placeholder="e.g. Demo Registration Fee / Package Fee"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                  />
                  <p className="text-[11px] text-white/50 mt-1">
                    Booking summary box me fee ka label (e.g. Demo Registration Fee).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">
                    Monthly Fee / Regular Package
                  </label>
                  <input
                    type="text"
                    value={currentCategory.monthlyFee}
                    onChange={(e) => updateCurrentCategory((cat) => ({ ...cat, monthlyFee: e.target.value }))}
                    placeholder="e.g. ₹1,500 / month (12 sessions)"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">
                    Trial Badge Info
                  </label>
                  <input
                    type="text"
                    value={currentCategory.trialInfo || ''}
                    onChange={(e) => updateCurrentCategory((cat) => ({ ...cat, trialInfo: e.target.value }))}
                    placeholder="e.g. Trial Class Available"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Live Sync Server Section */}
          <div className="p-4 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[#0066FF]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Deployed Website Sync
                </span>
              </div>
              <span className="text-[10px] text-[#0066FF] font-mono bg-[#0066FF]/10 px-2 py-0.5 rounded border border-[#0066FF]/30">
                POST /api/categories
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Website deploy hone ke baad sabhi visitors ke liye live website par categories, timings aur pricing update karne ke liye Admin PIN enter karein aur &quot;Publish to Live Website&quot; dabayein.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <div className="relative flex-1">
                <Key className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Admin PIN (Default: ramy2026)"
                  className="w-full bg-black/60 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0066FF]"
                />
              </div>
              <button
                type="button"
                onClick={handlePublishToLive}
                disabled={isPublishing}
                className="px-4 py-2 rounded-xl bg-[#0066FF] text-white font-bold text-xs hover:bg-[#0052cc] transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-[#0066FF]/30 disabled:opacity-50 cursor-pointer"
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

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-t border-white/10 bg-white/[0.02] shrink-0">
          <button
            onClick={() => {
              onReset();
              setDraftCategories(DEFAULT_CATEGORIES);
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
              onClick={handleApplyLocally}
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
