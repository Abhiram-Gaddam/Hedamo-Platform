// import { useState, useEffect, useRef } from 'react';
// import { Search, Sun, Moon } from 'lucide-react';
// import { gsap } from 'gsap';
// import { useDarkMode } from '../hooks/useDarkMode';

// export default function Navbar() {
//   const { isDark, toggleDarkMode } = useDarkMode();
//   const [searchQuery, setSearchQuery] = useState('');
//   const navbarRef = useRef(null);

//   useEffect(() => {
//     gsap.fromTo(
//       navbarRef.current,
//       { y: -50, opacity: 0, scale: 0.9 },
//       { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
//     );
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log('Searching for:', searchQuery);
//     // Later: filter products
//   };

//   return (
//     <header
//       ref={navbarRef}
//       className="bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-40 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
//     >
//       <div className="flex items-center justify-between">
//         {/* Search */}
//         <form onSubmit={handleSearch} className="flex-1 max-w-xl">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search products..."
//               className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary dark:text-white placeholder-text-muted transition-all"
//             />
//           </div>
//         </form>

//         {/* Dark Mode Toggle */}
//         <button
//           onClick={toggleDarkMode}
//           className="ml-6 p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200 group"
//           aria-label="Toggle dark mode"
//         >
//           {isDark ? (
//             <Sun className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
//           ) : (
//             <Moon className="w-5 h-5 text-text-muted group-hover:scale-110 transition-transform" />
//           )}
//         </button>
//       </div>
//     </header>
//   );
// }
// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, X } from 'lucide-react';
import { gsap } from 'gsap';
import { useDarkMode } from '../hooks/useDarkMode';
import { useProductStore } from '../store/productStore';
import RadialChart from './RadialChart';

export default function Navbar() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navbarRef = useRef(null);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();
  const { products } = useProductStore();

  // Filter products live
  const searchResults = products
    .filter(p =>
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 6);

  // GSAP: Navbar entrance
  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { y: -50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
    );
  }, []);

  // GSAP: Results dropdown
  useEffect(() => {
    if (!resultsRef.current) return;
    if (showResults) {
      gsap.fromTo(
        resultsRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.4)' }
      );
    }
  }, [showResults]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (id) => {
    setSearchQuery('');
    setShowResults(false);
    navigate(`/product/${id}`);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  };

  return (
    <header
      ref={navbarRef}
      className="bg-white/90 dark:bg-dark-bg/90 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-50 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-2xl relative">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => searchQuery && setShowResults(true)}
              placeholder="Search products by name or category..."
              className="w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary dark:text-white placeholder-text-muted transition-all duration-200 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            )}
          </form>

          {/* RESULTS DROPDOWN */}
          {showResults && searchQuery && (
            <div
              ref={resultsRef}
              className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              {searchResults.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-text-muted" />
                  </div>
                  <p className="text-text-muted font-medium">No products found</p>
                  <p className="text-sm text-text-muted mt-1">Try searching for "Coffee", "Snacks", etc.</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      className="w-full p-4 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 text-left border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-primary dark:text-white truncate">
                            {product.productName}
                          </p>
                          <p className="text-sm text-text-muted">{product.category}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-bold ${getScoreColor(product.score)}`}>
                            {product.score}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            product.status === 'Reviewed' ? 'bg-success/10 text-success' :
                            product.status === 'Pending' ? 'bg-warning/10 text-warning' :
                            'bg-danger/10 text-danger'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                  {searchResults.length === 6 && (
                    <div className="p-3 text-center">
                      <Link
                        to="/"
                        onClick={() => setShowResults(false)}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        View all results →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="ml-6 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200 group"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 text-text-muted group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </header>
  );
}