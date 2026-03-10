export const INITIAL_MODULES = [
  {
    id: 1,
    title: 'Intro to Ableton Live Interface',
    description:
      'Get comfortable with Ableton\'s world. We\'ll tour the Session and Arrangement views, explore the browser, configure your audio device, and learn the handful of shortcuts that will save you hours every session.',
    estimatedTime: '~30 min',
    icon: 'LayoutDashboard',
    accentColor: '#C96A2E',
    status: 'completed',
    objectives: [
      'Navigate the Session and Arrangement views with confidence',
      'Understand the browser and how to find sounds',
      'Configure your audio interface settings',
      'Create, name, and save your first project',
    ],
    lessons: [
      { id: 1, title: 'Watch: Tour of the Ableton Interface', completed: true },
      { id: 2, title: 'Exercise: Set up your audio device', completed: true },
      { id: 3, title: 'Read: Essential keyboard shortcuts', completed: true },
    ],
    notes:
      'Ableton has two main views — Session View (great for improvising loops) and Arrangement View (the timeline for finishing songs). Press Tab to switch between them instantly. The browser on the left is your library — everything from drums to effects lives there.',
    questions: [
      {
        id: 1,
        question: 'What\'s the difference between the Session View and Arrangement View?',
        askedAt: '2024-01-15T10:30:00Z',
        answer:
          'Great question! Session View is like a grid of loops — perfect for improvising and trying out ideas in real time. Each cell can hold a clip that you can trigger freely. Arrangement View is a traditional timeline (like most DAWs), where you place clips in sequence to build a full, structured song. Most producers use both: jam in Session View until something clicks, then record that performance into Arrangement View to finalize the track.',
        answeredAt: '2024-01-15T14:00:00Z',
      },
      {
        id: 2,
        question: 'How do I set my audio interface in Ableton?',
        askedAt: '2024-01-16T09:00:00Z',
        answer:
          'Go to Preferences (Cmd+, on Mac / Ctrl+, on Windows) → Audio tab. Under "Audio Device", select your interface from the dropdown. Make sure the sample rate matches your interface\'s settings — 44.1kHz is standard for most music. Hit "Test" to confirm sound is working. If you hear a click or crackle, try increasing the buffer size.',
        answeredAt: '2024-01-16T11:30:00Z',
      },
    ],
  },
  {
    id: 2,
    title: 'Understanding the Arrangement View',
    description:
      'Dive deep into Ableton\'s timeline. Learn to record clips, move and edit them, manage tracks, and use markers to navigate your arrangement like a pro.',
    estimatedTime: '~45 min',
    icon: 'AlignLeft',
    accentColor: '#B05C28',
    status: 'completed',
    objectives: [
      'Record audio and MIDI into the Arrangement View',
      'Edit, duplicate, loop, and resize clips',
      'Add, color-code, and group tracks',
      'Use markers and locators to navigate quickly',
    ],
    lessons: [
      { id: 1, title: 'Watch: Arrangement View deep dive', completed: true },
      { id: 2, title: 'Exercise: Record a simple loop', completed: true },
      { id: 3, title: 'Read: Working with clips and markers', completed: true },
    ],
    notes: '',
    questions: [
      {
        id: 1,
        question: 'When I record in Arrangement View, my clips overlap the old ones. How do I fix it?',
        askedAt: '2024-01-18T15:00:00Z',
        answer: null,
        answeredAt: null,
      },
    ],
  },
  {
    id: 3,
    title: 'Building Your First Beat',
    description:
      'Create a complete drum pattern from scratch using Ableton\'s built-in Drum Rack. We\'ll cover rhythm fundamentals, pattern variations, and techniques to make your beats feel alive and human.',
    estimatedTime: '~60 min',
    icon: 'Music',
    accentColor: '#7A9E7E',
    status: 'in_progress',
    objectives: [
      'Load and navigate the Drum Rack instrument',
      'Program a classic kick, snare, and hi-hat pattern',
      'Add velocity variation for a more natural, human feel',
      'Create fills and pattern variations across 8 bars',
    ],
    lessons: [
      { id: 1, title: 'Watch: Intro to Drum Rack', completed: true },
      { id: 2, title: 'Exercise: Program a 4/4 beat', completed: false },
      { id: 3, title: 'Read: Rhythm theory basics', completed: false },
    ],
    notes: '',
    questions: [],
  },
  {
    id: 4,
    title: 'MIDI Basics & Piano Roll',
    description:
      'Unlock the power of MIDI. Learn to draw, edit, and manipulate notes in the Piano Roll to build melodies, chord progressions, and basslines for your tracks.',
    estimatedTime: '~50 min',
    icon: 'Music2',
    accentColor: '#C96A2E',
    status: 'locked',
    objectives: [
      'Understand what MIDI is and why it\'s so powerful',
      'Draw and edit notes in the Piano Roll',
      'Adjust note velocity and length for expression',
      'Write a simple 8-bar melody and chord progression',
    ],
    lessons: [
      { id: 1, title: 'Watch: MIDI explained simply', completed: false },
      { id: 2, title: 'Exercise: Write an 8-bar melody', completed: false },
      { id: 3, title: 'Read: Basic music theory for producers', completed: false },
    ],
    notes: '',
    questions: [],
  },
  {
    id: 5,
    title: 'Sampling & Audio Clips',
    description:
      'Discover the art of sampling. Warp audio clips to tempo, chop samples creatively, and use Simpler to turn any sound into a fully playable instrument.',
    estimatedTime: '~55 min',
    icon: 'Scissors',
    accentColor: '#D4956A',
    status: 'locked',
    objectives: [
      'Import and warp audio files to your project tempo',
      'Chop samples in the Arrangement View',
      'Use Simpler to create a sample-based instrument',
      'Build a classic chop-and-flip loop from scratch',
    ],
    lessons: [
      { id: 1, title: 'Watch: Audio warping in Ableton', completed: false },
      { id: 2, title: 'Exercise: Chop and rearrange a sample', completed: false },
      { id: 3, title: 'Read: Sampling ethics and clearance', completed: false },
    ],
    notes: '',
    questions: [],
  },
  {
    id: 6,
    title: 'Mixing Fundamentals',
    description:
      'Learn the art of the mix. Balance levels, pan instruments, and use EQ and compression to give each element its own space and make your track feel professional.',
    estimatedTime: '~70 min',
    icon: 'SlidersHorizontal',
    accentColor: '#7A9E7E',
    status: 'locked',
    objectives: [
      'Understand gain staging and headroom',
      'Use EQ Eight to carve space for each instrument',
      'Apply Compressor to control dynamics and add punch',
      'Create a balanced, wide stereo mix',
    ],
    lessons: [
      { id: 1, title: 'Watch: Mixing fundamentals walkthrough', completed: false },
      { id: 2, title: 'Exercise: Mix your beat from Module 3', completed: false },
      { id: 3, title: 'Read: EQ frequency reference guide', completed: false },
    ],
    notes: '',
    questions: [],
  },
  {
    id: 7,
    title: 'Effects & Automation',
    description:
      'Bring your tracks to life with effects and movement. Use reverb, delay, and filters, then automate parameters to create builds, drops, and evolving textures that tell a story.',
    estimatedTime: '~65 min',
    icon: 'Wand2',
    accentColor: '#C96A2E',
    status: 'locked',
    objectives: [
      'Use Ableton\'s core effects: Reverb, Delay, Chorus-Ensemble',
      'Draw automation curves in the Arrangement View',
      'Create a filter sweep and dramatic volume fade',
      'Build tension with automation leading into a drop',
    ],
    lessons: [
      { id: 1, title: 'Watch: Effects and automation walkthrough', completed: false },
      { id: 2, title: 'Exercise: Automate a filter sweep on a synth', completed: false },
      { id: 3, title: 'Read: When to use effects (mixing vs. sound design)', completed: false },
    ],
    notes: '',
    questions: [],
  },
  {
    id: 8,
    title: 'Exporting Your Track',
    description:
      'Get your music into the world. Learn to export a polished stereo mixdown, stem your track for collaboration, apply light mastering, and share your first finished production.',
    estimatedTime: '~35 min',
    icon: 'Upload',
    accentColor: '#D4956A',
    status: 'locked',
    objectives: [
      'Export a high-quality stereo mixdown (WAV & MP3)',
      'Export individual stems for collaboration',
      'Apply basic mastering with Ableton\'s Loudness Meter',
      'Share your track and celebrate!',
    ],
    lessons: [
      { id: 1, title: 'Watch: Export settings explained', completed: false },
      { id: 2, title: 'Exercise: Export your final track', completed: false },
      { id: 3, title: 'Read: Music distribution basics', completed: false },
    ],
    notes: '',
    questions: [],
  },
]
