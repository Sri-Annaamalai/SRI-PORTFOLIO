"use client";

// Tiny one-shot signal: the preloader fires this when it clears, and the hero
// plays its own (scoped) intro in response. Keeps the preloader from reaching
// across the DOM into the hero's elements.

// Use global/window state to ensure compatibility across code-split modules and HMR updates.
type IntroState = { done: boolean; listeners: Set<() => void> };

const getIntroState = (): IntroState => {
  if (typeof window === "undefined") {
    return { done: false, listeners: new Set<() => void>() };
  }
  const win = window as Window & { __introState?: IntroState };
  if (!win.__introState) {
    win.__introState = { done: false, listeners: new Set<() => void>() };
  }
  return win.__introState;
};

export const markIntroDone = () => {
  const state = getIntroState();
  if (state.done) return;
  state.done = true;
  state.listeners.forEach((l) => l());
  state.listeners.clear();
};

/** Run `cb` once the intro overlay has cleared (immediately if already done).
 *  Returns an unsubscribe for effect cleanup. */
export const onIntroDone = (cb: () => void): (() => void) => {
  const state = getIntroState();
  if (state.done) {
    cb();
    return () => {};
  }
  state.listeners.add(cb);
  return () => {
    state.listeners.delete(cb);
  };
};
