/**
 * Site-wide film grain. One fixed layer of SVG feTurbulence noise at 4% —
 * keeps the photography from looking too clean and digital.
 */
const NOISE = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
);

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.045]"
      style={{
        backgroundImage: `url("data:image/svg+xml,${NOISE}")`,
        backgroundSize: '220px 220px',
      }}
    />
  );
}

export default Grain;
