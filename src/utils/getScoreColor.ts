function lerpColor(colorA: string, colorB: string, t: number): string {
  const parse = (hex: string) => {
    const h = hex.replace('#', '');
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    ];
  };
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');

  const [ar, ag, ab] = parse(colorA);
  const [br, bg, bb] = parse(colorB);

  const r = ar + (br - ar) * t;
  const g = ag + (bg - ag) * t;
  const b = ab + (bb - ab) * t;

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Returns a color interpolated across three stops:
 *   0   → #EF4444 (red / low)
 *   50  → #E5A900 (amber / medium)
 *   100 → #1F8F2E (green / high)
 */
export function getScoreColor(score: number): string {
  const LOW = '#EF4444';
  const MID = '#E5A900';
  const HIGH = '#1F8F2E';

  if (score <= 50) {
    return lerpColor(LOW, MID, score / 50);
  }
  return lerpColor(MID, HIGH, (score - 50) / 50);
}
