// Minimal icon set — single-stroke, 24px viewBox, currentColor.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const Icon = ({ name, className = 'w-5 h-5' }) => {
  const paths = {
    pin: (
      <>
        <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    list: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
    map: (
      <>
        <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
        <path d="M9 4v14M15 6v14" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    chevron: (
      <>
        <path d="m6 9 6 6 6-6" />
      </>
    ),
    check: (
      <>
        <path d="m5 12 5 5 9-11" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6" />
        <path d="M20 4 10 14" />
        <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l2.5 2.5" />
      </>
    ),
    sliders: (
      <>
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    locate: (
      <>
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="8" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      {paths[name]}
    </svg>
  );
};
