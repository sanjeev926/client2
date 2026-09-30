export interface CategoryDetail {
  id: string;
  title: string;
  pillTag: string;
  levelLabel: string;
  tagline: string;
  ageGroup: string;
  duration: string;
  batchSize: string;
  demoFee: string;
  monthlyFee: string;
  imageUrl: string;
  description: string;
  highlights: string[];
  curriculum: { title: string; desc: string }[];
  batchTimings: { label: string; days: string; time: string }[];
  faqs: { question: string; answer: string }[];
}

export interface DanceCategory {
  id: string;
  pillTag: string;
  demoPrice?: string;
  levelLabel: string;
  title: string;
  description: string;
  trialInfo: string;
  ctaText: string;
  imageUrl: string;
  bgPosition?: string;
  details: CategoryDetail;
}

export const danceCategories: DanceCategory[] = [
  {
    id: "kids-dance",
    pillTag: "FOUNDATIONAL",
    title: "Kids dance",
    levelLabel: "LEVEL 1",
    description: "Rhythm, Coordination & Confidence",
    trialInfo: "Trial Class Available",
    ctaText: "Book Demo",
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80",
    details: {
      id: "kids-dance",
      title: "Kids Dance Academy",
      pillTag: "Ages 4 – 13 • Foundational",
      levelLabel: "Beginner to Intermediate",
      tagline: "Build Rhythm, Physical Agility, and Stage Confidence in a Fun, Encouraging Atmosphere",
      ageGroup: "4 to 13 Years Old",
      duration: "60 mins per session",
      batchSize: "10 – 12 Kids per batch",
      demoFee: "₹99 Only",
      monthlyFee: "₹1,500 / month (12 sessions)",
      imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
      description: "Our Kids Dance program is carefully structured to channel young energy into creativity, grace, and discipline. Guided by certified instructors with national TV and Bollywood experience, children learn foundational dance movements, musical counts, and stage expression while developing physical balance, motor skills, and rock-solid self-esteem.",
      highlights: [
        "Certified instructors experienced in child kinetics & safe stretching",
        "Fun-first curriculum blending Hip Hop, Freestyle & Bollywood grooves",
        "Stage showcase opportunities & official certificate of completion",
        "Spacious, air-conditioned studio with shock-absorbing wooden flooring",
        "Periodic parent open-house days to witness your child's progress"
      ],
      curriculum: [
        {
          title: "Musicality & Rhythm Counting",
          desc: "Training the ear to identify 8-count beats, tempo changes, and rhythm syncopation."
        },
        {
          title: "Foundational Grooves & Footwork",
          desc: "Mastering bounce, rock, slide, basic turns, and coordination drills."
        },
        {
          title: "Flexibility & Posture Conditioning",
          desc: "Fun stretching, spinal alignment, and core balance exercises for young bodies."
        },
        {
          title: "Expressive Choreography & Gestures",
          desc: "Learning trending age-appropriate songs with expressive facial storytelling."
        },
        {
          title: "Camera & Stage Confidence",
          desc: "Overcoming shyness, projecting energy to an audience, and smiling under studio lights."
        }
      ],
      batchTimings: [
        {
          label: "Weekday Evening Batch (Batch A)",
          days: "Tuesday, Thursday & Saturday",
          time: "4:00 PM – 5:00 PM"
        },
        {
          label: "Weekday Evening Batch (Batch B)",
          days: "Tuesday, Thursday & Saturday",
          time: "5:00 PM – 6:00 PM"
        },
        {
          label: "Weekend Morning Special",
          days: "Saturday & Sunday",
          time: "10:00 AM – 11:30 AM"
        }
      ],
      faqs: [
        {
          question: "Does my child need prior dance experience?",
          answer: "Not at all! Our Kids Dance batch is designed for total beginners. We start from ground zero with fun beat counting and playful movement games."
        },
        {
          question: "What should my child wear to class?",
          answer: "Comfortable athletic clothes (t-shirt, track pants or leggings) and clean sports shoes or dance sneakers."
        },
        {
          question: "Can parents watch the class?",
          answer: "Parents can observe the trial demo class from our waiting lobby. For regular classes, we host scheduled parent review sessions to maintain student focus."
        }
      ]
    }
  },
  {
    id: "senior-beginner",
    pillTag: "ALL AGES",
    title: "Senior/Beginner",
    levelLabel: "ZERO EXPERIENCE NEEDED",
    description: "Step-by-Step Fundamentals",
    trialInfo: "Custom Packages",
    ctaText: "Book Session",
    imageUrl: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=1000&q=80",
    details: {
      id: "senior-beginner",
      title: "Senior & Adult Beginner Dance",
      pillTag: "Ages 14 to 60+ • Zero Experience Needed",
      levelLabel: "Complete Beginner",
      tagline: "It's Never Too Late to Dance! Step-by-Step Fundamentals in a Welcoming, Zero-Judgment Zone",
      ageGroup: "14 Years to Seniors (No Upper Limit)",
      duration: "60 mins per session",
      batchSize: "12 – 14 Students",
      demoFee: "₹99 Only",
      monthlyFee: "₹1,600 / month (12 sessions)",
      imageUrl: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=1200&q=80",
      description: "Always wanted to dance but felt hesitant or worried you have two left feet? This class is engineered specifically for adult beginners and seniors. We break down complex moves into friendly micro-steps, helping you loosen stiff joints, cultivate natural rhythm, and enjoy the pure joy of movement without any pressure.",
      highlights: [
        "Patient, friendly trainers who emphasize encouragement over perfection",
        "Gentle joint warm-ups, posture correction, and low-impact conditioning",
        "Popular Hindi and international tracks broken down count-by-count",
        "Supportive, friendly community of peers starting their dance journey",
        "Noticeable improvement in mobility, stamina, and mental relaxation"
      ],
      curriculum: [
        {
          title: "Overcoming Body Stiffness",
          desc: "Relaxation drills for neck, shoulders, hips, and ankles to release daily desk tension."
        },
        {
          title: "Basic 8-Count Movement Mastery",
          desc: "How to feel the bass and snare beats and effortlessly match your steps to music."
        },
        {
          title: "Signature Party & Social Steps",
          desc: "Go-to moves you can confidently execute at weddings, family parties, and social events."
        },
        {
          title: "Graceful Transition & Balance",
          desc: "Techniques for smooth weight transfer, steady turns, and fluid arm movements."
        }
      ],
      batchTimings: [
        {
          label: "Morning Wellness Batch",
          days: "Monday, Wednesday & Friday",
          time: "9:00 AM – 10:00 AM"
        },
        {
          label: "Evening Beginner Batch",
          days: "Monday, Wednesday & Friday",
          time: "6:00 PM – 7:00 PM"
        },
        {
          label: "Sunday Intensive",
          days: "Sunday",
          time: "11:00 AM – 1:00 PM"
        }
      ],
      faqs: [
        {
          question: "I have never danced before in my life. Can I join?",
          answer: "Yes, 100%! More than 80% of students in this batch joined with zero prior dancing experience. The curriculum starts with simple clapping, walking, and basic body sways."
        },
        {
          question: "Is there any age barrier?",
          answer: "No age limits whatsoever. We have had students in their 20s, 40s, and late 60s who love our relaxed, fun environment."
        }
      ]
    }
  },
  {
    id: "advance",
    pillTag: "INTENSIVE",
    title: "Advance",
    levelLabel: "PROFESSIONAL TRACK",
    description: "Intensive Technique & Choreography",
    trialInfo: "Trial Class Available",
    ctaText: "Book Demo",
    imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1000&q=80",
    details: {
      id: "advance",
      title: "Advanced Dance & Choreography Masterclass",
      pillTag: "Intermediate to Pro • Audition Track",
      levelLabel: "Advanced / Professional",
      tagline: "High-Caliber Technique, Complex Isolations, Speed Drills & Stage-Ready Execution",
      ageGroup: "Teens & Adults (14+ with prior experience)",
      duration: "75 mins per session",
      batchSize: "Max 10 Dancers",
      demoFee: "₹99 Only",
      monthlyFee: "₹2,200 / month (12 sessions)",
      imageUrl: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80",
      description: "Designed for experienced dancers, college crew performers, and aspiring dance professionals. Mentored by Ramy (Dance India Dance & Bollywood film choreographer), this masterclass pushes physical limits with intricate urban choreo, speed changes, musical textures, and precision formations.",
      highlights: [
        "Direct choreography training with Master Ramyyysingh",
        "Cinematic 4K studio video shoots for your dance portfolio/Instagram",
        "Audition preparation for national TV reality shows & commercial backup dance",
        "Rigorous stamina conditioning, explosive power, and isolation control",
        "Guest masterclasses by touring industry choreographers"
      ],
      curriculum: [
        {
          title: "Micro-Isolations & Textural Control",
          desc: "Controlling chest pops, glides, dimestops, and wave dynamics at lightning speeds."
        },
        {
          title: "Musicality & Deep Counter-Rhythms",
          desc: "Choreographing to syncopated hi-hats, vocal runs, and silent pauses."
        },
        {
          title: "Freestyle & Battle Cypher Strategy",
          desc: "Spontaneous movement invention, call-and-response battles, and musical adaptation."
        },
        {
          title: "Camera Facing & Performance Optics",
          desc: "Understanding camera angles, lighting spots, and high-impact visual performance cues."
        }
      ],
      batchTimings: [
        {
          label: "Intensive Evening Batch",
          days: "Tuesday, Thursday & Saturday",
          time: "7:00 PM – 8:15 PM"
        },
        {
          label: "Weekend Pro Crew Rehearsal",
          days: "Saturday & Sunday",
          time: "4:00 PM – 6:00 PM"
        }
      ],
      faqs: [
        {
          question: "Is an audition required to enter the Advance batch?",
          answer: "You can book a ₹99 demo class where the mentor assesses your fundamentals and advises whether Advance or Senior/Beginner is the best fit."
        },
        {
          question: "Will I get performance video reels?",
          answer: "Yes, every routine completed in the advance batch concludes with a professional multi-angle video shoot published with proper credits."
        }
      ]
    }
  },
  {
    id: "gymnastic",
    pillTag: "ACROBATICS",
    title: "Gymnastic",
    levelLabel: "ALL LEVELS",
    description: "Flexibility, Acrobatics & Core Balance",
    trialInfo: "Trial Class Available",
    ctaText: "Book Demo",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
    details: {
      id: "gymnastic",
      title: "Gymnastics & Acrobatic Dance",
      pillTag: "Acrobatics • Flexibility • Core Power",
      levelLabel: "Beginner to Advanced",
      tagline: "Master Flips, Cartwheels, Handstands, and Aerial Flexibility on Safety Crash Mats",
      ageGroup: "5 Years to Adults",
      duration: "60 mins per session",
      batchSize: "8 – 10 Students (with dedicated spotters)",
      demoFee: "₹99 Only",
      monthlyFee: "₹1,800 / month (12 sessions)",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
      description: "Gymnastics combines sheer athletic strength with aerial beauty. Whether you dream of sticking a clean handstand, executing high-flying cartwheels, or improving flexibility for dance tricks, our certified gymnastics coaches provide hands-on spotting and progressive drills on safety impact mats.",
      highlights: [
        "Certified gymnastics coaches with rigorous spotting safety standards",
        "High-density shock absorbing safety mats and gymnastics equipment",
        "Progressive flexibility training (full front & side splits mastery)",
        "Inversion control, shoulder strength, and dynamic core conditioning",
        "Seamless integration of acrobatic tricks into dance choreography"
      ],
      curriculum: [
        {
          title: "Core & Shoulder Conditioning",
          desc: "Targeted bodyweight training for hollow holds, planks, and wrist conditioning."
        },
        {
          title: "Flexibility Drills & Splits",
          desc: "Safe active and passive stretching techniques for hamstrings, hips, and back bridges."
        },
        {
          title: "Inversions & Handstands",
          desc: "Wall-assisted to freestanding handstands, headstands, and forearm balances."
        },
        {
          title: "Acrobatic Rolls & Aerials",
          desc: "Forward/backward rolls, cartwheels, round-offs, back walkovers, and aerial prep."
        }
      ],
      batchTimings: [
        {
          label: "Morning Gymnastics Batch",
          days: "Tuesday, Thursday & Saturday",
          time: "7:00 AM – 8:00 AM"
        },
        {
          label: "Evening Acro Batch",
          days: "Monday, Wednesday & Friday",
          time: "4:00 PM – 5:00 PM"
        },
        {
          label: "Weekend Acro Workshop",
          days: "Saturday & Sunday",
          time: "8:30 AM – 10:00 AM"
        }
      ],
      faqs: [
        {
          question: "Is it safe for someone with zero gymnastics background?",
          answer: "Yes! Every student starts on padded safety mats with certified spotters holding your weight until you have developed proper balance and muscle memory."
        },
        {
          question: "Will it help my dancing?",
          answer: "Immense benefit! Flexibility, back mobility, and acrobatic tricks add high-impact showstoppers to any dance routine."
        }
      ]
    }
  },
  {
    id: "bollywood-ladies",
    pillTag: "ENERGIZING",
    title: "Bollywood Ladies",
    levelLabel: "LADIES SPECIAL",
    description: "Vibrant Beats, Expression & Fitness",
    trialInfo: "Trial Class Available",
    ctaText: "Book Demo",
    imageUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1000&q=80",
    details: {
      id: "bollywood-ladies",
      title: "Bollywood Ladies Dance & Fitness",
      pillTag: "Women Only • High Energy • Pure Fun",
      levelLabel: "All Levels Welcome",
      tagline: "Burn Calories, Express Yourself to Iconic Bollywood Tracks, and Reclaim Your Daily Joy!",
      ageGroup: "Women of all ages (Homemakers, Professionals, Students)",
      duration: "60 mins per session",
      batchSize: "12 – 15 Ladies",
      demoFee: "₹99 Only",
      monthlyFee: "₹1,500 / month (12 sessions)",
      imageUrl: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1200&q=80",
      description: "A private, uplifting space curated exclusively for women! Combine high-octane Bollywood choreography with calorie-torching cardio and expressive storytelling. From classic retro thumkas to trendy hook-steps, release everyday stress while toning your body and laughing with a vibrant community.",
      highlights: [
        "Exclusive women-only batch with a comfortable, secure studio atmosphere",
        "Burn up to 450+ calories per hour while grooving to chartbuster songs",
        "Learn camera-ready expressions, hand mudras, and graceful body lines",
        "Zero performance pressure — dance at your own comfortable pace",
        "Special festival themes (Navratri Garba, Karwa Chauth, Sangeet specials)"
      ],
      curriculum: [
        {
          title: "Warm-Up & Bollywood Cardio",
          desc: "Fun, rhythm-based cardio intervals set to energetic dhol and dance beats."
        },
        {
          title: "Classic Thumkas & Latke-Jhatke",
          desc: "Traditional Bollywood hip movements, shoulder shimmies, and graceful twists."
        },
        {
          title: "Trending Song Hooksteps",
          desc: "Mastering the latest viral Bollywood and Punjabi dance hooks count by count."
        },
        {
          title: "Cool-Down & Guided Stretching",
          desc: "Relaxing muscle stretches and deep breathing to leave you rejuvenated."
        }
      ],
      batchTimings: [
        {
          label: "Morning Energizer Batch",
          days: "Monday, Wednesday & Friday",
          time: "10:30 AM – 11:30 AM"
        },
        {
          label: "Afternoon Leisure Batch",
          days: "Tuesday, Thursday & Saturday",
          time: "3:00 PM – 4:00 PM"
        },
        {
          label: "Evening Fitness Batch",
          days: "Monday, Wednesday & Friday",
          time: "5:00 PM – 6:00 PM"
        }
      ],
      faqs: [
        {
          question: "Can I join if I have knee or back stiffness?",
          answer: "Yes! Our trainers offer low-impact modifications for all jumps and squats so you can dance comfortably without straining your joints."
        },
        {
          question: "What should I wear?",
          answer: "Comfortable kurtis with leggings, tracksuits, or gym wear with comfortable walking or dance shoes."
        }
      ]
    }
  },
  {
    id: "private-class",
    pillTag: "ONE-ON-ONE",
    title: "Private Class",
    levelLabel: "PERSONALIZED",
    description: "Exclusive 1-on-1 Certified Mentorship",
    trialInfo: "Dedicated Schedule",
    ctaText: "Book Private Session",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80",
    details: {
      id: "private-class",
      title: "1-on-1 Private Dance Mentorship",
      pillTag: "100% Customized • Dedicated Mentor",
      levelLabel: "Tailored to Your Goal",
      tagline: "Exclusive Individual Training Tailored Exactly to Your Style, Pace, and Personal Milestones",
      ageGroup: "Individual (All Ages)",
      duration: "60 mins per private session",
      batchSize: "1-on-1 (Direct Mentor Attention)",
      demoFee: "₹99 Consultation & Trial",
      monthlyFee: "Custom packages based on hours & instructor tier",
      imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      description: "When you want 100% undivided focus from a Master Instructor, our Private Classes deliver the fastest results. Whether you are preparing for a high-stakes audition, seeking intensive technique refinement in Hip Hop or Contemporary, or simply prefer private scheduling away from group batches, this track is built around you.",
      highlights: [
        "100% undivided attention from senior choreographers / Master Ramy",
        "Personalized curriculum adapted to your favorite genres and physical goals",
        "Flexible scheduling that syncs seamlessly with your work calendar",
        "3x faster skill acquisition compared to standard group learning",
        "Video analysis with frame-by-frame breakdown of your movement"
      ],
      curriculum: [
        {
          title: "Personal Diagnostic Assessment",
          desc: "Evaluating body posture, range of motion, rhythmic intuition, and preferred styles."
        },
        {
          title: "Customized Routine Development",
          desc: "Tailoring choreographies designed to highlight your natural physical strengths."
        },
        {
          title: "Intensive Precision Polishing",
          desc: "Laser-focused work on arm lines, micro-angles, head snaps, and fluidity."
        },
        {
          title: "Exclusive Showcase Production",
          desc: "Complete production of your private solo performance with studio lighting and edit."
        }
      ],
      batchTimings: [
        {
          label: "Custom Priority Slot A",
          days: "Monday to Sunday (Choose your days)",
          time: "Flexible Morning (8:00 AM – 12:00 PM)"
        },
        {
          label: "Custom Priority Slot B",
          days: "Monday to Sunday (Choose your days)",
          time: "Flexible Evening (1:00 PM – 9:00 PM)"
        }
      ],
      faqs: [
        {
          question: "Can I choose my own songs for private sessions?",
          answer: "Absolutely! You have total creative freedom to choose the track, genre, and whether the focus is technique, fitness, or performance."
        },
        {
          question: "Can two people (couple/siblings) share a private session?",
          answer: "Yes, duo private classes are available upon request at attractive couple rates."
        }
      ]
    }
  },
  {
    id: "home-service",
    pillTag: "DOORSTEP",
    title: "Home service",
    levelLabel: "AT YOUR PLACE",
    description: "Personalized Dance Coaching at Your Home",
    trialInfo: "Home Visit Available",
    ctaText: "Book Home Service",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
    details: {
      id: "home-service",
      title: "Doorstep Dance Coach (Home Service)",
      pillTag: "At Your Doorstep • Ranchi Citywide",
      levelLabel: "Private In-Home Training",
      tagline: "Certified Dance Trainers Dispatched Directly to Your Residence, Villa, or Apartment Complex",
      ageGroup: "Kids, Adults, Families & Societies",
      duration: "60 mins per session",
      batchSize: "Individual, Family or Private Society Group",
      demoFee: "₹99 Consultation & Assessment",
      monthlyFee: "Custom packages based on location & frequency",
      imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
      description: "Save travel time in traffic and learn comfortably inside your own living room or clubhouse! Ramy's Dance Studio deploys vetted, certified choreographers directly to your doorstep across Ranchi. Perfect for busy parents with kids, working executives, or private groups of friends wanting a personalized dance hour at home.",
      highlights: [
        "Vetted, certified, and background-checked dance instructors",
        "Trainer brings portable Bluetooth sound system and workout accessories",
        "Ideal for private family learning, kids after-school, or society clubhouses",
        "Zero travel hassle — turn your living room or terrace into a dance studio",
        "Available in Ahirtoli, Kutchery Rd, Morabadi, Bariatu, Doranda & across Ranchi"
      ],
      curriculum: [
        {
          title: "Home Space Optimization",
          desc: "Setting safe boundaries and utilizing available floor area for dance movements."
        },
        {
          title: "Personalized Learning Pace",
          desc: "Step-by-step coaching at whatever tempo is most comfortable for your family."
        },
        {
          title: "Family / Duo Coordination",
          desc: "Special routines designed for siblings, parent-child, or couples dancing together."
        },
        {
          title: "Routine Recording & Review",
          desc: "Trainer records your progress after every session so you can practice anytime."
        }
      ],
      batchTimings: [
        {
          label: "Morning Doorstep Slot",
          days: "Mon, Wed, Fri OR Tue, Thu, Sat",
          time: "7:00 AM – 10:00 AM (Select exact 1 hr)"
        },
        {
          label: "Evening Doorstep Slot",
          days: "Mon, Wed, Fri OR Tue, Thu, Sat",
          time: "4:00 PM – 8:00 PM (Select exact 1 hr)"
        }
      ],
      faqs: [
        {
          question: "How much space is needed at home?",
          answer: "A standard living room or clear bedroom area of 8x8 feet or larger is plenty for 1-2 dancers. Trainers will adapt movement paths to your space."
        },
        {
          question: "Which areas in Ranchi do you cover?",
          answer: "We cover all major neighborhoods including Kutchery, Morabadi, Bariatu, Lalpur, Hinoo, Doranda, Harmu, and Ashok Nagar."
        }
      ]
    }
  },
  {
    id: "job-person",
    pillTag: "EVENING BATCH",
    title: "Job person",
    levelLabel: "WORKING PROFESSIONALS",
    description: "Evening De-stress & Skill Building",
    trialInfo: "Trial Class Available",
    ctaText: "Book Demo",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
    details: {
      id: "job-person",
      title: "Working Professionals Evening Dance Club",
      pillTag: "After-Work Hours • Stress Buster • Network",
      levelLabel: "All Skill Levels",
      tagline: "Unwind After Office Hours, Shed Work Stress, Stay Fit, and Connect with Like-Minded Professionals",
      ageGroup: "Working Professionals (21 to 55+ Years)",
      duration: "60 mins per session",
      batchSize: "10 – 12 Professionals",
      demoFee: "₹99 Only",
      monthlyFee: "₹1,600 / month (12 sessions)",
      imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
      description: "Tired of sitting in office chairs all day staring at screens? The Job Person batch is custom-tailored for IT professionals, bankers, lawyers, teachers, and corporate executives. Scheduled specifically in the late evening, this batch combines dynamic music, core posture revival, and trending choreographies to reset your body and mind.",
      highlights: [
        "Specially timed late-evening slots (6:30 PM & 7:30 PM) so you never miss a class",
        "Reverses desk-job posture, relieves cervical tension and lower-back stiffness",
        "Fun social community of working professionals across Ranchi industries",
        "High-energy soundtrack ranging from Indie pop and Hip Hop to Bollywood beats",
        "Flexible makeup classes if work overtime prevents attending your regular day"
      ],
      curriculum: [
        {
          title: "Post-Work Spinal & Neck Decompression",
          desc: "Targeted mobility work to release stiff shoulders, tight hips, and neck strain."
        },
        {
          title: "Cardio Dance Interval Training",
          desc: "Burning 400+ calories per hour while learning fun choreography combinations."
        },
        {
          title: "Urban Choreography & Swag",
          desc: "Catchy urban and hip-hop grooves that make you look effortlessly stylish."
        },
        {
          title: "End-of-Day Mindfulness & Reset",
          desc: "Cooldown breathing techniques to disconnect from work stress and sleep better."
        }
      ],
      batchTimings: [
        {
          label: "Prime Evening Batch A",
          days: "Monday, Wednesday & Friday",
          time: "6:30 PM – 7:30 PM"
        },
        {
          label: "Late Evening Batch B",
          days: "Tuesday, Thursday & Saturday",
          time: "7:30 PM – 8:30 PM"
        },
        {
          label: "Weekend Executive Intensive",
          days: "Saturday & Sunday",
          time: "5:00 PM – 6:30 PM"
        }
      ],
      faqs: [
        {
          question: "What if I get stuck in office overtime?",
          answer: "We understand corporate schedules! If you miss a weekday slot, you can attend a weekend makeup session with prior notice."
        },
        {
          question: "Can I directly come from office in formals?",
          answer: "We have clean changing rooms at the studio. You can easily switch into workout track pants and sneakers before class starts."
        }
      ]
    }
  },
  {
    id: "wedding-choreography",
    pillTag: "SANGEET SPECIAL",
    title: "Wedding choreography",
    levelLabel: "CUSTOM ROUTINES",
    description: "Family Sangeet & Couple Dance Preparation",
    trialInfo: "Custom Package",
    ctaText: "Book Consultation",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
    details: {
      id: "wedding-choreography",
      title: "Wedding & Sangeet Choreography",
      pillTag: "Bride & Groom • Family Flashmobs • Sangeet",
      levelLabel: "Tailored to Any Song & Group",
      tagline: "Make Your Wedding Unforgettable! Romantic Duets, High-Energy Family Sangeet, and Stage Spectacles",
      ageGroup: "Couples, Brides, Grooms, Parents & All Family Members",
      duration: "Flexible packages (5-day crash to 2-week masterclasses)",
      batchSize: "Solo, Couple or 30+ Member Family Groups",
      demoFee: "₹99 Consultation & Track Consultation",
      monthlyFee: "Custom event packages (includes audio track mixing)",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      description: "Your wedding Sangeet deserves nothing less than Bollywood blockbuster magic! Ramyyysingh and team craft bespoke wedding choreographies that match your couple chemistry, family dynamics, and song choices. From breathtaking romantic entries and parents' tribute dances to viral energetic flashmobs, we make non-dancers look like superstars on stage.",
      highlights: [
        "Professional music editing & song mashups mixed in-house with sound effects",
        "Step-by-step video tutorials provided for out-of-station relatives to practice",
        "Rehearsals available at our studio, at your residence, or directly at the venue",
        "Express 3-to-7 day crash courses for last-minute wedding preparations",
        "Choreography designed specifically to be effortless in heavy lehengas and sherwanis"
      ],
      curriculum: [
        {
          title: "Bride & Groom Grand Romantic Entry & Duet",
          desc: "Breathtaking lifts, graceful twirls, and emotional chemistry set to your dream track."
        },
        {
          title: "Parents & Senior Family Tributes",
          desc: "Comfortable, dignified, heart-touching steps that bring smiles and tears of joy."
        },
        {
          title: "Bridesmaids vs Groomsmen Dance Battle",
          desc: "Fun, cheeky, high-octane banter choreo that sets the entire sangeet hall on fire."
        },
        {
          title: "Full Family Finale & Flashmob",
          desc: "Easy, grand coordination where all 20+ family members join in sync for the climax."
        }
      ],
      batchTimings: [
        {
          label: "Express Crash Rehearsals",
          days: "Daily Intensive (5 to 10 Days)",
          time: "Flexible Timing (Day or Night)"
        },
        {
          label: "Weekend Family Rehearsals",
          days: "Saturday & Sunday",
          time: "Scheduled at your convenience"
        }
      ],
      faqs: [
        {
          question: "Can our relatives who live in other cities learn the dance?",
          answer: "Yes! We record high-definition count-by-count practice video tutorials with voiceovers and send them via WhatsApp so outstation guests arrive fully prepared."
        },
        {
          question: "Do you also do song selection and audio editing?",
          answer: "Yes, seamless track transitions, dialogue overlays, and sound leveling are included free with all our wedding choreography packages."
        },
        {
          question: "Can rehearsals happen at our home or banquet hall?",
          answer: "Yes, our choreographers can travel to your home, banquet hall, or conduct rehearsals in our studio."
        }
      ]
    }
  }
];

export interface Achievement {
  id: string;
  iconType: "tv" | "ribbon" | "film";
  title: string;
  description: string;
  tag: string;
  verifiedLabel: string;
  videoUrl: string;
  videoTitle: string;
  videoPlatform?: "youtube" | "instagram" | "video";
  imageUrl: string;
  photoTitle?: string;
  photoCaption?: string;
}

export const studioAchievements: Achievement[] = [
  {
    id: "did",
    iconType: "tv",
    title: "Dance India Dance",
    description: "Featured participant showcasing exceptional talent, technique, and freestyle mastery on national television.",
    tag: "NATIONAL TV",
    verifiedLabel: "Verified Platform",
    videoUrl: "https://www.youtube.com/@ramysdancestudio6278",
    videoTitle: "Watch DID Performance & Audition",
    videoPlatform: "youtube",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    photoTitle: "Dance India Dance Reality Stage Spotlight",
    photoCaption: "High-voltage theatrical performance that received standing ovations from celebrity judges on national television."
  },
  {
    id: "igt",
    iconType: "ribbon",
    title: "India's Got Talent",
    description: "Ramyyysingh featured on one of India's biggest talent platforms, recognized by industry leaders.",
    tag: "NATIONAL STAGE",
    verifiedLabel: "Verified Platform",
    videoUrl: "https://www.youtube.com/@ramysdancestudio6278",
    videoTitle: "Watch India's Got Talent Showcase",
    videoPlatform: "youtube",
    imageUrl: "/ramy/ramy-igt.jpg",
    photoTitle: "India's Got Talent Stage Performance",
    photoCaption: "Master Ramy's national TV spotlight showcasing synchronized acrobatics and urban lyrical flow."
  },
  {
    id: "movies",
    iconType: "film",
    title: "Worked in Blockbuster Movies",
    description: "Choreography & performance in Bollywood movies like Sonu Ke Titu Ki Sweety, Tanhaji, Banjo, Baar Baar Dekho (Kala Chashma).",
    tag: "BOLLYWOOD HITS",
    verifiedLabel: "Verified Platform",
    videoUrl: "https://www.youtube.com/results?search_query=ramy%27s+dance+studio+kala+chashma+banjo",
    videoTitle: "Watch Bollywood Choreography Videos",
    videoPlatform: "youtube",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    photoTitle: "Bollywood Blockbuster Movies Choreography",
    photoCaption: "Choreography and live stage performances for Bollywood blockbusters including Kala Chashma, Banjo, and Tanhaji."
  }
];

export const studioInfo = {
  name: "RAMY'S DANCE STUDIO",
  brandKicker: "RAMY'S",
  brandMain: "DANCE STUDIO",
  phone: "9692451182",
  phoneDisplay: "9692451182",
  whatsappNumber: "919692451182",
  address: "2nd Floor, Metro Market, Kutchery Road, Ranchi - 834002, Jharkhand, India",
  googleMapsUrl: "https://maps.google.com/?q=Metro+Market+Kutchery+Road+Ranchi+Jharkhand+834002",
  instagramHandle: "@ramysdancestudio",
  instagramUrl: "https://instagram.com/ramysdancestudio",
  youtubeHandle: "@ramysdancestudio6278",
  youtubeUrl: "https://www.youtube.com/@ramysdancestudio6278",
  youtubeChannelId: "UCCXbnQCjM8I_hNBBag60mLw",
  hours: {
    weekdays: "Mon – Sat: 10:00 AM – 7:00 PM",
    sunday: "Sunday: 8:00 AM – 5:00 PM"
  },
  demoPriceText: "₹99"
};
