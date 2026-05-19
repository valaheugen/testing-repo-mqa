export const argosCustomStyles = `
  /* Stop CSS animations and transitions so screenshots are stable. */
  *,
  *::before,
  *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }

  /* Hide the Pace progress bar that appears at the top of pages while routing. */
  .pace,
  .pace-progress,
  .pace-activity {
    display: none !important;
  }

  /* Hide blinking text-input caret in inputs so it can't flip mid-snapshot. */
  input,
  textarea,
  [contenteditable="true"] {
    caret-color: transparent !important;
  }
`;
