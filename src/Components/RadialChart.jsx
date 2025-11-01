import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const circumference = 2 * Math.PI * 70;  

export default function RadialChart({ score = 0, size = 160 }) {
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const offset = circumference - (circumference * score) / 100;

  useEffect(() => {
    gsap.fromTo(
      circleRef.current,
      { strokeDashoffset: circumference },
      {
        strokeDashoffset: offset,
        duration: 1.8,
        ease: 'power3.out',
      }
    );

    gsap.to(textRef.current, {
      innerHTML: score,
      duration: 1.8,
      snap: { innerHTML: 1 },
      ease: 'power3.out',
    });
  }, [score, offset]);

  const getColor = () => {
    if (score >= 80) return '#22C55E';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r="70"
          stroke="#E5E7EB"
          strokeWidth="16"
          fill="none"
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r="70"
          stroke={getColor()}
          strokeWidth="16"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          ref={textRef}
          className="text-4xl font-bold text-text-primary dark:text-white"
        >
          0
        </span>
        <span className="text-sm text-text-muted">Transparency Score</span>
      </div>
    </div>
  );
}