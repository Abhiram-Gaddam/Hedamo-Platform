import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lightbulb } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function SuggestionsList({ suggestions = [] }) {
  const itemRefs = useRef([]);

  useEffect(() => {
    itemRefs.current.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, [suggestions]);

  if (!suggestions.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-text-primary dark:text-white flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-secondary" />
        AI Suggestions
      </h3>
      <ul className="space-y-2">
        {suggestions.map((suggestion, i) => (
          <li
            key={i}
            ref={(el) => (itemRefs.current[i] = el)}
            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <span className="text-secondary mt-0.5">Check</span>
            <span className="text-text-primary dark:text-gray-300">
              {suggestion}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}