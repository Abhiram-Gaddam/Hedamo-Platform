 
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';            
import AddProduct from './pages/AddProduct';
import ProductDetailsPage from './pages/ProductDetailsPage';
import Insights from './pages/Insights';           
import NotFound from './pages/NotFound';

function App() {
   
  return (
    <BrowserRouter>
      <div     className="bg-light-bg dark:bg-dark-bg min-h-screen">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
               <main className="flex-1 p-6 lg:p-10" data-scroll-section>
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
      </div>
    </BrowserRouter>
  );
}

export default App;