import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowUpDown, Eye } from 'lucide-react';
import { useProductStore } from '../store/productStore';

const statusColors = {
  Reviewed: 'bg-success/10 text-success',
  Pending: 'bg-warning/10 text-warning',
  Flagged: 'bg-danger/10 text-danger',
};

export default function ProductTable() {
  const { products } = useProductStore();
  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const rowRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSortedProducts([...products]);
  }, [products]);

  useEffect(() => {
    if (!rowRefs.current) return;
  
     const rows = gsap.utils.toArray(rowRefs.current);
  
     gsap.killTweensOf(rows);
  
    gsap.fromTo(
      rows,
      {
        opacity: 0,
        y: 60,
        scale: 0.98,
        filter: "blur(4px)",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.4,
        stagger: {
          each: 0.15,
          from: "start",
          ease: "power4.out",
        },
        ease: "expo.out",
        delay: 0.2,
      }
    );
  }, [sortedProducts]);
  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...sortedProducts].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedProducts(sorted);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="bg-white dark:bg-dark-bg rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-text-primary dark:text-white">
          Product Catalog
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-200 hover:shadow-card-hover">
              <th className="text-left p-4 font-medium text-text-muted">
                <button
                  onClick={() => handleSort('productName')}
                  className="flex items-center gap-1 hover:text-text-primary transition-colors"
                >
                  Name
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-text-muted">
                <button
                  onClick={() => handleSort('score')}
                  className="flex items-center gap-1 hover:text-text-primary transition-colors"
                >
                  Score
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-text-muted">Status</th>
              <th className="text-left p-4 font-medium text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => (
              <tr
                key={product.id}
                ref={(el) => (rowRefs.current[index] = el)}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-200 hover:shadow-card-hover"
                data-scroll
                data-scroll-speed="0.05"
              >
                <td className="p-4">
                  <div>
                    <p className="font-medium text-text-primary dark:text-white">
                      {product.productName}
                    </p>
                    <p className="text-sm text-text-muted">{product.category}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`text-lg font-bold ${getScoreColor(
                      product.score
                    )}`}
                  >
                    {product.score}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[product.status] || 'bg-gray-100 text-gray-600'}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}