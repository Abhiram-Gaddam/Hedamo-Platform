import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  BarChart3, 
  PieChart, 
  Zap,
  Award,
  Target
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import RadialChart from '../components/RadialChart';

export default function Insights() {
  const { products } = useProductStore();
  const containerRef = useRef(null);
  const chartRefs = useRef([]);

   
  const stats = useMemo(() => {
    const total = products.length;
    const avgScore = total > 0 
      ? Math.round(products.reduce((sum, p) => sum + p.score, 0) / total)
      : 0;
    const flagged = products.filter(p => p.status === 'Flagged').length;
    const verified = products.filter(p => p.status === 'Reviewed').length;
    const highScore = products.filter(p => p.score >= 80).length;
    const lowScore = products.filter(p => p.score < 50).length;

    return {
      avgScore,
      total,
      flagged,
      verified,
      highScore,
      lowScore,
      categories: [...new Set(products.map(p => p.category))].length
    };
  }, [products]);

   
  useEffect(() => {
    const ctx = gsap.context(() => {
       
      gsap.fromTo('.title', 
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

       
      gsap.fromTo(chartRefs.current,
        { opacity: 0, y: 40, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: 'back.out(1.4)',
          delay: 0.2
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [stats]);

  const statCards = [
    {
      label: 'Average Transparency',
      value: `${stats.avgScore}`,
      suffix: '%',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      label: 'Products Flagged',
      value: stats.flagged,
      icon: AlertCircle,
      color: 'from-red-500 to-pink-600',
      textColor: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      label: 'Fully Verified',
      value: stats.verified,
      icon: CheckCircle,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'High Performers',
      value: stats.highScore,
      icon: Award,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    }
  ];

  const categoryData = useMemo(() => {
    const map = {};
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / products.length) * 100)
    }));
  }, [products]);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 py-8">
       
      <div className="text-center mb-12">
        <h1 className="title text-5xl font-bold bg-gradient-to-r from-primary via-accent to-pink-600 bg-clip-text text-transparent mb-4">
          AI-Powered Insights
        </h1>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">
          Real-time analytics on product transparency, performance, and trust signals
        </p>
      </div>

       
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <div
            key={i}
            ref={el => chartRefs.current[i] = el}
            className={`${stat.bg} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${stat.textColor}`}>
                  {stat.value}
                  {stat.suffix && <span className="text-2xl">{stat.suffix}</span>}
                </div>
              </div>
            </div>
            <p className="text-text-muted font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

       
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        
        <div
          ref={el => chartRefs.current[4] = el}
          className="bg-white dark:bg-dark-bg rounded-3xl p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text-primary dark:text-white">Overall Transparency</h3>
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-64 h-64">
              <RadialChart score={stats.avgScore} size={256} />
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-5xl font-bold text-text-primary dark:text-white">{stats.avgScore}%</p>
            <p className="text-text-muted">Across {stats.total} products</p>
          </div>
        </div>

         
        <div
          ref={el => chartRefs.current[5] = el}
          className="bg-white dark:bg-dark-bg rounded-3xl p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text-primary dark:text-white">Category Distribution</h3>
            <PieChart className="w-6 h-6 text-accent" />
          </div>
          <div className="space-y-4">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-text-primary dark:text-white">{cat.name}</span>
                    <span className="text-sm text-text-muted">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-lg font-bold text-primary w-12 text-right">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

     
      <div className="grid md:grid-cols-2 gap-8">
         
        <div
          ref={el => chartRefs.current[6] = el}
          className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-3xl p-8 shadow-xl border border-red-200 dark:border-red-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500 rounded-2xl">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Risk Alert</h3>
          </div>
          <p className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">{stats.lowScore}</p>
          <p className="text-text-muted">
            products score below 50%. Consider immediate review and improvement.
          </p>
        </div>
 
        <div
          ref={el => chartRefs.current[7] = el}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-8 shadow-xl border border-emerald-200 dark:border-emerald-800"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500 rounded-2xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Opportunity</h3>
          </div>
          <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{stats.highScore}</p>
          <p className="text-text-muted">
            products are transparency leaders. Use them as benchmarks for others.
          </p>
        </div>
      </div>

       
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-3 px-8 py-4 bg-primary/10 rounded-full">
          <Target className="w-5 h-5 text-primary" />
          <p className="text-primary font-semibold">Goal: 85% average transparency by Q4</p>
        </div>
      </div>
    </div>
  );
}