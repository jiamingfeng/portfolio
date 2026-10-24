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

export interface Skill {
  name: string;
  level: SkillLevel;
}

// Mirrors the résumé's skill bars (ResumeBuilder content/eric_feng_2p.md):
// 90 → expert, 80 → advanced, 70 → proficient.
export const skills: Skill[] = [
  { name: 'C / C++', level: 'expert' },
  { name: 'Unreal Engine', level: 'expert' },
  { name: 'VR / AR / XR', level: 'expert' },
  { name: 'AI / Animation / GPU Programming', level: 'advanced' },
  { name: 'DCC (Maya / Blender / Houdini)', level: 'advanced' },
  { name: 'Asset Pipeline', level: 'advanced' },
  { name: 'UX / Qt / ImGui', level: 'proficient' },
  { name: 'Unity', level: 'proficient' },
  { name: 'C# / Python', level: 'proficient' },
];

export interface TimelineEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  points: string[];
}

export const timeline: TimelineEntry[] = [
  {
    role: 'Lead Software Engineer',
    company: 'The LEGO Group',
    period: '12/2024 – Present',
    location: 'Billund, Denmark',
    points: [
      'Lead development of the LEGO Digital Brick SDK on Unreal Engine, enabling authentic LEGO brick-building experiences within the UEFN ecosystem.',
      'Drive a cross-functional team delivering intuitive building UX, high-fidelity brick physics, character animation systems, and performance-optimized creator tooling.',
    ],
  },
  {
    role: 'Principal Gameplay Engineer',
    company: 'Self-Employed',
    period: '06/2022 – Present',
    location: 'Remote',
    points: [
      'Independent gameplay & animation consultant.',
      'Architect and implement advanced gameplay mechanics — character traversal, 3C (Character, Camera, Controls), and AI behavior — alongside design and animation teams.',
    ],
  },
  {
    role: 'Expert Gameplay Engineer',
    company: 'Sledgehammer Games, Activision',
    period: '11/2021 – 05/2022',
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
      'Main developer for an Academy Sci-Tech Award-winning scene description system (Atlas): low-level API design, animation, evaluation, and real-time rendering of proprietary scene data.',
    ],
  },
  {
    role: 'R&D Engineer',
    company: 'Industrial Light & Magic',
    period: '09/2011 – 07/2013',
    location: 'Singapore',
    points: [
      'Designed and developed Block Party 2, ILM’s proprietary procedural rigging system and an Academy Sci-Tech Award winner.',
      'Developed HoudiniBatch, a render-farm manager that let FX artists get the most out of the Academy Award-winning ObaQ render-queue system.',
    ],
  },
  {
    role: 'Motion Capture Pipeline Technical Director',
    company: 'Framestore',
    period: '09/2010 – 09/2011',
    location: 'London, UK',
    points: [
      'Built the motion capture data pipeline and production tools from scratch — data repository management, an in-house MotionBuilder real-time control panel, and Vicon mocap processing.',
      'On-stage technical support for shows including Gravity (2013) and Wrath of the Titans (2012).',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Autodesk',
    period: '12/2007 – 08/2010',
    location: 'Shanghai, China',
    points: [
      'Designed, developed, and maintained the Autodesk FBX library (SDK and plug-ins), Autodesk Material Library, and Autodesk Mudbox.',
      'Collaborated with Autodesk product teams across countries on the FBX pipeline, and helped high-profile clients resolve technical issues.',
    ],
  },
];
