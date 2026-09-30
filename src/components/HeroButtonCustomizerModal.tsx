import React, { useState } from 'react';
import {
  X,
  Check,
  RotateCcw,
  Sliders,
  Play,
  MessageCircle,
  Sparkles,
  Calendar,
  Phone,
  Flame,
  ArrowRight,
  ArrowDown,
  Award,
  Video,
  MapPin,
  ExternalLink,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  Palette,
  MousePointerClick,
} from 'lucide-react';

export type ButtonActionType =
  | 'scroll_reels'
  | 'scroll_categories'
  | 'scroll_achievements'
  | 'scroll_location'
  | 'open_booking'
  | 'whatsapp'
  | 'call'
  | 'custom_url';

export type ButtonIconType =
  | 'play'
  | 'message-circle'
  | 'sparkles'
  | 'calendar'
  | 'phone'
  | 'flame'
  | 'arrow-right'
  | 'arrow-down'
  | 'award'
  | 'video'
  | 'map-pin'
  | 'none';

export type ButtonColorTheme =
  | 'glass'
  | 'blue'
  | 'emerald'
  | 'orange'
  | 'purple'
  | 'amber'
  | 'dark';

export interface SingleButtonConfig {
  id: string;
  label: string;
  actionType: ButtonActionType;
  customUrl?: string;
  iconName: ButtonIconType;
  colorTheme: ButtonColorTheme;
  isVisible: boolean;
}

export interface HeroButtonsConfig {
  primaryBtn: SingleButtonConfig;
  secondaryBtn: SingleButtonConfig;
  updatedAt?: string;
}

export const defaultHeroButtonsConfig: HeroButtonsConfig = {
  primaryBtn: {
    id: 'primary',
    label: 'CATEGORY',
    actionType: 'scroll_categories',
    iconName: 'arrow-down',
    colorTheme: 'blue',
    isVisible: true,
  },
  secondaryBtn: {
    id: 'secondary',
    label: 'WATCH SHOWCASE',
    actionType: 'scroll_reels',
    iconName: 'play',
    colorTheme: 'glass',
    isVisible: true,
  },
};

export const PRESET_OPTIONS: {
  id: string;
  name: string;
  description: string;
  config: Partial<SingleButtonConfig>;
  badge?: string;
}[] = [
  {
    id: 'preset-showcase',
    name: 'Watch Showcase',
    description: 'Scrolls to viral studio dance reels with Play icon',
    config: {
      label: 'WATCH SHOWCASE',
      actionType: 'scroll_reels',
      iconName: 'play',
      colorTheme: 'glass',
      isVisible: true,
    },
    badge: 'Popular',
  },
  {
    id: 'preset-whatsapp',
    name: 'WhatsApp Inquiry',
    description: 'Direct 1-tap WhatsApp chat with studio choreographer',
    config: {
      label: 'WHATSAPP CHAT',
      actionType: 'whatsapp',
      iconName: 'message-circle',
      colorTheme: 'emerald',
      isVisible: true,
    },
    badge: 'High Conversion',
  },
  {
    id: 'preset-trial',
    name: 'Book Trial Class',
    description: 'Opens interactive free trial class demo registration popup',
    config: {
      label: 'BOOK TRIAL CLASS',
      actionType: 'open_booking',
      iconName: 'sparkles',
      colorTheme: 'glass',
      isVisible: true,
    },
  },
  {
    id: 'preset-batches',
    name: 'Batch Timings & Fees',
    description: 'Scrolls down to dance categories & batch schedules',
    config: {
      label: 'BATCH TIMINGS',
      actionType: 'scroll_categories',
      iconName: 'calendar',
      colorTheme: 'orange',
      isVisible: true,
    },
  },
  {
    id: 'preset-call',
    name: 'Direct Phone Call',
    description: 'Direct call to studio (+91 83401 58178)',
    config: {
      label: 'CALL STUDIO',
      actionType: 'call',
      iconName: 'phone',
      colorTheme: 'blue',
      isVisible: true,
    },
  },
  {
    id: 'preset-achievements',
    name: 'Studio Achievements',
    description: 'Scrolls to national dance trophies & celebrity awards',
    config: {
      label: 'OUR ACHIEVEMENTS',
      actionType: 'scroll_achievements',
      iconName: 'award',
      colorTheme: 'amber',
      isVisible: true,
    },
  },
  {
    id: 'preset-location',
    name: 'Studio Location',
    description: 'Scrolls down to address, map directions & hours',
    config: {
      label: 'VISIT STUDIO',
      actionType: 'scroll_location',
      iconName: 'map-pin',
      colorTheme: 'glass',
      isVisible: true,
    },
  },
];

export const COLOR_THEMES: {
  id: ButtonColorTheme;
  name: string;
  classes: string;
  previewClass: string;
}[] = [
  {
    id: 'glass',
    name: 'Glass Translucent',
    classes: 'bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 backdrop-blur-md shadow-lg',
    previewClass: 'bg-white/20 border border-white/40 text-white',
  },
  {
    id: 'blue',
    name: 'Electric Blue',
    classes: 'bg-[#0066FF] hover:bg-[#0052cc] text-white shadow-lg shadow-blue-500/30',
    previewClass: 'bg-[#0066FF] text-white',
  },
  {
    id: 'emerald',
    name: 'WhatsApp Emerald',
    classes: 'bg-[#25D366] hover:bg-[#1ebd5a] text-black font-extrabold shadow-lg shadow-emerald-500/30',
    previewClass: 'bg-[#25D366] text-black',
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    classes: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30',
    previewClass: 'bg-orange-500 text-white',
  },
  {
    id: 'purple',
    name: 'Neon Violet',
    classes: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30',
    previewClass: 'bg-purple-600 text-white',
  },
  {
    id: 'amber',
    name: 'Gold Amber',
    classes: 'bg-amber-400 hover:bg-amber-500 text-neutral-950 font-extrabold shadow-lg shadow-amber-400/30',
    previewClass: 'bg-amber-400 text-black',
  },
  {
    id: 'dark',
    name: 'Dark Stealth',
    classes: 'bg-neutral-900/80 hover:bg-neutral-900 text-white border border-neutral-700 backdrop-blur-md shadow-lg',
    previewClass: 'bg-neutral-800 border border-neutral-600 text-white',
  },
];

interface HeroButtonCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: HeroButtonsConfig;
  onChange: (newConfig: HeroButtonsConfig) => void;
  onReset: () => void;
  initialTab?: 'secondary' | 'primary';
}

export const renderButtonIcon = (iconName: ButtonIconType, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'play':
      return <Play className={`${className} fill-current translate-x-0.5`} />;
    case 'message-circle':
      return <MessageCircle className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    case 'phone':
      return <Phone className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'arrow-right':
      return <ArrowRight className={className} />;
    case 'arrow-down':
      return <ArrowDown className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'video':
      return <Video className={className} />;
    case 'map-pin':
      return <MapPin className={className} />;
    case 'none':
    default:
      return null;
  }
};

export const HeroButtonCustomizerModal: React.FC<HeroButtonCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
  onReset,
  initialTab = 'secondary',
}) => {
  const [activeTab, setActiveTab] = useState<'secondary' | 'primary'>(initialTab);
  const [adminPin, setAdminPin] = useState('');
  const [isSavingLive, setIsSavingLive] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const currentBtn = activeTab === 'secondary' ? config.secondaryBtn : config.primaryBtn;

  const updateCurrentButton = (updates: Partial<SingleButtonConfig>) => {
    if (activeTab === 'secondary') {
      onChange({
        ...config,
        secondaryBtn: {
          ...config.secondaryBtn,
          ...updates,
        },
      });
    } else {
      onChange({
        ...config,
        primaryBtn: {
          ...config.primaryBtn,
          ...updates,
        },
      });
    }
  };

  const handleApplyPreset = (presetConfig: Partial<SingleButtonConfig>) => {
    updateCurrentButton(presetConfig);
  };

  const handleSaveLive = async () => {
    setErrorMessage('');
    setIsSavingLive(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/hero-buttons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          adminPin: adminPin || 'ramy2026',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update live buttons');
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating live website');
    } finally {
      setIsSavingLive(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0066FF]/20 text-[#0066FF] flex items-center justify-center border border-[#0066FF]/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Customize Hero Action Buttons
              </h2>
              <p className="text-xs text-neutral-400">
                Button text, icons, actions, and color styling adjust karein
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-850 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-neutral-800 bg-neutral-900/90">
          <button
            onClick={() => setActiveTab('secondary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'secondary'
                ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MousePointerClick className="w-4 h-4 text-[#0066FF]" />
            <span>Action 2 (Current: {config.secondaryBtn.label})</span>
          </button>
          <button
            onClick={() => setActiveTab('primary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'primary'
                ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>Action 1 (Category / Primary)</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Live Preview Box */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
              <span className="font-semibold flex items-center gap-1.5 text-neutral-300">
                <Eye className="w-3.5 h-3.5 text-[#0066FF]" /> Live Preview
              </span>
              <span className="text-[11px] text-neutral-500">How it appears on Hero</span>
            </div>
            <div className="p-6 rounded-lg bg-gradient-to-b from-[#181a20] to-[#101216] border border-white/5 flex flex-wrap items-center justify-center gap-3">
              {config.primaryBtn.isVisible && (
                <div
                  className={`group flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-extrabold cursor-pointer transition-all ${
                    COLOR_THEMES.find((t) => t.id === config.primaryBtn.colorTheme)?.classes ||
                    COLOR_THEMES[1].classes
                  }`}
                >
                  <span>{config.primaryBtn.label}</span>
                  {renderButtonIcon(config.primaryBtn.iconName, 'w-3.5 h-3.5')}
                </div>
              )}
              {config.secondaryBtn.isVisible && (
                <div
                  className={`group flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                    COLOR_THEMES.find((t) => t.id === config.secondaryBtn.colorTheme)?.classes ||
                    COLOR_THEMES[0].classes
                  }`}
                >
                  {config.secondaryBtn.iconName !== 'none' && (
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      {renderButtonIcon(config.secondaryBtn.iconName, 'w-2.5 h-2.5')}
                    </span>
                  )}
                  <span>{config.secondaryBtn.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Presets (1-Click) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Quick 1-Click Presets
              </label>
              <span className="text-[11px] text-neutral-500">Pick any pre-configured button</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_OPTIONS.map((preset) => {
                const isSelected =
                  currentBtn.label === preset.config.label &&
                  currentBtn.actionType === preset.config.actionType;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.config)}
                    className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0066FF]/15 border-[#0066FF] shadow-sm'
                        : 'bg-neutral-850/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        {renderButtonIcon(preset.config.iconName || 'play', 'w-3.5 h-3.5 text-[#0066FF]')}
                        {preset.name}
                      </span>
                      {preset.badge && (
                        <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                          {preset.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-400 line-clamp-1">
                      {preset.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Button Text & Visibility */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Button Text / Label
              </label>
              <input
                type="text"
                value={currentBtn.label}
                onChange={(e) => updateCurrentButton({ label: e.target.value })}
                placeholder="e.g. WATCH SHOWCASE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#0066FF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Visibility
              </label>
              <button
                type="button"
                onClick={() => updateCurrentButton({ isVisible: !currentBtn.isVisible })}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  currentBtn.isVisible
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}
              >
                {currentBtn.isVisible ? '✓ Visible on Page' : 'Hidden'}
              </button>
            </div>
          </div>

          {/* Action Destination */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Click Action / Destination
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'scroll_reels', label: 'Dance Reels / Showcase' },
                { id: 'scroll_categories', label: 'Styles / Categories' },
                { id: 'open_booking', label: 'Open Booking Form' },
                { id: 'whatsapp', label: 'WhatsApp Chat' },
                { id: 'call', label: 'Direct Phone Call' },
                { id: 'scroll_achievements', label: 'Achievements Section' },
                { id: 'scroll_location', label: 'Studio Location / Map' },
                { id: 'custom_url', label: 'Custom Web Link' },
              ].map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => updateCurrentButton({ actionType: act.id as ButtonActionType })}
                  className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                    currentBtn.actionType === act.id
                      ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-sm'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>
            {currentBtn.actionType === 'custom_url' && (
              <div className="mt-2.5">
                <input
                  type="url"
                  value={currentBtn.customUrl || ''}
                  onChange={(e) => updateCurrentButton({ customUrl: e.target.value })}
                  placeholder="https://example.com/dance-pass"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs"
                />
              </div>
            )}
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Select Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  'play',
                  'message-circle',
                  'sparkles',
                  'calendar',
                  'phone',
                  'flame',
                  'arrow-right',
                  'arrow-down',
                  'award',
                  'video',
                  'map-pin',
                  'none',
                ] as ButtonIconType[]
              ).map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => updateCurrentButton({ iconName: icon })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    currentBtn.iconName === icon
                      ? 'bg-neutral-800 border-[#0066FF] text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {icon === 'none' ? (
                    <span>No Icon</span>
                  ) : (
                    <>
                      {renderButtonIcon(icon, 'w-3.5 h-3.5 text-[#0066FF]')}
                      <span className="capitalize">{icon.replace('-', ' ')}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color & Theme */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Color Theme & Styling
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {COLOR_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => updateCurrentButton({ colorTheme: theme.id })}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    currentBtn.colorTheme === theme.id
                      ? 'border-[#0066FF] bg-neutral-850 text-white'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${theme.previewClass}`} />
                  <span className="truncate">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Admin PIN for Global Deployment */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs">
            <div className="flex items-center gap-2 text-white font-bold mb-1">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Publish to Live Website for All Visitors</span>
            </div>
            <p className="text-neutral-400 mb-3">
              Default admin passcode is <code className="text-amber-400 font-mono">ramy2026</code>. Instant changes will be saved globally.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Admin Passcode (ramy2026)"
                className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#0066FF]"
              />
              <button
                type="button"
                onClick={handleSaveLive}
                disabled={isSavingLive}
                className="px-4 py-2 rounded-lg bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isSavingLive ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Publish Live Website</span>
                  </>
                )}
              </button>
            </div>
            {saveSuccess && (
              <p className="mt-2 text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Buttons updated globally on live website!
              </p>
            )}
            {errorMessage && (
              <p className="mt-2 text-red-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errorMessage}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800 bg-neutral-950/80">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-sm"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
