import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ProductView from '../Components/ProductView'; 
import useSmoothEnter from "../hooks/useSmoothTransition";

export default function Dashboard() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useSmoothEnter(containerRef);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.4)' }
    );
  }, []);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-6 py-12">
     
      <h1
  ref={titleRef}
  className="text-4xl md:text-5xl font-extrabold 
             bg-gradient-to-r from-primary to-accent 
             bg-clip-text text-transparent 
             [-webkit-text-fill-color:transparent] 
             [-webkit-background-clip:text]"
  style={{
    backgroundImage: 'linear-gradient(to right, #2563EB, #38BDF8)',
  }}
>
  All Products
</h1>

       

      <div className="mt-10">
        <ProductView />
      </div>
    </div>
  );
}