type Props = {
  values: number[];
  className?: string;
};

export function LineChart({ values, className }: Props) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 320;
  const h = 88;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / span) * (h - 8) - 4;
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke="#f97316"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
