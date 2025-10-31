// // src/components/ProductView.jsx
// import { useState, useEffect, useRef, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Grid3X3, Table, Eye, Filter, X, ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';
// import { useProductStore } from '../store/productStore';
// import RadialChart from './RadialChart';

// const statusColors = {
//   Reviewed: 'bg-success/10 text-success',
//   Pending: 'bg-warning/10 text-warning',
//   Flagged: 'bg-danger/10 text-danger',
// };

// export default function ProductView() {
//   const { products } = useProductStore();
//   const [viewMode, setViewMode] = useState('table');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [scoreRange, setScoreRange] = useState([0, 100]);
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
//   const popupRef = useRef(null);
//   const navigate = useNavigate();

//   // === OPTIMIZED: NO GSAP ON LIST ===
//   const processedProducts = useMemo(() => {
//     let filtered = products.filter(product => {
//       const matchesName = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesScore = product.score >= scoreRange[0] && product.score <= scoreRange[1];
//       const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
//       return matchesName && matchesScore && matchesStatus;
//     });

//     if (sortConfig.key) {
//       filtered.sort((a, b) => {
//         let aVal = a[sortConfig.key];
//         let bVal = b[sortConfig.key];
//         if (sortConfig.key === 'productName') {
//           aVal = aVal.toLowerCase();
//           bVal = bVal.toLowerCase();
//         }
//         if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
//         if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }
//     return filtered;
//   }, [products, searchTerm, scoreRange, selectedStatus, sortConfig]);

//   // === POPUP ANIMATION ONLY ===
//   useEffect(() => {
//     if (!popupRef.current || !showAdvancedFilters) return;
//     const el = popupRef.current;
//     el.style.opacity = '0';
//     el.style.transform = 'scale(0.9) translateY(-20px)';
//     const timer = setTimeout(() => {
//       el.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
//       el.style.opacity = '1';
//       el.style.transform = 'scale(1) translateY(0)';
//     }, 10);
//     return () => clearTimeout(timer);
//   }, [showAdvancedFilters]);

//   const handleSort = (key) => {
//     setSortConfig(prev => ({
//       key,
//       direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   const resetFilters = () => {
//     setSearchTerm('');
//     setScoreRange([0, 100]);
//     setSelectedStatus('all');
//     setSortConfig({ key: null, direction: 'asc' });
//   };

//   const getScoreColor = (score) => {
//     if (score >= 80) return 'text-success';
//     if (score >= 50) return 'text-warning';
//     return 'text-danger';
//   };

//   const SortIcon = ({ column }) => {
//     if (sortConfig.key !== column) return <ChevronUp className="w-4 h-4 opacity-30" />;
//     return sortConfig.direction === 'asc'
//       ? <ChevronUp className="w-4 h-4 text-primary" />
//       : <ChevronDown className="w-4 h-4 text-primary" />;
//   };

//   return (
//     <div className="w-full">
//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setShowAdvancedFilters(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium shadow-sm"
//           >
//             <Filter className="w-4 h-4" />
//             Filters
//           </button>
//           {(searchTerm || scoreRange[0] > 0 || scoreRange[1] < 100 || selectedStatus !== 'all' || sortConfig.key) && (
//             <button
//               onClick={resetFilters}
//               className="flex items-center gap-1 text-sm text-text-muted hover:text-primary"
//             >
//               <RotateCcw className="w-4 h-4" />
//               Reset
//             </button>
//           )}
//         </div>

//         <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
//           <button
//             onClick={() => setViewMode('table')}
//             className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//               viewMode === 'table' ? 'bg-white dark:bg-dark-bg text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
//             }`}
//           >
//             <Table className="w-4 h-4" /> Table
//           </button>
//           <button
//             onClick={() => setViewMode('grid')}
//             className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//               viewMode === 'grid' ? 'bg-white dark:bg-dark-bg text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
//             }`}
//           >
//             <Grid3X3 className="w-4 h-4" /> Grid
//           </button>
//         </div>
//       </div>

//       {/* TABLE VIEW — MOBILE FRIENDLY */}
//             {/* TABLE VIEW — FULLY RESPONSIVE */}
// {viewMode === 'table' && (
//   <div className="bg-white dark:bg-dark-bg rounded-2xl shadow-card overflow-hidden">
//     {/* Responsive scroll container */}
//     <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
//       <table className="w-full min-w-[600px] border-collapse">
//         {/* Sticky Header */}
//         <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
//           <tr className="border-b border-gray-200 dark:border-gray-700">
//             <th className="text-left p-3 sm:p-4 font-medium text-text-muted whitespace-nowrap">
//               <button onClick={() => handleSort('productName')} className="flex items-center gap-1 hover:text-primary">
//                 Name <SortIcon column="productName" />
//               </button>
//             </th>
//             <th className="text-left p-3 sm:p-4 font-medium text-text-muted whitespace-nowrap">
//               <button onClick={() => handleSort('score')} className="flex items-center gap-1 hover:text-primary">
//                 Score <SortIcon column="score" />
//               </button>
//             </th>
//             <th className="text-left p-3 sm:p-4 font-medium text-text-muted whitespace-nowrap">
//               <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-primary">
//                 Status <SortIcon column="status" />
//               </button>
//             </th>
//             <th className="text-left p-3 sm:p-4 font-medium text-text-muted whitespace-nowrap">Actions</th>
//           </tr>
//         </thead>

//         {/* Table Body */}
//         <tbody>
//           {processedProducts.length === 0 ? (
//             <tr>
//               <td colSpan="4" className="p-10 text-center text-text-muted">
//                 <div className="flex flex-col items-center gap-2">
//                   <Filter className="w-8 h-8 opacity-30" />
//                   <p>No products match your filters.</p>
//                 </div>
//               </td>
//             </tr>
//           ) : (
//             processedProducts.map((product) => (
//               <tr
//                 key={product.id}
//                 className="border-b border-gray-100 dark:border-gray-800 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all"
//               >
//                 <td className="p-3 sm:p-4">
//                   <div>
//                     <p className="font-medium text-text-primary dark:text-white truncate max-w-[160px] sm:max-w-[220px]">
//                       {product.productName}
//                     </p>
//                     <p className="text-xs sm:text-sm text-text-muted">{product.category}</p>
//                   </div>
//                 </td>
//                 <td className="p-3 sm:p-4">
//                   <span className={`text-base sm:text-lg font-semibold ${getScoreColor(product.score)}`}>
//                     {product.score}
//                   </span>
//                 </td>
//                 <td className="p-3 sm:p-4">
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[product.status]} whitespace-nowrap`}
//                   >
//                     {product.status}
//                   </span>
//                 </td>
//                 <td className="p-3 sm:p-4">
//                   <button
//                     onClick={() => navigate(`/product/${product.id}`)}
//                     className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-xs sm:text-sm font-medium"
//                   >
//                     <Eye className="w-4 h-4" /> View
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   </div>
// )}

//       {/* GRID VIEW */}
//       {viewMode === 'grid' && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {processedProducts.length === 0 ? (
//             <div className="col-span-full p-16 text-center text-text-muted">
//               <div className="flex flex-col items-center gap-3">
//                 <Filter className="w-10 h-10 opacity-30" />
//                 <p>No products match your filters.</p>
//               </div>
//             </div>
//           ) : (
//             processedProducts.map((product) => (
//               <div
//                 key={product.id}
//                 className="bg-white dark:bg-dark-bg rounded-2xl shadow-card hover:shadow-card-hover p-6 transition-all duration-300 group cursor-pointer"
//                 onClick={() => navigate(`/product/${product.id}`)}
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <h3 className="font-semibold text-text-primary dark:text-white text-lg">{product.productName}</h3>
//                     <p className="text-sm text-text-muted">{product.category}</p>
//                   </div>
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
//                     {product.status}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="w-20 h-20">
//                     <RadialChart score={product.score} size={80} />
//                   </div>
//                   <button className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
//                     <Eye className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* FILTER POPUP */}
//       {showAdvancedFilters && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdvancedFilters(false)}>
//           <div
//             ref={popupRef}
//             className="bg-white dark:bg-dark-bg rounded-2xl shadow-2xl p-8 max-w-md w-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-text-primary dark:text-white">Advanced Filters</h2>
//               <button
//                 onClick={() => setShowAdvancedFilters(false)}
//                 className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="space-y-5">
//               <div>
//                 <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">Search</label>
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Name or category..."
//                   className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">Score Range</label>
//                 <div className="flex items-center gap-3">
//                   <input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={scoreRange[0]}
//                     onChange={(e) => setScoreRange([Number(e.target.value), scoreRange[1]])}
//                     className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
//                   />
//                   <span>—</span>
//                   <input
//                     type="number"
//                     min="0"
//                     max="100"
//                     value={scoreRange[1]}
//                     onChange={(e) => setScoreRange([scoreRange[0], Number(e.target.value)])}
//                     className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">Status</label>
//                 <select
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="Reviewed">Reviewed</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Flagged">Flagged</option>
//                 </select>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={resetFilters}
//                   className="flex-1 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={() => setShowAdvancedFilters(false)}
//                   className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// src/components/ProductView.jsx 
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid3X3,
  Table,
  Eye,
  Filter,
  X,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import RadialChart from './RadialChart';

const statusColors = {
  Reviewed: 'bg-success/10 text-success',
  Pending: 'bg-warning/10 text-warning',
  Flagged: 'bg-danger/10 text-danger',
};

export default function ProductView() {
  const { products } = useProductStore();
  const [desktopViewMode, setDesktopViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreRange, setScoreRange] = useState([0, 100]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Actual view mode (force grid on mobile)
  const viewMode = isMobile ? 'grid' : desktopViewMode;

  // === Filtering & Sorting ===
  const processedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesName =
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesScore =
        product.score >= scoreRange[0] && product.score <= scoreRange[1];
      const matchesStatus =
        selectedStatus === 'all' || product.status === selectedStatus;
      return matchesName && matchesScore && matchesStatus;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (sortConfig.key === 'productName') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [products, searchTerm, scoreRange, selectedStatus, sortConfig]);

  // === Popup Animation ===
  useEffect(() => {
    if (!popupRef.current || !showAdvancedFilters) return;
    const el = popupRef.current;
    el.style.opacity = '0';
    el.style.transform = 'scale(0.9) translateY(-20px)';
    const timer = setTimeout(() => {
      el.style.transition =
        'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.opacity = '1';
      el.style.transform = 'scale(1) translateY(0)';
    }, 10);
    return () => clearTimeout(timer);
  }, [showAdvancedFilters]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setScoreRange([0, 100]);
    setSelectedStatus('all');
    setSortConfig({ key: null, direction: 'asc' });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column)
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-primary" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary" />
    );
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvancedFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium shadow-sm text-sm"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          {(searchTerm ||
            scoreRange[0] > 0 ||
            scoreRange[1] < 100 ||
            selectedStatus !== 'all' ||
            sortConfig.key) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm text-text-muted hover:text-primary"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        {/* View Toggle - Only show on desktop */}
        {!isMobile && (
          <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
            <button
              onClick={() => setDesktopViewMode('table')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                desktopViewMode === 'table'
                  ? 'bg-white dark:bg-dark-bg text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Table className="w-4 h-4" /> Table
            </button>
            <button
              onClick={() => setDesktopViewMode('grid')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                desktopViewMode === 'grid'
                  ? 'bg-white dark:bg-dark-bg text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Grid3X3 className="w-4 h-4" /> Grid
            </button>
          </div>
        )}
      </div>

      {/* TABLE VIEW — Desktop Only */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-dark-bg rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-4 py-4 font-medium text-text-muted whitespace-nowrap">
                    <button
                      onClick={() => handleSort('productName')}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Name <SortIcon column="productName" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-4 font-medium text-text-muted whitespace-nowrap">
                    <button
                      onClick={() => handleSort('score')}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Score <SortIcon column="score" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-4 font-medium text-text-muted whitespace-nowrap">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Status <SortIcon column="status" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-4 font-medium text-text-muted whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {processedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-10 text-center text-text-muted"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Filter className="w-8 h-8 opacity-30" />
                        <p>No products match your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  processedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-text-primary dark:text-white">
                            {product.productName}
                          </p>
                          <p className="text-sm text-text-muted">
                            {product.category}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-lg font-semibold ${getScoreColor(
                            product.score
                          )}`}
                        >
                          {product.score}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[product.status]
                          } whitespace-nowrap`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GRID VIEW — Mobile & Desktop */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {processedProducts.length === 0 ? (
            <div className="col-span-full p-12 sm:p-16 text-center text-text-muted">
              <div className="flex flex-col items-center gap-3">
                <Filter className="w-10 h-10 opacity-30" />
                <p>No products match your filters.</p>
              </div>
            </div>
          ) : (
            processedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-dark-bg rounded-2xl shadow-card hover:shadow-card-hover p-6 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="font-semibold text-text-primary dark:text-white text-lg truncate">
                      {product.productName}
                    </h3>
                    <p className="text-sm text-text-muted truncate">
                      {product.category}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}
                  >
                    {product.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-20 h-20">
                    <RadialChart score={product.score} size={80} />
                  </div>
                  <button className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FILTER POPUP */}
      {showAdvancedFilters && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAdvancedFilters(false)}
        >
          <div
            ref={popupRef}
            className="bg-white dark:bg-dark-bg rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white">
                Advanced Filters
              </h2>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name or category..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                  Score Range
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scoreRange[0]}
                    onChange={(e) =>
                      setScoreRange([
                        Number(e.target.value),
                        scoreRange[1],
                      ])
                    }
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  />
                  <span className="text-text-muted">—</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={scoreRange[1]}
                    onChange={(e) =>
                      setScoreRange([
                        scoreRange[0],
                        Number(e.target.value),
                      ])
                    }
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-white mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-text-primary dark:text-white focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Pending">Pending</option>
                  <option value="Flagged">Flagged</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}