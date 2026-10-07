/**
 * Fixed film look over the whole page: a slow-flickering grain and a soft
 * vignette. Pure CSS, so it costs no JS and no layout. The layers use plain
 * alpha rather than a blend mode, because a full-screen `mix-blend-mode`
 * forces everything beneath it (including the WebGL canvas) to be re-composited
 * on every scroll frame.
 */
export default function FilmOverlay() {
  return (
    <>
      <div className="film-vignette" aria-hidden />
      <div className="film-grain" aria-hidden />
    </>
  );
}
