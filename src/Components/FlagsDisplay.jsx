import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { AlertCircle } from 'lucide-react';

export default function FlagsDisplay({ flags = [] }) {
  const flagRefs = useRef([]);

  useEffect(() => {
    gsap.from(flagRefs.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'back.out(1.7)',
    });
  }, [flags]);

  if (!flags.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-text-primary dark:text-white flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-danger" />
        Risk Flags
      </h3>
      <div className="flex flex-wrap gap-2">
        {flags.map((flag, i) => (
          <span
            key={i}
            ref={(el) => (flagRefs.current[i] = el)}
            className="px-3 py-1.5 bg-danger/10 text-danger text-sm font-medium rounded-full flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {flag}
          </span>
        ))}
      </div>
    </div>
  );
}