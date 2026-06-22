// Site-wide content. Edit here to change identity, contact links, skills, and the
// career timeline. Project content lives separately in `projects.ts`.

export const site = {
  name: 'Eric Feng',
  tagline: 'Principal / Lead Engineer · Unreal Engine Specialist',
  pedigree: 'Ex-Activision · Ex-EA · Ex-Wētā FX · Ex-ILM',
  summary:
    'Over 20 years building gameplay, graphics, and engine technology embraced by top-tier game studios, award-winning visual-effects houses, and real-time content platforms.',
  location: 'Denmark',
  // Used for <title>, meta description, and Open Graph tags.
  seoDescription:
    'Eric Feng — Principal/Lead game engine & graphics engineer. Unreal Engine specialist. Shipped work on LEGO, Call of Duty, Exodus, Towerborne, Frostbite, and Childish Gambino’s Pharos.',
};

export const contact = {
  email: 'eric84720@gmail.com',
  phone: '+45-60348346',
  linkedin: 'https://www.linkedin.com/in/jiamingfeng',
  // Public credit profiles.
  mobygames: 'https://www.mobygames.com/person/277101/eric-feng/',
  imdb: 'https://www.imdb.com/name/nm3138347/',
  // resume.pdf is copied into public/ at build time (see scripts / README).
  resume: 'resume.pdf',
};

export type SkillLevel = 'expert' | 'advanced' | 'proficient';

export const skills: { name: string; level: SkillLevel }[] = [
  { name: 'C / C++', level: 'expert' },
  { name: 'Unreal Engine', level: 'expert' },
  { name: 'Computer Graphics', level: 'advanced' },
  { name: 'VR / AR / XR', level: 'advanced' },
  { name: 'GPU Programming', level: 'proficient' },
  { name: 'Unity / C#', level: 'proficient' },
];

export const timeline: {
  role: string;
  company: string;
  period: string;
  location: string;
  points: string[];
}[] = [
  {
    role: 'Lead Software Engineer',
    company: 'The LEGO Group',
    period: '04/2023 – Present',
    location: 'Billund, Denmark',
    points: [
      'Lead development of the LEGO Digital Brick SDK on Unreal Engine, enabling authentic LEGO brick-building experiences within the UEFN ecosystem.',
      'Drive a cross-functional team delivering intuitive building UX, high-fidelity brick physics, character animation systems, and performance-optimized creator tooling.',
    ],
  },
  {
    role: 'Principal Gameplay Engineer',
    company: 'Self-Employed',
    period: '05/2020 – Present',
    location: 'Remote',
    points: [
      'Independent gameplay & animation consultant.',
      'Architect and implement advanced gameplay mechanics — character traversal, 3C (Character, Camera, Controls), and AI behavior — alongside design and animation teams.',
    ],
  },
  {
    role: 'Expert Gameplay Engineer',
    company: 'Sledgehammer Games, Activision',
    period: '11/2021 – 02/2023',
    location: 'Melbourne, Australia',
    points: [
      'Researched and implemented gameplay mechanics for upcoming Call of Duty titles.',
      'Optimized loot pickup and destruction systems with an ECS framework.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Frostbite, EA',
    period: '03/2020 – 10/2021',
    location: 'Melbourne, Australia',
    points: [
      'Core-team developer on the Entity-Component-System (ECS) framework in the Frostbite engine.',
      'Collaborated on feature development with game teams around the globe.',
    ],
  },
  {
    role: 'Senior Software Developer',
    company: 'Wētā FX',
    period: '08/2013 – 03/2020',
    location: 'Wellington, New Zealand',
    points: [
      'Designed award-winning real-time interactive VR/AR/XR applications in Unreal Engine and Unity — gameplay, character animation, rendering, performance profiling.',
      'Main developer for an Academy Award-winning scene description system (Atlas): low-level API design, animation, evaluation, and real-time rendering of proprietary scene data.',
    ],
  },
];
