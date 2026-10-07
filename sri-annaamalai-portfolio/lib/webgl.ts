/**
 * Can this browser actually create a WebGL context right now?
 *
 * Many visitors cannot: hardware acceleration switched off, a GPU on the
 * browser's blocklist, a locked-down corporate profile, a VM or remote
 * desktop. Probing first matters because react-three-fiber reports a failed
 * context as an unhandled promise rejection from an async effect that re-runs
 * on every render, so no error boundary can catch it and the console fills
 * with errors. The 3D canvas must simply never mount in that case.
 *
 * Client only. The probe context is released immediately, because browsers
 * cap how many live contexts a page may hold.
 */
export function hasWebGL(): boolean {
  try {
    const probe = document.createElement("canvas");
    const gl = (probe.getContext("webgl2") ||
      probe.getContext("webgl") ||
      probe.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
