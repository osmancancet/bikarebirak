/**
 * Hero'nun arkasından yatay olarak yavaşça akan polaroid foto şeridi.
 * Tamamen CSS animasyon, server-safe.
 */
const POLAROIDS = [
  { seed: "p1", rotate: -8, top: 0 },
  { seed: "p2", rotate: 5, top: 10 },
  { seed: "p3", rotate: -3, top: 20 },
  { seed: "p4", rotate: 7, top: 5 },
  { seed: "p5", rotate: -6, top: 15 },
];

export function PolaroidStrip() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-20 -z-10 h-44 overflow-hidden opacity-30"
    >
      <div className="polaroid-track flex gap-8 px-6">
        {[...POLAROIDS, ...POLAROIDS, ...POLAROIDS].map((p, i) => (
          <div
            key={i}
            className="relative shrink-0 rounded-sm bg-white p-2 shadow-lg"
            style={{
              transform: `rotate(${p.rotate}deg) translateY(${p.top}px)`,
            }}
          >
            <div
              className="h-24 w-24 rounded-sm bg-cover bg-center"
              style={{
                backgroundImage: `url(https://picsum.photos/seed/${p.seed}-${
                  i % 5
                }/200/200)`,
              }}
            />
            <div className="h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
