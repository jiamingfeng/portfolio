// =============================================================================
//  PROJECTS — the single source of truth for the showcase section.
// =============================================================================
//
//  TO ADD A NEW PROJECT: copy one entry in the `projects` array below, paste it
//  at the position you want it to appear, and fill in the fields. Drop any local
//  media into  public/assets/<slug>/  and reference it by file name.
//  See CONTENT.md for the full walkthrough (media conversion, posters, sizzle reels).
//
//  Media items render in order. Each item is ONE of:
//    { type: 'youtube', id: 'VIDEOID', title?: '...' }
//    { type: 'loop',    src: 'file', poster?: 'file', title?: '...' }   // silent autoplay loop
//    { type: 'image',   src: 'file', title?: '...' }                    // static image (e.g. key art)
//    { type: 'video',   url: 'https://…/clip.mp4', poster?: 'file', title?: '...' } // hosted video w/ sound
//
//  For 'loop'/'image', `src` is the base name WITHOUT extension; the components
//  look for  <src>.mp4 / <src>.webm / <src>.jpg  (and an optional <poster>.jpg),
//  all inside  public/assets/<slug>/.  For 'video', `url` is a full external URL
//  and `poster` is an optional local <poster>.jpg under public/assets/<slug>/.
// =============================================================================

export type MediaItem =
  | { type: 'youtube'; id: string; title?: string }
  | { type: 'loop'; src: string; poster?: string; title?: string }
  | { type: 'image'; src: string; title?: string }
  | { type: 'video'; url: string; poster?: string; title?: string };

export interface Project {
  slug: string; // folder name under public/assets/ and anchor id
  title: string;
  role: string;
  period: string;
  link?: { label: string; url: string }; // official project / docs link
  /** Whether the media on this project is official studio footage rather than
   *  the engineer's personal capture. Renders an "Official footage" note. */
  officialFootage?: boolean;
  blurb: string; // one-line framing of the project
  contributions: string[]; // bullet points — what Eric did
  media: MediaItem[];
}

export const projects: Project[] = [
  {
    slug: 'lego-brick-editor',
    title: 'LEGO Brick Editor — Unreal Engine / UEFN',
    role: 'Lead Software Engineer · The LEGO Group',
    period: '04/2023 – Present',
    link: {
      label: 'Epic Games documentation',
      url: 'https://dev.epicgames.com/documentation/fortnite/lego-brick-editor-in-fortnite',
    },
    blurb:
      'A collaboration with Epic Games powering authentic digital brick-building in LEGO Fortnite and UEFN.',
    contributions: [
      'Lead engineer on digital brick-building UX, animation, physics, and optimization.',
      'Built creator-facing tooling for high-fidelity brick placement and building.',
      'Support internal and external vendors adopting the Atom framework in UE5 projects.',
    ],
    media: [
      { type: 'youtube', id: '7J7J0zm5xFc', title: 'LEGO Brick Editor — Introduction' },
      { type: 'loop', src: 'collision-snap', poster: 'collision-snap-poster', title: 'Detailed collision & proximity snapping' },
      { type: 'loop', src: 'direct-snap', poster: 'direct-snap-poster', title: 'Direct-snap placement gizmos' },
      { type: 'loop', src: 'connected-coloring', poster: 'connected-coloring-poster', title: 'Connected-brick coloring' },
      { type: 'loop', src: 'character-demo', poster: 'character-demo-poster', title: 'Mutable LEGO character demo' },
    ],
  },
  {
    slug: 'exodus',
    title: 'Exodus',
    role: 'Principal Gameplay Engineer',
    period: '04/2023 – 12/2024',
    link: { label: 'exodusgame.com', url: 'https://www.exodusgame.com/' },
    blurb:
      'AAA action-RPG — owned player traversal mechanics and gameplay animation systems.',
    contributions: [
      'Product owner and main contributor for swing, grapple, balance-beam, and camera-transition systems.',
      'Implemented player traversal gameplay and gameplay animation.',
      'Ensured systems interoperate with GAS, companion systems, and NPC interactions.',
    ],
    // Full gameplay leads; the loops below isolate the specific systems Eric owned.
    media: [
      { type: 'youtube', id: 'ye14LA-FJnY', title: 'Exodus — Gameplay Walkthrough' },
      { type: 'loop', src: 'swing-grapple', poster: 'swing-grapple-poster', title: 'Swing & grapple system' },
      { type: 'loop', src: 'railclaw', poster: 'railclaw-poster', title: 'RailClaw traversal' },
      { type: 'loop', src: 'slope-slide', poster: 'slope-slide-poster', title: 'Balance & slope traversal' },
      { type: 'loop', src: 'zip-to-cover', poster: 'zip-to-cover-poster', title: 'Camera transition — zip to cover' },
      { type: 'loop', src: 'npc-traversal', poster: 'npc-traversal-poster', title: 'NPC animation — traversal in motion' },
      { type: 'loop', src: 'npc-aim', poster: 'npc-aim-poster', title: 'NPC animation — aim & locomotion' },
    ],
  },
  {
    slug: 'towerborne',
    title: 'Towerborne',
    role: 'Co-development Consultant',
    period: '11/2020 – 12/2021',
    link: { label: 'towerborne.com', url: 'https://www.towerborne.com/' },
    officialFootage: true,
    blurb:
      "Co-development on Stoic's action-RPG, built in Unreal Engine and published by Xbox Game Studios.",
    contributions: [
      'Ported the game to Xbox from Windows.',
      'Set up the Epic Online Services subsystem integrated with PlayFab.',
      'Performance tuning for character spawning, garbage collection, and load times.',
    ],
    media: [
      { type: 'youtube', id: '4RhVFeNIBi0', title: 'Towerborne — Announce Trailer (Xbox)' },
      { type: 'youtube', id: 'YQlDe-tBV4E', title: 'Towerborne — Gameplay Trailer, Gamescom 2024 (Xbox)' },
      { type: 'youtube', id: '7bY1Hgia6_I', title: 'Towerborne — Official Launch Trailer (Xbox)' },
    ],
  },
  {
    slug: 'cod-mwiii',
    title: 'Call of Duty: Modern Warfare III',
    role: 'Expert Gameplay Engineer · Sledgehammer Games',
    period: '12/2021 – 02/2023',
    link: {
      label: 'callofduty.com',
      url: 'https://www.callofduty.com/en/store/games/modernwarfare3',
    },
    blurb: 'Gameplay and systems work on a flagship Call of Duty title.',
    contributions: [
      'Created a new Point-Of-Interest (POI) system for NPCs.',
      'Underwater gameplay animation setup.',
      'Adopted an ECS system for physics-simulation optimization.',
    ],
    media: [{ type: 'image', src: 'key-art', title: 'Call of Duty: Modern Warfare III — key art' }],
  },
  {
    slug: 'pharos',
    title: "Childish Gambino's Pharos",
    role: 'Main Developer · Wētā FX',
    period: '09/2018 – 12/2018',
    link: {
      label: 'Unreal Engine spotlight',
      url: 'https://www.unrealengine.com/spotlights/childish-gambino-mesmerizes-fans-with-real-time-animation',
    },
    blurb:
      'Real-time interactive graphics for Donald Glover’s immersive Pharos concert experience.',
    contributions: [
      '2019 VES Award — Outstanding Visual Effects in a Special Venue Project.',
      'Main developer for dome-projection VR preview, gameplay, and interactive concert graphics.',
    ],
    media: [{ type: 'youtube', id: 'DTAW0i7NSoo', title: 'Childish Gambino Creates a Fantasy World for Pharos — Unreal Engine' }],
  },
  {
    slug: 'frostbite',
    title: 'Frostbite Engine',
    role: 'Software Engineer · EA',
    period: '03/2020 – 10/2021',
    link: { label: 'ea.com/frostbite', url: 'https://www.ea.com/frostbite' },
    blurb: 'Core engine work on EA’s proprietary Frostbite engine.',
    contributions: [
      'Designed and developed foundation modules for the Entity-Component-System (ECS).',
      'Partnered with tech artists to define new workflows for FX, lighting, and animation.',
    ],
    officialFootage: true,
    media: [
      {
        type: 'video',
        url: 'https://media.contentapi.ea.com/content/dam/eacom/en-us/common/frostbite-2023-talent-sizzle-and-ratings.mp4',
        title: 'Frostbite 2023 — talent sizzle reel',
      },
    ],
  },
  {
    slug: 'atlas',
    title: 'Atlas — Scene Description System',
    role: 'Senior Software Developer · Wētā FX',
    period: '08/2013 – 09/2016',
    blurb:
      'Proprietary scene description format and API library for Wētā Digital, underpinning an Academy Award-winning pipeline.',
    contributions: [
      'Developed the proprietary scene description format and API library (Atlas) for Wētā Digital.',
      'Focused on low-level API design, animation, evaluation system, and real-time rendering for the proprietary scene data.',
    ],
    media: [{ type: 'youtube', id: 'e8DUEO_Sr7Y', title: 'Atlas — Wētā Digital scene description' }],
  },
];
