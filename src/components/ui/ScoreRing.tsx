import { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

function colorForScore(score: number): string {
  if (score >= 90) return '#22C55E';
  if (score >= 70) return '#3BAE5D';
  if (score >= 50) return '#F59E0B';
  return '#EF4444';
}

/** Animated circular progress ring, reused for the Overview hero score and the AI tab's score. */
export function ScoreRing({ score, label, size = 168, strokeWidth = 12 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = colorForScore(score);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimatedScore(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-surface-light dark:stroke-surface-darkBase"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1000ms ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold text-text-primary dark:text-text-darkPrimary">
          {Math.round(animatedScore)}
        </span>
        <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-text-secondary dark:text-text-darkSecondary">
          {label}
        </span>
      </div>
    </div>
  );
}
