import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, PlusCircle, BarChart3 } from 'lucide-react';
import { gsap } from 'gsap';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/add', label: 'Add Product', icon: PlusCircle },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
];

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef(null);
  const isAnimating = useRef(false);

   useEffect(() => {
    if (window.innerWidth >= 1024) return;
    if (isAnimating.current) return;
    isAnimating.current = true;

    const el = sidebarRef.current;
    if (mobileMenuOpen) {
      gsap.fromTo(
        el,
        { x: -300, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          onComplete: () => (isAnimating.current = false),
        }
      );
    } else {
      gsap.to(el, {
        x: -300,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => (isAnimating.current = false),
      });
    }
  }, [mobileMenuOpen]);

   useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;

       gsap.set(sidebarRef.current, { clearProps: 'all' });

      if (isDesktop) {
        setMobileMenuOpen(true);
        setIsCollapsed(false);
      } else {
        setMobileMenuOpen(false);  
      }
    };

    handleResize();  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobileMenuOpen]);

  return (
    <>
       {mobileMenuOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

       <aside
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-[65]
          flex flex-col
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          h-screen
          transition-none
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          ${window.innerWidth >= 1024 ? 'translate-x-0' : ''}
          ${isCollapsed && window.innerWidth >= 1024 ? 'w-20' : 'w-64'}
        `}
        style={{
          willChange: 'transform',
          opacity: window.innerWidth >= 1024 || mobileMenuOpen ? 1 : 0,
          pointerEvents: window.innerWidth >= 1024 || mobileMenuOpen ? 'auto' : 'none',
        }}
      >
         <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          {(!isCollapsed || window.innerWidth < 1024) && (
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Hedamo
            </h1>
          )}
        </div>

         <nav className="flex-1 p-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-cyan-300'
                }`
              }
              onClick={() => window.innerWidth < 1024 && setMobileMenuOpen(false)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || window.innerWidth < 1024) && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

         {window.innerWidth >= 1024 && (
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="hidden lg:flex p-4 border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-gray-800 dark:text-gray-200">
                {isCollapsed ? ' -> ' : '<- ' }
              </div>
            </div>
          </button>
        )}
      </aside>
    </>
  );
}