// Diptych motifs. Decorative (aria-hidden). Colour is currentColor: lichen #b9c8b0 on spruce, spruce #213f37 on plaster.

/** The diptych mark: two panels, one filled, one outlined (40 x 28). Hero panel, gate corner, footer. */
export const Mark = (p) => (
  <svg viewBox="0 0 40 28" aria-hidden="true" {...p}>
    <rect x="0.5" y="0.5" width="17" height="27" fill="currentColor" />
    <rect x="22.5" y="0.5" width="17" height="27" fill="none" stroke="currentColor" />
  </svg>
);
