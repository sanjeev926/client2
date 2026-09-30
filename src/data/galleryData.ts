export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  category: 'studio' | 'stage' | 'workshops' | 'kids';
  categoryLabel: string;
  imageUrl: string;
  aspectRatio?: 'tall' | 'wide' | 'square';
  date?: string;
}

export const MAX_GRID_PHOTOS = 9;
export const MAX_PHOTOS_PER_CATEGORY = 6;

export const INITIAL_GALLERY_PHOTOS: GalleryPhoto[] = [
  // --- STUDIO LIFE (Max 6) ---
  {
    id: 'photo-studio-1',
    title: 'Master Ramy Studio Portrait',
    caption: 'Official artistic portrait of founder & master choreographer Ramy at Ranchi studio hall.',
    category: 'studio',
    categoryLabel: 'Studio Life',
    imageUrl: '/ramy/ramy-portrait.jpg',
    aspectRatio: 'tall',
    date: 'Studio Master'
  },
  {
    id: 'photo-studio-2',
    title: 'Bollywood & Expressions Masterclass',
    caption: 'Graceful theatrical expressions, energetic beats, and traditional mudras practice.',
    category: 'studio',
    categoryLabel: 'Studio Life',
    imageUrl: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'tall',
    date: 'Ladies Batch'
  },
  {
    id: 'photo-studio-3',
    title: 'Acrobatics & Aerial Balance Routine',
    caption: 'Core flexibility, strength conditioning, and gymnastics precision routines.',
    category: 'studio',
    categoryLabel: 'Studio Life',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    date: 'Acro Conditioning'
  },
  {
    id: 'photo-studio-4',
    title: 'Contemporary Floorwork & Flow',
    caption: 'Fluid contemporary weight shifts and expressive floor extensions.',
    category: 'studio',
    categoryLabel: 'Studio Life',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    date: 'Evening Batch'
  },

  // --- STAGE & TV (Max 6) ---
  {
    id: 'photo-stage-1',
    title: 'India’s Got Talent Stage Performance',
    caption: 'National TV spotlight showcasing synchronized acrobatics and urban lyrical flow.',
    category: 'stage',
    categoryLabel: 'Stage & TV',
    imageUrl: '/ramy/ramy-igt.jpg',
    aspectRatio: 'wide',
    date: 'National TV'
  },
  {
    id: 'photo-stage-2',
    title: 'Dance Reality Show TV Spotlight',
    caption: 'High-voltage theatrical performance that received standing ovations from celebrity judges.',
    category: 'stage',
    categoryLabel: 'Stage & TV',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'wide',
    date: 'Reality TV'
  },
  {
    id: 'photo-stage-3',
    title: 'Grand Finale Showcase',
    caption: 'Synchronized crew battle routine under dynamic stage lighting.',
    category: 'stage',
    categoryLabel: 'Stage & TV',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'wide',
    date: 'Annual Fest'
  },
  {
    id: 'photo-stage-4',
    title: 'Celebrity Judges Standing Ovation',
    caption: 'Winning performance applauded by Bollywood legends on national television.',
    category: 'stage',
    categoryLabel: 'Stage & TV',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'tall',
    date: 'TV Award'
  },

  // --- WORKSHOPS & EVENTS (Max 6) ---
  {
    id: 'photo-workshop-1',
    title: 'Intensive Choreography Workshop',
    caption: 'Masterclass covering footwork, isolations, musicality, and street freestyle.',
    category: 'workshops',
    categoryLabel: 'Workshops & Events',
    imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'wide',
    date: 'Summer Camp'
  },
  {
    id: 'photo-workshop-2',
    title: 'Wedding Sangeet Flashmob Rehearsal',
    caption: 'Customized family dance routines and royal sangeet stage preparations.',
    category: 'workshops',
    categoryLabel: 'Workshops & Events',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'tall',
    date: 'Wedding Sangeet'
  },
  {
    id: 'photo-workshop-3',
    title: 'Hip-Hop Foundation Masterclass',
    caption: 'Grooves, body bounce, and rhythmic synchronization intensive workshop.',
    category: 'workshops',
    categoryLabel: 'Workshops & Events',
    imageUrl: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'wide',
    date: 'Weekend Bootcamp'
  },
  {
    id: 'photo-workshop-4',
    title: 'Corporate Celebration Flashmob',
    caption: 'High-energy team building dance routine and corporate gala performance.',
    category: 'workshops',
    categoryLabel: 'Workshops & Events',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    date: 'Corporate Gala'
  },

  // --- KIDS & JUNIORS (Max 6) ---
  {
    id: 'photo-kids-1',
    title: 'Little Champs Hip-Hop Cypher',
    caption: 'Foundational rhythm training and confidence building in junior weekend batch.',
    category: 'kids',
    categoryLabel: 'Kids & Juniors',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    date: 'Junior Batch'
  },
  {
    id: 'photo-kids-2',
    title: 'Youth Urban Freestyle Showcase',
    caption: 'Teens breaking, popping, and locking in evening high-energy crew battles.',
    category: 'kids',
    categoryLabel: 'Kids & Juniors',
    imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'square',
    date: 'Crew Cypher'
  },
  {
    id: 'photo-kids-3',
    title: 'Junior Acrobatics & Cartwheels',
    caption: 'Safe flexibility, balance, and gymnastic tumble drills for ages 4-12.',
    category: 'kids',
    categoryLabel: 'Kids & Juniors',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'wide',
    date: 'Little Ninjas'
  },
  {
    id: 'photo-kids-4',
    title: 'Kids Annual Day Stage Rehearsal',
    caption: 'Synchronized steps and joyful performances for parents and audiences.',
    category: 'kids',
    categoryLabel: 'Kids & Juniors',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    aspectRatio: 'wide',
    date: 'Annual Showcase'
  }
];

export const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Photos' },
  { id: 'studio', label: 'Studio Life' },
  { id: 'stage', label: 'Stage & TV' },
  { id: 'workshops', label: 'Workshops & Events' },
  { id: 'kids', label: 'Kids & Juniors' }
] as const;

export type GalleryCategoryId = 'studio' | 'stage' | 'workshops' | 'kids';

const STORAGE_KEY = 'ramys_studio_gallery_photos_v2';

export const loadGalleryPhotos = (): GalleryPhoto[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading gallery photos:', err);
  }
  return INITIAL_GALLERY_PHOTOS;
};

export const saveGalleryPhotos = (photos: GalleryPhoto[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (err) {
    console.error('Error saving gallery photos:', err);
  }
};

export const resetGalleryPhotos = (): GalleryPhoto[] => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error resetting gallery photos:', err);
  }
  return INITIAL_GALLERY_PHOTOS;
};
