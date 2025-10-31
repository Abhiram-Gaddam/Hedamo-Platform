 import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function useSmoothEnter(ref, delay = 0) {
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [ref, delay]);
}