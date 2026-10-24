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
//    { type: 'image',   src: 'file', title?: '...', scale?: 0.5 }       // static image (e.g. key art)
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
  /** `scale` (0–1) shrinks the displayed width — for low-res sources that look
   *  soft at full column width. Defaults to 1. */
  | { type: 'image'; src: string; title?: string; scale?: number }
  | { type: 'video'; url: string; poster?: string; title?: string };

/**
 *  Skill tags shown as pills under each project's title.
 *
 *  This is a CLOSED vocabulary on purpose: a union means a typo fails the build
 *  instead of quietly creating a near-duplicate pill ("C++" vs "C/C++"). To use a
 *  tag that isn't here yet, add it to the union first — that keeps the set small
 *  and consistent across projects.
 *
 *  'Proprietary Engine' covers in-house engines that can't be named (the CoD
 *  engine, Wētā's internal stack). Frostbite is public, so it's named.
 */
export type Tag =
  // engines
  | 'Unreal Engine'
  | 'Unity'
  | 'Frostbite'
  | 'Proprietary Engine'
  // languages
  | 'C++'
  | 'C#'
  | 'Python'
  // gameplay
  | 'Gameplay'
  | '3C'
  | 'Animation'
  | 'Physics'
  | 'NPC AI'
  | 'GAS' // Unreal's Gameplay Ability System
  // tools & architecture
  | 'ECS'
  | 'Editor Tooling'
  | 'UX'
  | 'API Design'
  | 'Scene Description'
  | 'Evaluation Engine'
  | 'Pipeline'
  | 'DCC' // Maya / MotionBuilder / Houdini plug-ins & tools
  | 'Qt'
  | 'Rigging'
  | 'Motion Capture'
  // XR
  | 'AR'
  | 'VR'
  | 'MR'
  | 'XR'
  // systems
  | 'Rendering'
  | 'Performance'
  | 'Console'
  | 'Online Services';

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
  /** Tech / discipline pills. Up to ~7; engine or domain first. */
  tags?: Tag[];
  media: MediaItem[];
}

export const projects: Project[] = [
  {
    slug: 'lego-brick-editor',
    title: 'LEGO Brick Editor — Unreal Engine / UEFN',
    role: 'Lead Software Engineer · The LEGO Group',
    period: '12/2024 – 04/2026',
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
    tags: ['Unreal Engine', 'C++', 'Editor Tooling', 'UX', 'Physics', 'Performance'],
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
    tags: ['Unreal Engine', 'Gameplay', '3C', 'Animation', 'NPC AI', 'GAS', 'C++'],
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
      'Performance tuning for character spawning, garbage collection, and load times to hit the framerate target on every supported platform.',
    ],
    tags: ['Unreal Engine', 'C++', 'Console', 'Online Services', 'Performance'],
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
    period: '12/2021 – 05/2022',
    link: {
      label: 'callofduty.com',
      url: 'https://www.callofduty.com/en/store/games/modernwarfare3',
    },
    blurb: 'Gameplay and systems work on a flagship Call of Duty title.',
    contributions: [
      'Created a new Point-Of-Interest (POI) system for NPCs.',
      'Adopted an ECS system for gameplay-system optimization.',
      'Underwater gameplay animation setup.',
    ],
    tags: ['Proprietary Engine', 'C++', 'Gameplay', 'Animation', 'ECS'],
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
    tags: ['Unreal Engine', 'C++', 'VR', 'Rendering', 'Gameplay'],
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
    tags: ['Frostbite', 'C++', 'ECS', 'Rendering', 'Animation'],
    officialFootage: true,
    media: [
      {
        type: 'video',
        url: 'https://media.contentapi.ea.com/content/dam/eacom/en-us/common/frostbite-2023-talent-sizzle-and-ratings.mp4',
        poster: 'poster.png',
        title: 'Frostbite 2023 — talent sizzle reel',
      },
    ],
  },
  {
    slug: 'atlas',
    title: 'Atlas — Scene Description System',
    role: 'Senior Software Developer · Wētā FX',
    period: '08/2013 – 08/2016',
    blurb:
      'Wētā FX’s proprietary scene description and evaluation framework — recognized with a 2024 Academy® Scientific and Technical Award.',
    contributions: [
      'The system received a 2024 Academy® Scientific and Technical Award (Technical Achievement).',
      'Main developer of the project; designed and maintained a binary-compatible API.',
      'Designed, implemented, and optimized the evaluation framework.',
      'Kept the C++ and Python APIs well tested and documented.',
    ],
    tags: ['Scene Description', 'API Design', 'C++', 'Python', 'Evaluation Engine', 'Pipeline'],
    media: [{ type: 'youtube', id: 'e8DUEO_Sr7Y', title: 'Atlas — Wētā Digital scene description' }],
  },
  // Earlier career — in-house tools with no public footage, so these lean on a
  // talk screenshot / the film the tools served (or no media at all, for FBX).
  {
    slug: 'block-party-2',
    title: 'Lucasfilm Block Party 2 — Procedural Rigging',
    role: 'Main Designer & Developer · Industrial Light & Magic',
    period: '09/2012 – 06/2013',
    link: { label: 'SIGGRAPH 2013 talk', url: 'https://dl.acm.org/doi/10.1145/2504459.2504469' },
    blurb:
      'Lucasfilm’s in-house, Maya-based procedural rigging system — successor to the original Block Party — letting expert and novice riggers visually build shareable rigs from expertly designed rig pieces.',
    contributions: [
      'The system received a 2018 Academy® Scientific and Technical Award (Technical Achievement).',
      'Main designer and developer, covering the system back end and the front-end UX design and implementation.',
      'Built with Python, the Maya Python API, Qt, and PyQt.',
    ],
    tags: ['Rigging', 'DCC', 'Python', 'Qt', 'UX', 'Pipeline'],
    // From the SIGGRAPH 2013 talk materials (ui.rep.jpg).
    media: [{ type: 'image', src: 'bp2-ui', title: 'BlockParty 2 — visual rig-building interface (SIGGRAPH 2013)' }],
  },
  {
    slug: 'framestore-mocap',
    title: 'Framestore Motion Capture Production Tools',
    role: 'Motion Capture Pipeline TD · Framestore',
    period: '09/2010 – 09/2011',
    link: { label: 'Framestore performance capture', url: 'https://www.framestore.com/performance-capture' },
    blurb:
      'The motion capture data pipeline and on-stage production tools for Framestore’s feature-film work, built from scratch.',
    contributions: [
      'Built data repository management, an in-house MotionBuilder real-time control panel, and the Vicon mocap processing pipeline.',
      'All tools and plug-ins cross-platform, written in Python, MEL, C++, and Qt.',
      'On-set technical support for shows including Gravity and Wrath of the Titans.',
    ],
    tags: ['Motion Capture', 'Pipeline', 'DCC', 'Python', 'C++', 'Qt'],
    // Studio still from Framestore's Gravity case study, like the CoD key art.
    media: [{ type: 'image', src: 'gravity', title: 'Gravity (2013) — Framestore' }],
  },
  {
    slug: 'autodesk-fbx',
    title: 'Autodesk FBX — SDK & Plug-ins',
    role: 'Software Engineer · Autodesk',
    period: '01/2008 – 08/2010',
    link: { label: 'autodesk.com/fbx', url: 'https://www.autodesk.com/products/fbx/overview' },
    blurb:
      'The industry-standard 3D interchange format and SDK connecting DCC apps and game engines.',
    contributions: [
      'Main designer and developer of instancing, tangent-space export, subdivision surfaces, hardware shader (CgFX and HLSL) support, Autodesk Material Library data interpolation, the Unreal Engine 3 FBX importer/exporter, and Single Step Suites interoperability.',
      'Designed and implemented FBX SDK features and plug-ins, mostly around polygon, material, and scene-graph technology.',
      'Main contributor to the FBX SDK and plug-in releases from 2009 to 2012.',
    ],
    tags: ['C++', 'API Design', 'Pipeline', 'DCC', 'Rendering'],
    media: [],
  },
];

// =============================================================================
//  XR-ONLY PROJECTS — shown on the XR page (src/pages/xr.astro), not the general
//  page. Kept in a separate array so the main showcase order stays untouched;
//  move an entry into `projects` above if you want it on the front page too.
// =============================================================================

export const xrOnlyProjects: Project[] = [
  {
    slug: 'ar-scouting',
    title: 'AR Location Scouting — iPad AR Virtual Camera',
    role: 'Designer & Developer · Wētā FX',
    period: '11/2019 – 02/2020',
    blurb:
      'Unity iPad AR app that let a director stand on the real set, place virtual characters in it, and frame the shot through an AR virtual camera.',
    contributions: [
      'Designed and implemented the location-scouting capability end to end.',
      'Built the AR virtual camera — device pose driving shot framing against the physical set.',
      'Real-time placement and visualization of virtual characters anchored in the scouted location.',
    ],
    tags: ['Unity', 'C#', 'AR', 'UX', 'Gameplay'],
    // TODO(eric): confirm the AR stack (ARFoundation / ARKit?) and we can name it
    // in the blurb + add an 'API Design'-style tag if warranted.
    media: [
      // TODO(eric): upload the full narrated walkthrough (unlisted is fine), then
      // uncomment and paste the id here. Because media[0] renders large, doing so
      // automatically promotes the video to the featured slot above the loops.
      // { type: 'youtube', id: 'REPLACE_ME', title: 'AR Location Scouting — full walkthrough' },
      { type: 'loop', src: 'scout-character', poster: 'scout-character-poster', title: 'Virtual character on location — time-of-day preview' },
      { type: 'loop', src: 'scout-camera', poster: 'scout-camera-poster', title: 'On-device AR placement on the real set' },
      { type: 'loop', src: 'scout-scan', poster: 'scout-scan-poster', title: 'Scanned location with AR markers' },
    ],
  },
  {
    slug: 'holoplayer',
    title: 'Holoplayer — HoloLens Mixed Reality',
    role: 'Lead Designer & Developer · Wētā FX',
    period: '03/2019 – 05/2019',
    blurb:
      'Unity HoloLens app that lets users align a shared play space and watch animated characters perform inside it.',
    contributions: [
      'Main designer and developer.',
      'Spatial alignment registering the virtual play space to the real room.',
      'Animated character playback and visualization on untethered AR hardware.',
    ],
    tags: ['Unity', 'C#', 'UX', 'AR', 'MR', 'XR', 'Animation'],
    // TODO(eric): confirm whether this used MRTK — worth naming if so.
    media: [
      // TODO(eric): same as above — paste the walkthrough id to feature it.
      // { type: 'youtube', id: 'REPLACE_ME', title: 'Holoplayer — full walkthrough' },
      { type: 'loop', src: 'holo-align', poster: 'holo-align-poster', title: 'Aligning the play space to the real room' },
      { type: 'loop', src: 'holo-playback', poster: 'holo-playback-poster', title: 'Animated characters performing in place' },
    ],
  },
];

// -----------------------------------------------------------------------------
//  Lookup used by the XR page to reuse a project with re-framed copy, without
//  duplicating the entry (and therefore keeping the same `slug` → same media
//  folder under public/assets/).
// -----------------------------------------------------------------------------

const bySlug = new Map<string, Project>(
  [...projects, ...xrOnlyProjects].map((p) => [p.slug, p])
);

/**
 *  Fetch a project by slug, shallow-merging any per-page overrides
 *  (`blurb`, `contributions`, `tags`, …). Throws at build time on an unknown
 *  slug so a typo is a build failure rather than a silently missing section.
 */
export function projectBySlug(slug: string, overrides: Partial<Project> = {}): Project {
  const base = bySlug.get(slug);
  if (!base) {
    throw new Error(
      `projectBySlug: unknown slug "${slug}". Known slugs: ${[...bySlug.keys()].join(', ')}`
    );
  }
  return { ...base, ...overrides };
}
