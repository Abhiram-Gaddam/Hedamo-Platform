import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft } from 'lucide-react';
import RadialChart from '../components/RadialChart';
import SuggestionsList from '../components/SuggestionsList';
import FlagsDisplay from '../components/FlagsDisplay';
import { useProductStore } from '../store/productStore';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProductStore();
  const containerRef = useRef(null);

  const product = products.find((p) => p.id === parseInt(id));
 
  useEffect(() => {
    const ctx = gsap.context(() => {
       
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
 
      gsap.from('.detail-section', {
        y: 20,
        opacity: 1,  
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  if (!product) return <div>Product not found</div>;

  const ai = product.aiResponse || {
    explanation: 'No AI analysis available.',
    suggestions: [],
    flags: [],
  };

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto px-4 md:px-0">
       
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-primary mb-6 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>
 
      <div className="detail-section bg-white dark:bg-dark-bg rounded-xl shadow-sm p-8 mb-6 border border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-text-primary dark:text-white mb-2">
          {product.productName}
        </h1>
        <p className="text-text-muted">{product.category}</p>
      </div>
 
      <div className="detail-section grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-dark-bg rounded-xl shadow-sm p-8 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-800">
          <RadialChart score={product.score} size={180} />
        </div>

        <div className="bg-white dark:bg-dark-bg rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-3">
            AI Explanation
          </h3>
          <p className="text-text-muted leading-relaxed">{ai.explanation}</p>
        </div>
      </div>
 
      <div className="detail-section grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-bg rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
          <SuggestionsList suggestions={ai.suggestions} />
        </div>
        <div className="bg-white dark:bg-dark-bg rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800">
          <FlagsDisplay flags={ai.flags} />
        </div>
      </div>
    </div>
  );
}
