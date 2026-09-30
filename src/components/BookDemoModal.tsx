import React, { useState, useEffect } from 'react';
import { X, Sparkles, Shield, CreditCard, Phone, CheckCircle2, Sliders, MessageCircle, Send } from 'lucide-react';
import { studioInfo } from '../data/danceData';
import { CategoryItem, loadCategories } from '../data/categoriesData';
import { useAdmin } from '../context/AdminContext';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  categories?: CategoryItem[];
  onOpenCustomizer?: (categoryId: string) => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({
  isOpen,
  onClose,
  initialCategory = "Kids Dance",
  categories: propCategories,
  onOpenCustomizer
}) => {
  const { isAdmin } = useAdmin();
  const activeCategories = propCategories && propCategories.length > 0
    ? propCategories
    : loadCategories();

  // Helper to find category from string
  const findCategory = (rawName?: string): CategoryItem => {
    if (!rawName) return activeCategories[0];
    const lower = rawName.trim().toLowerCase();

    // Exact title match
    const byTitle = activeCategories.find((c) => c.title.toLowerCase() === lower);
    if (byTitle) return byTitle;

    // Exact id match
    const byId = activeCategories.find((c) => c.id.toLowerCase() === lower);
    if (byId) return byId;

    // Partial keywords
    if (lower.includes('kid')) return activeCategories.find((c) => c.id === 'kids-dance') || activeCategories[0];
    if (lower.includes('senior') || lower.includes('beginner')) return activeCategories.find((c) => c.id === 'senior-beginner') || activeCategories[0];
    if (lower.includes('advance')) return activeCategories.find((c) => c.id === 'advance') || activeCategories[0];
    if (lower.includes('gym')) return activeCategories.find((c) => c.id === 'gymnastic') || activeCategories[0];
    if (lower.includes('bollywood') || lower.includes('ladies')) return activeCategories.find((c) => c.id === 'bollywood-ladies') || activeCategories[0];
    if (lower.includes('private')) return activeCategories.find((c) => c.id === 'private-class') || activeCategories[0];
    if (lower.includes('home')) return activeCategories.find((c) => c.id === 'home-service') || activeCategories[0];
    if (lower.includes('job')) return activeCategories.find((c) => c.id === 'job-person') || activeCategories[0];
    if (lower.includes('wedding') || lower.includes('weeding')) return activeCategories.find((c) => c.id === 'wedding-choreography') || activeCategories[0];

    return activeCategories[0];
  };

  const [selectedCatId, setSelectedCatId] = useState<string>(() => {
    return findCategory(initialCategory).id;
  });

  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');

  // Sync selected program when initialCategory changes or modal opens
  useEffect(() => {
    if (initialCategory && isOpen) {
      const cat = findCategory(initialCategory);
      setSelectedCatId(cat.id);
      setSelectedBatchIndex(0);
      setSubmitted(false);
      setErrorMessage('');
      setLastWhatsAppUrl('');
    }
  }, [initialCategory, isOpen]);

  if (!isOpen) return null;

  const currentCategory = activeCategories.find((c) => c.id === selectedCatId) || activeCategories[0];
  const currentBatches = currentCategory.batches && currentCategory.batches.length > 0
    ? currentCategory.batches
    : [
        {
          id: 'b1',
          name: 'Regular Batch',
          days: 'Thu, Sat, Sun',
          schedules: ['Thursday — 5:00 PM', 'Saturday — 5:00 PM']
        }
      ];

  const activeBatch = currentBatches[selectedBatchIndex] || currentBatches[0];
  const displayFee = activeBatch?.price || currentCategory.demoPrice;
  const isDemo = !['private-class', 'home-service', 'wedding-choreography'].includes(currentCategory.id);
  const actionTitle = isDemo ? 'BOOK DEMO' : 'BOOK APPOINTMENT';

  const handleSelectBatch = (index: number) => {
    const target = currentBatches[index];
    if (target?.isFull) {
      setErrorMessage(`${target.name} is currently FULL. Please select an available batch or contact the studio.`);
      return;
    }
    setErrorMessage('');
    setSelectedBatchIndex(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (activeBatch.isFull) {
      setErrorMessage(`${activeBatch.name} is currently FULL. Please select an open batch.`);
      return;
    }
    setErrorMessage('');

    // Neatly formatted message for Studio Admin at 9692451182
    const scheduleBulletList = activeBatch.schedules.map((s) => `  • ${s}`).join('\n');
    const chosenDate = date ? date : 'Earliest Available Batch';

    const formattedMessage =
`🔔 *NEW BOOKING RECEIVED - RAMY'S DANCE STUDIO*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *Booking Type:* ${isDemo ? 'Demo Class (Trial)' : 'Private Class / Appointment'}
💃 *Dance Program:* ${currentCategory.title}
🏷️ *Selected Batch:* ${activeBatch.name}${activeBatch.days ? ` (${activeBatch.days})` : ''}
🕒 *Schedule & Timings:*
${scheduleBulletList}

💵 *Registration Fee:* ${displayFee} (Pay at Studio / UPI)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *STUDENT DETAILS:*
• *Full Name:* ${name.trim()}
• *Mobile Number:* ${cleanPhone}
• *Preferred Starting Date:* ${chosenDate}
• *Studio Branch:* 2nd Floor, Metro Market, Kutchery Road, Ranchi
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ *Admin Action:* Please check batch slot availability and reply to confirm reservation.`;

    const whatsappUrl = `https://wa.me/${studioInfo.whatsappNumber}?text=${encodeURIComponent(formattedMessage)}`;
    setLastWhatsAppUrl(whatsappUrl);
    setSubmitted(true);

    // Safely open WhatsApp in a new tab
    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Handled by the direct button
    }

    // Save booking directly to server database without redirecting
    try {
      fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking: {
            name: name.trim(),
            phone: cleanPhone,
            program: currentCategory.title,
            batch: activeBatch.name,
            schedule: activeBatch.schedules,
            fee: displayFee,
            preferredDate: chosenDate,
            isDemo,
          }
        })
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[640px] bg-[#0E0F12] border border-[#272932] rounded-2xl md:rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1C1E24] hover:bg-[#2A2D36] text-white/80 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-5 sm:py-7 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white">Booking Details Ready!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Aapka slot <span className="text-[#0066FF] font-semibold">{currentCategory.title}</span> ({activeBatch.name}) ke liye taiyar hai. Niche diye gaye WhatsApp button se turant studio number <strong className="text-emerald-400 font-bold">9692451182</strong> par message send karein.
            </p>

            {/* Direct WhatsApp Call to Action Button */}
            {lastWhatsAppUrl && (
              <a
                href={lastWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1ebe5d] hover:from-[#20ba59] hover:to-[#17a54f] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-950/40 active:scale-95 cursor-pointer border border-emerald-300/40 relative overflow-hidden group"
              >
                <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                <span>📲 Open WhatsApp &amp; Send Message (9692451182)</span>
              </a>
            )}

            {/* Instant WhatsApp Auto-Reply Guarantee Notice */}
            <div className="p-3.5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Instant WhatsApp Auto-Confirmation Active</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Jaise hi aap WhatsApp par message send karenge, Ramy&apos;s Dance Studio ke official number se aapko turant <strong className="text-white">&ldquo;Thank You &amp; Demo Batch Confirmation&rdquo;</strong> message aapke WhatsApp par wapas receive hoga!
              </p>
            </div>

            <div className="bg-[#15161B] rounded-2xl p-4 text-left border border-white/10 space-y-2.5 text-xs text-slate-300 mt-3">
              <div className="flex justify-between">
                <span>Student Name:</span>
                <span className="font-semibold text-white">{name.trim()}</span>
              </div>
              <div className="flex justify-between">
                <span>Mobile Number:</span>
                <span className="font-semibold text-white">{phone.trim()}</span>
              </div>
              <div className="flex justify-between">
                <span>Dance Program:</span>
                <span className="font-semibold text-[#0066FF]">{currentCategory.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Selected Batch:</span>
                <span className="font-medium text-white">{activeBatch.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Registration Fee:</span>
                <span className="font-bold text-emerald-400">{displayFee} (Pay at Studio / UPI)</span>
              </div>
              <div className="flex justify-between">
                <span>Studio WhatsApp:</span>
                <span className="font-bold text-emerald-400">9692451182</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Done / Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header Lockup */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pr-8">
              <div>
                <div className="flex items-center gap-1.5 text-[#0066FF] text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{isDemo ? "INTRODUCTORY SESSION" : "PRIVATE APPOINTMENT"}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight flex items-baseline gap-2">
                  <span>{actionTitle} – {displayFee}</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {isDemo
                    ? "Zero risk trial session at our Kutchery Road studio. Reserve your spot below."
                    : "Personalized choreography & private coaching. Reserve your appointment below."}
                </p>
              </div>

              {/* Quick Customizer button in header (Admin only) */}
              {isAdmin && onOpenCustomizer && (
                <button
                  type="button"
                  onClick={() => onOpenCustomizer(currentCategory.id)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#0066FF] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-white/10"
                  title="Customize this category's timing and price"
                >
                  <Sliders className="w-3 h-3 text-[#0066FF] group-hover:text-white" />
                  <span>Customize Timing / Price</span>
                </button>
              )}
            </div>

            {/* 1. SELECT DANCE PROGRAM */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  1. SELECT DANCE PROGRAM
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {currentCategory.demoPrice}
                </span>
              </div>
              <div className="relative">
                <select
                  value={selectedCatId}
                  onChange={(e) => {
                    const newCatId = e.target.value;
                    setSelectedCatId(newCatId);
                    setSelectedBatchIndex(0);
                    setErrorMessage('');
                  }}
                  className="w-full bg-[#14161C] border border-[#2B2E39] focus:border-[#0066FF] rounded-xl px-4 py-3 text-sm text-white focus:outline-none appearance-none cursor-pointer transition-colors"
                >
                  {activeCategories.map((program) => (
                    <option key={program.id} value={program.id} className="bg-[#14161C] text-white">
                      {program.title} ({program.demoPrice})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            {/* 2. SELECT BATCH & TIMINGS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  2. SELECT BATCH &amp; TIMINGS
                </label>
                {isAdmin && onOpenCustomizer && (
                  <button
                    type="button"
                    onClick={() => onOpenCustomizer(currentCategory.id)}
                    className="text-[10px] text-[#0066FF] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Sliders className="w-2.5 h-2.5" />
                    <span>Change timings</span>
                  </button>
                )}
              </div>
              <div className={`grid gap-2.5 ${currentBatches.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                {currentBatches.map((batch, idx) => {
                  const isSelected = selectedBatchIndex === idx;
                  const isFull = batch.isFull;

                  return (
                    <div
                      key={batch.id || idx}
                      onClick={() => handleSelectBatch(idx)}
                      className={`rounded-xl p-3.5 transition-all text-xs border relative ${
                        isFull
                          ? 'border-red-900/60 bg-red-950/20 opacity-80 cursor-not-allowed'
                          : isSelected
                          ? 'border-[#0066FF] bg-blue-950/20 cursor-pointer shadow-sm'
                          : 'border-[#262832] bg-[#13151A] hover:border-slate-500 cursor-pointer'
                      }`}
                    >
                      <div className="font-bold text-white text-xs sm:text-sm mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span>{batch.name}</span>
                          {batch.days && (
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({batch.days})
                            </span>
                          )}
                        </span>
                        {isFull ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            FULL
                          </span>
                        ) : isSelected ? (
                          <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
                        ) : null}
                      </div>
                      <div className="space-y-1 text-slate-300">
                        {batch.schedules.map((schedule, sIdx) => (
                          <div key={sIdx} className="leading-tight text-[11px] sm:text-xs">
                            {schedule}
                          </div>
                        ))}
                      </div>
                      {batch.price && (
                        <div className="mt-2 pt-1 border-t border-white/5 text-[11px] font-bold text-emerald-400">
                          Fee: {batch.price}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. NAME & MOBILE INPUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  YOUR FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#14161C] border border-[#2B2E39] focus:border-[#0066FF] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  MOBILE NUMBER *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#14161C] border border-[#2B2E39] focus:border-[#0066FF] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* 4. DATE INPUT */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                PREFERRED {isDemo ? "DEMO" : "APPOINTMENT"} DATE / STARTING DAY (OPTIONAL)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#14161C] border border-[#2B2E39] focus:border-[#0066FF] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-400 text-xs font-semibold">{errorMessage}</p>
            )}

            {/* 5. FEE SUMMARY BOX */}
            <div className="bg-[#13151A] border border-[#262832] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm text-slate-300 font-medium block">
                    {currentCategory.feeLabel || 'Registration Fee'}
                  </span>
                  {currentCategory.monthlyFee && (
                    <span className="text-[11px] text-slate-400">
                      Regular: {currentCategory.monthlyFee}
                    </span>
                  )}
                </div>
                <span className="text-xl sm:text-2xl font-extrabold font-display text-white">
                  {displayFee}
                </span>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-start gap-2 text-[11px] text-slate-400">
                <Shield className="w-3.5 h-3.5 text-[#0066FF] shrink-0 mt-0.5" />
                <span>
                  Payment Architecture: Ready for Razorpay gateway integration (&apos;VITE_RAZORPAY_KEY_ID&apos;).
                </span>
              </div>
            </div>

            {/* 6. CONFIRM & PROCEED BUTTON */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#0066FF] to-[#0052cc] hover:from-[#0052cc] hover:to-[#003d99] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-transform active:scale-[0.99] shadow-lg shadow-blue-600/25 cursor-pointer border border-blue-400/30"
            >
              <Send className="w-4 h-4 text-white" />
              <span>DONE — {isDemo ? "BOOK DEMO" : "BOOK APPOINTMENT"} &amp; SEND ON WHATSAPP ({displayFee})</span>
            </button>

            {/* 7. PREFER CALLING FOOTER */}
            <div className="text-center pt-1">
              <a
                href={`tel:${studioInfo.phone}`}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>Prefer calling? {studioInfo.phoneDisplay}</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
