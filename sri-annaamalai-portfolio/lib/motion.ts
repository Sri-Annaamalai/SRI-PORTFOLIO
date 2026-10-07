// Shared "camera" state for the cinematic layer.
//
// The page is shot like a film: one fixed WebGL set (the orb) behind every
// section, and each section is a chapter that cuts the camera to a new setup.
// ScrollTriggers (components/canvas/OrbDirector.tsx) tween this plain object;
// the WebGL scene reads it every frame. Nothing here touches React state, so a
// camera move never re-renders anything.

/** Where the orb sits and how it is graded for one chapter. */
export type OrbPose = {
  /** Horizontal offset as a fraction of the visible world width. */
  x: number;
  /** Camera distance. Lower is a push-in, higher is a pull-back. */
  z: number;
  scale: number;
  opacity: number;
  /** Shifts the violet to coral gradient (-0.5 violet, +0.5 coral). */
  bias: number;
  /** Spin speed multiplier. */
  spin: number;
};

export type Chapter = {
  /** Section id this chapter is anchored to. */
  id: string;
  /** Two-digit scene number shown in the HUD. */
  no: string;
  label: string;
  orb: OrbPose;
};

/** Page order. Mirrors the section ids in app/page.tsx. */
export const chapters: Chapter[] = [
  { id: "home", no: "00", label: "Title", orb: { x: 0.14, z: 11, scale: 1, opacity: 1, bias: 0, spin: 1 } },
  { id: "about", no: "01", label: "About", orb: { x: -0.13, z: 13.5, scale: 0.8, opacity: 0.5, bias: 0.28, spin: 0.6 } },
  { id: "skills", no: "02", label: "Stack", orb: { x: 0.16, z: 12.5, scale: 0.78, opacity: 0.4, bias: -0.32, spin: 0.7 } },
  { id: "work", no: "03", label: "Work", orb: { x: 0, z: 14.5, scale: 0.72, opacity: 0.3, bias: 0.12, spin: 0.5 } },
  { id: "experience", no: "04", label: "Experience", orb: { x: -0.15, z: 12, scale: 0.8, opacity: 0.4, bias: -0.2, spin: 0.7 } },
  { id: "certifications", no: "05", label: "Credentials", orb: { x: 0.15, z: 13, scale: 0.76, opacity: 0.36, bias: 0.3, spin: 0.6 } },
  { id: "labs", no: "06", label: "Early work", orb: { x: -0.1, z: 12, scale: 0.8, opacity: 0.4, bias: -0.4, spin: 0.8 } },
  { id: "services", no: "07", label: "Services", orb: { x: 0.1, z: 10.5, scale: 0.95, opacity: 0.52, bias: 0.35, spin: 1 } },
  { id: "contact", no: "08", label: "Contact", orb: { x: 0, z: 8.2, scale: 1.2, opacity: 0.85, bias: 0.05, spin: 1.7 } },
];

export type OrbState = OrbPose & {
  /** 0 = scattered cloud, 1 = formed globe. Plays once when the intro clears. */
  assemble: number;
  /** 0 to 1 fade-in for the whole set during the intro. */
  intro: number;
};

/** Live values. Start at the title-card pose with the globe still scattered. */
export const orbState: OrbState = {
  ...chapters[0].orb,
  assemble: 0,
  intro: 0,
};
