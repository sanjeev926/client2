export interface BatchTiming {
  name: string;
  badge?: string; // e.g. "FULL"
  isFull?: boolean;
  schedule: string[];
}

export interface PackageTier {
  id: string;
  name: string;
  price: string;
  subtext?: string;
}

export interface ProgramConfig {
  id: string;
  displayName: string;
  type: 'demo' | 'appointment' | 'package';
  kicker: string;
  title: string;
  subtitle: string;
  batches?: BatchTiming[];
  packageTiers?: PackageTier[];
  feeLabel: string;
  feeValue: string;
  buttonText: string;
  showRazorpayNotice?: boolean;
}

export const programsConfig: Record<string, ProgramConfig> = {
  "kids-dance": {
    id: "kids-dance",
    displayName: "Kids Dance (Demo ₹99)",
    type: "demo",
    kicker: "INTRODUCTORY SESSION",
    title: "BOOK DEMO — ₹99",
    subtitle: "Zero risk trial session at our Kutchery Road studio. Reserve your spot below.",
    batches: [
      {
        name: "Batch 1",
        schedule: ["Thursday — 5:00 PM", "Saturday — 5:00 PM", "Sunday — 11:00 AM"]
      },
      {
        name: "Batch 2",
        schedule: ["Saturday — 5:00 PM", "Sunday — 5:00 PM", "Sunday — 9:00 AM"]
      },
      {
        name: "Batch 3",
        schedule: ["Tuesday — 4:30 PM", "Saturday — 4:00 PM", "Sunday — 11:00 AM"]
      }
    ],
    feeLabel: "Demo Registration Fee",
    feeValue: "₹99",
    buttonText: "CONFIRM & PROCEED (₹99)",
    showRazorpayNotice: true
  },

  "senior-beginner": {
    id: "senior-beginner",
    displayName: "Senior / Beginner",
    type: "appointment",
    kicker: "APPOINTMENT BOOKING",
    title: "BOOK APPOINTMENT",
    subtitle: "Tailored consultation for custom routines, packages, or private coaching.",
    batches: [
      {
        name: "Batch 1",
        schedule: ["Friday — 5:00 PM", "Saturday — 4:00 PM", "Sunday — 10:00 AM"]
      },
      {
        name: "Batch 2",
        schedule: ["Monday — 4:00 PM", "Tuesday — 4:00 PM", "Wednesday — 4:00 PM"]
      }
    ],
    feeLabel: "Service Consultation",
    feeValue: "Free Consultation",
    buttonText: "CONFIRM APPOINTMENT REQUEST",
    showRazorpayNotice: false
  },

  "advance": {
    id: "advance",
    displayName: "Advance Classes (Demo ₹99)",
    type: "demo",
    kicker: "INTRODUCTORY SESSION",
    title: "BOOK DEMO — ₹99",
    subtitle: "Zero risk trial session at our Kutchery Road studio. Reserve your spot below.",
    batches: [
      {
        name: "Batch 1",
        schedule: ["Monday — 5:00 PM", "Tuesday — 5:00 PM", "Wednesday — 5:00 PM"]
      },
      {
        name: "Batch 2",
        badge: "FULL",
        isFull: true,
        schedule: ["Waitlist / Next Intake Only"]
      }
    ],
    feeLabel: "Demo Registration Fee",
    feeValue: "₹99",
    buttonText: "CONFIRM & PROCEED (₹99)",
    showRazorpayNotice: true
  },

  "gymnastic": {
    id: "gymnastic",
    displayName: "Gymnastic (Demo ₹99)",
    type: "demo",
    kicker: "INTRODUCTORY SESSION",
    title: "BOOK DEMO — ₹99",
    subtitle: "Zero risk trial session at our Kutchery Road studio. Reserve your spot below.",
    batches: [
      {
        name: "Weekly Training",
        schedule: [
          "Wednesday — 5:00 PM",
          "Friday — 5:00 PM",
          "Saturday — 5:00 PM",
          "Sunday — 10:00 AM"
        ]
      }
    ],
    feeLabel: "Demo Registration Fee",
    feeValue: "₹99",
    buttonText: "CONFIRM & PROCEED (₹99)",
    showRazorpayNotice: true
  },

  "bollywood-ladies": {
    id: "bollywood-ladies",
    displayName: "Bollywood Ladies (Demo ₹99)",
    type: "demo",
    kicker: "INTRODUCTORY SESSION",
    title: "BOOK DEMO — ₹99",
    subtitle: "Zero risk trial session at our Kutchery Road studio. Reserve your spot below.",
    batches: [
      {
        name: "Morning Regular Batch",
        schedule: [
          "Tuesday — 11:00 AM",
          "Wednesday — 11:00 AM",
          "Thursday — 11:00 AM",
          "Friday — 11:00 AM"
        ]
      }
    ],
    feeLabel: "Demo Registration Fee",
    feeValue: "₹99",
    buttonText: "CONFIRM & PROCEED (₹99)",
    showRazorpayNotice: true
  },

  "private-class": {
    id: "private-class",
    displayName: "Private Classes",
    type: "appointment",
    kicker: "APPOINTMENT BOOKING",
    title: "BOOK APPOINTMENT",
    subtitle: "Tailored consultation for custom routines, packages, or private coaching.",
    batches: [
      {
        name: "Custom Session",
        schedule: ["Flexible Days & Hours — As per your schedule"]
      }
    ],
    feeLabel: "Service Consultation",
    feeValue: "Free Consultation",
    buttonText: "CONFIRM APPOINTMENT REQUEST",
    showRazorpayNotice: false
  },

  "home-service": {
    id: "home-service",
    displayName: "Home Service",
    type: "package",
    kicker: "APPOINTMENT BOOKING",
    title: "BOOK APPOINTMENT",
    subtitle: "Tailored consultation for custom routines, packages, or private coaching.",
    packageTiers: [
      {
        id: "home-8",
        name: "8 CLASSES",
        price: "₹5,999"
      },
      {
        id: "home-12",
        name: "12 CLASSES",
        price: "₹6,999"
      }
    ],
    feeLabel: "Service Consultation",
    feeValue: "Free Consultation",
    buttonText: "CONFIRM APPOINTMENT REQUEST",
    showRazorpayNotice: false
  },

  "job-person": {
    id: "job-person",
    displayName: "Job Person (Demo ₹99)",
    type: "demo",
    kicker: "INTRODUCTORY SESSION",
    title: "BOOK DEMO — ₹99",
    subtitle: "Zero risk trial session at our Kutchery Road studio. Reserve your spot below.",
    batches: [
      {
        name: "Evening Batch",
        schedule: ["Monday to Thursday — 7:00 PM - 8:00 PM"]
      }
    ],
    feeLabel: "Demo Registration Fee",
    feeValue: "₹99",
    buttonText: "CONFIRM & PROCEED (₹99)",
    showRazorpayNotice: true
  },

  "wedding-choreography": {
    id: "wedding-choreography",
    displayName: "Wedding Choreography",
    type: "package",
    kicker: "APPOINTMENT BOOKING",
    title: "BOOK APPOINTMENT",
    subtitle: "Tailored consultation for custom routines, packages, or private coaching.",
    packageTiers: [
      {
        id: "wedding-1",
        name: "1 CHOREOGRAPHY",
        price: "₹2,999"
      },
      {
        id: "wedding-2",
        name: "2 CHOREOGRAPHIES",
        price: "₹2,499"
      },
      {
        id: "wedding-5",
        name: "5 CHOREOGRAPHIES",
        price: "₹9,999"
      }
    ],
    feeLabel: "Service Consultation",
    feeValue: "Free Consultation",
    buttonText: "CONFIRM APPOINTMENT REQUEST",
    showRazorpayNotice: false
  }
};
