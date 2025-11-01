import { useState, useEffect, useMemo } from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import RadialChart from './RadialChart';

const statusColors = {
  Reviewed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Flagged: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const ITEMS_PER_PAGE = 6;

export default function ProductView() {
  const { products } = useProductStore();
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreRange, setScoreRange] = useState([0, 100]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

   const processedProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesName = p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesScore = p.score >= scoreRange[0] && p.score <= scoreRange[1];
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
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
        return sortConfig.direction === 'asc'
          ? (aVal < bVal ? -1 : 1)
          : (aVal > bVal ? -1 : 1);
      });
    }

    return filtered;
  }, [products, searchTerm, scoreRange, selectedStatus, sortConfig]);

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

   useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, scoreRange, selectedStatus, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setScoreRange([0, 100]);
    setSelectedStatus('all');
    setSortConfig({ key: null, direction: 'asc' });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-4 h-4 text-primary" />
      : <ChevronDown className="w-4 h-4 text-primary" />;
  };

  return (
    <div className="w-full">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all text-sm font-medium"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          {(searchTerm || scoreRange[0] > 0 || scoreRange[1] < 100 || selectedStatus !== 'all') && (
            <button onClick={resetFilters} className="flex items-center gap-1 text-sm text-text-muted hover:text-primary">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all ${
              viewMode === 'table' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-text-muted'
            }`}
          >
            <Table className="w-4 h-4" /> Table
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all ${
              viewMode === 'grid' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-text-muted'
            }`}
          >
            <Grid3X3 className="w-4 h-4" /> Grid
          </button>
        </div>
      </div>

       {viewMode === 'table' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-medium text-text-muted">
                    <button onClick={() => handleSort('productName')} className="flex items-center gap-1 hover:text-primary">
                      Name <SortIcon column="productName" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-text-muted">
                    <button onClick={() => handleSort('score')} className="flex items-center gap-1 hover:text-primary">
                      Score <SortIcon column="score" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-text-muted">
                    <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-primary">
                      Status <SortIcon column="status" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-16 text-center text-text-muted">
                      <div className="flex flex-col items-center gap-3">
                        <Filter className="w-10 h-10 opacity-30" />
                        <p>No products match your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map(product => (
                    <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-primary/5 dark:hover:bg-primary/10">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-text-primary dark:text-white truncate max-w-[180px]">{product.productName}</p>
                          <p className="text-sm text-text-muted">{product.category}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-lg font-bold ${getScoreColor(product.score)}`}>{product.score}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="p-4">
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

           {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-text-muted">
                Page {currentPage} of {totalPages} ({processedProducts.length} items)
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg dark:text-white text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

       {viewMode === 'grid' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedProducts.length === 0 ? (
              <div className="col-span-full p-16 text-center text-text-muted">
                <Filter className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No products found.</p>
              </div>
            ) : (
              paginatedProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md p-5 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-semibold text-text-primary dark:text-white truncate">{product.productName}</h3>
                      <p className="text-sm text-text-muted truncate">{product.category}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16">
                      <RadialChart score={product.score} size={64} />
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(product.score)}`}>{product.score}</p>
                      <p className="text-xs text-text-muted">Score</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

           {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg dark:text-white text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 dark:text-white  dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

       {showFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowFilters(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0" max="100"
                  value={scoreRange[0]}
                  onChange={e => setScoreRange([+e.target.value, scoreRange[1]])}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                />
                <span className="self-center">—</span>
                <input
                  type="number"
                  min="0" max="100"
                  value={scoreRange[1]}
                  onChange={e => setScoreRange([scoreRange[0], +e.target.value])}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg dark:bg-gray-700"
              >
                <option value="all">All Status</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Pending">Pending</option>
                <option value="Flagged">Flagged</option>
              </select>
              <div className="flex gap-2">
                <button onClick={resetFilters} className="flex-1 py-2.5 border rounded-lg">Reset</button>
                <button onClick={() => setShowFilters(false)} className="flex-1 py-2.5 bg-primary text-white rounded-lg">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}