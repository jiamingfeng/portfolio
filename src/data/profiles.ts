// =============================================================================
//  PROFILES — one object per page "pitch".
// =============================================================================
//
//  The site serves two audiences from the same components:
//
//    generalProfile → src/pages/index.astro  (/)    Principal / Lead engine pitch
//    xrProfile      → src/pages/xr.astro     (/xr)  Senior XR engineer pitch
//
//  A Profile holds everything that DIFFERS between them (copy, project lineup,
//  skill order). Anything shared — name, pedigree, contact links — stays in
//  site.ts and is imported directly by the components.
//
//  TO CHANGE THE XR PAGE: edit `xrProfile` below. Adding a project to it is one
//  `projectBySlug()` line; re-framing an existing project for the XR audience is
//  an override object on that same line. See CONTENT.md.
// =============================================================================

import { site, skills, timeline, type Skill, type TimelineEntry } from './site';
import { projects, projectBySlug, type Project } from './projects';

export interface Profile {
  id: 'general' | 'xr';
  /** This page's path, relative to BASE_URL. '' is the site root. */
  path: string;
  /** Hero sub-heading under the name. */
  tagline: string;
  /** Hero paragraph, reused as the About bio. */
  summary: string;
  /** Hero background strip, relative to public/assets/. Composed by
   *  scripts/make-banner.sh, then WebP'd by scripts/optimize-images.sh — point
   *  this at the .webp. Bright frames only (it renders at 0.42 opacity). */
  banner: string;
  /** <title> for this page (Base.astro appends the site name). */
  seoTitle: string;
  seoDescription: string;
  /** Small caps label above the projects heading. */
  workEyebrow: string;
  workTitle: string;
  aboutTitle: string;
  /** The "Open to …" line in the contact section. */
  contactPitch: string;
  skills: Skill[];
  timeline: TimelineEntry[];
  projects: Project[];
  /** Nav link across to the other profile's page. */
  sibling: { label: string; path: string };
}

// -----------------------------------------------------------------------------
//  Skill ordering
// -----------------------------------------------------------------------------

/**
 *  Reorder the shared skill list by name. Levels deliberately live in ONE place
 *  (site.ts), so editing a level there updates both pages; only the order
 *  changes per profile. Throws on an unknown name so renaming a skill in site.ts
 *  fails the build instead of silently dropping a bar.
 */
function orderSkills(names: string[]): Skill[] {
  return names.map((name) => {
    const skill = skills.find((s) => s.name === name);
    if (!skill) {
      throw new Error(
        `orderSkills: no skill named "${name}" in site.ts. Available: ${skills
          .map((s) => s.name)
          .join(', ')}`
      );
    }
    return skill;
  });
}

// -----------------------------------------------------------------------------
//  General profile — the front page. Copy matches site.ts.
// -----------------------------------------------------------------------------

export const generalProfile: Profile = {
  id: 'general',
  path: '',
  tagline: site.tagline,
  summary: site.summary,
  banner: 'banner/banner.webp', // LEGO · Exodus · Pharos dome VR
  seoTitle: site.name,
  seoDescription: site.seoDescription,
  workEyebrow: 'Selected work',
  workTitle: 'Projects',
  aboutTitle: 'Two decades across games, VFX, and real-time graphics',
  contactPitch:
    'Open to Principal / Lead engineering roles in games, real-time graphics, and engine technology.',
  skills,
  timeline,
  projects,
  sibling: { label: 'XR portfolio', path: 'xr' },
};

// -----------------------------------------------------------------------------
//  XR profile — /xr. Same career, framed for XR/AR/VR roles.
//
//  Lineup is "recognizable-first": lead with the shipped titles a recruiter
//  knows, then the XR-specific work, so credibility precedes specialism. The
//  overrides re-frame shared projects around the things XR job posts ask for —
//  precise placement, world-space interaction UX, spatial tracking, creator
//  tooling, and frame-budget discipline on constrained hardware.
// -----------------------------------------------------------------------------

export const xrProfile: Profile = {
  id: 'xr',
  path: 'xr',
  tagline: 'Senior XR Software Engineer · AR / VR / MR',
  summary:
    'Twenty years of real-time engineering, including shipped AR and VR applications on HoloLens, iPad, and dome projection — plus creator-facing tooling where precise placement, world-space interaction, and frame-budget discipline are the product.',
  banner: 'banner/banner-xr.webp', // Holoplayer · Pharos dome VR · AR Scouting
  seoTitle: 'XR / AR / VR Engineering',
  seoDescription:
    'Eric Feng — Senior XR software engineer. Shipped AR/MR apps on HoloLens and iPad in Unity, dome-projection VR, and creator-facing building tools in Unreal. Ex-LEGO, ex-Activision, ex-EA, ex-Wētā FX.',
  workEyebrow: 'XR, tooling & gameplay',
  workTitle: 'Selected XR & real-time work',
  aboutTitle: 'Real-time engineering across XR, tooling, and gameplay',
  contactPitch:
    'Open to Senior XR engineering roles — AR / VR / MR applications, spatial interaction, and creator tooling in Unity or Unreal.',
  skills: orderSkills([
    'VR / AR / XR',
    'Unreal Engine',
    'C / C++',
    'Unity / C#',
    'Computer Graphics',
    'GPU Programming',
  ]),
  // Shared with the front page: the Wētā entry already leads with the VR/AR/XR
  // work and the LEGO entry already names creator tooling. Give this its own
  // array if the two pitches ever need different bullets.
  timeline,
  projects: [
    projectBySlug('lego-brick-editor', {
      blurb:
        'Creator-facing building tools where precise placement, snapping, and world-space interaction UX are the product.',
      contributions: [
        'Lead engineer on brick-placement UX — proximity snapping, direct-snap gizmos, and collision-accurate positioning.',
        'Shipped creator-facing tooling used by internal teams and external vendors.',
        'Animation, physics, and performance work inside a shipped-title frame budget.',
      ],
      tags: ['Unreal Engine', 'Editor Tooling', 'UX', 'C++', 'Physics', 'Performance'],
    }),
    projectBySlug('exodus', {
      blurb:
        'Player-feel engineering — traversal mechanics, camera transitions, and 3C (character, camera, controls).',
      contributions: [
        'Product owner and main contributor for swing, grapple, balance-beam, and camera-transition systems.',
        'Tuned 3C feel across traversal states and camera handoffs.',
        'Kept systems interoperable with GAS, companion systems, and NPC interactions.',
      ],
      // Tags inherited from projects.ts — same set on both pages.
    }),
    projectBySlug('ar-scouting'),
    projectBySlug('holoplayer'),
    projectBySlug('pharos', {
      blurb:
        'Real-time immersive concert experience — dome-projection VR preview and interactive graphics. 2019 VES Award winner.',
      contributions: [
        '2019 VES Award — Outstanding Visual Effects in a Special Venue Project.',
        'Main developer for the dome-projection VR preview used to design the show.',
        'Gameplay and interactive concert graphics running live to a venue.',
      ],
      tags: ['Unreal Engine', 'VR', 'Rendering', 'Gameplay', 'C++'],
    }),
    projectBySlug('atlas', {
      blurb:
        'Low-level API and real-time rendering for the scene-description system behind an Academy Award-winning pipeline.',
      contributions: [
        'Designed the proprietary scene description format and API library used across the pipeline.',
        'Owned low-level API design, animation, the evaluation system, and real-time rendering of scene data.',
      ],
      // Tags inherited from projects.ts — same set on both pages.
    }),
  ],
  sibling: { label: 'General portfolio', path: '' },
};
