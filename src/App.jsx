import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Navbar from './Components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import ProductDetailsPage from './pages/ProductDetailsPage';
import Insights from './pages/Insights';
import NotFound from './pages/NotFound';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="bg-light-bg dark:bg-dark-bg min-h-screen flex">
         <div
          className={`fixed top-0 left-0 h-screen w-64 z-50 transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        </div>

         <div className="flex-1 flex flex-col lg:ml-64 min-h-screen overflow-hidden">
           <Navbar onMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />

           <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/add" element={<AddProduct />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;