import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/use-auth";
import { CartProvider } from "./hooks/use-cart";
import { ToastProvider } from "./hooks/use-toast";
import { Toaster } from "react-hot-toast"; // Assuming Toaster is from react-hot-toast
import AdminPage from './pages/admin-page'; // Updated import
import CartPage from './pages/cart-page'; // Updated import
import CollectionsPage from './pages/collections/collections-page'; // Updated import
import CorporatePage from './pages/corporate-page'; // Updated import
import GiftingPage from './pages/gifting-page'; // Updated import
import CustomBoxPage from './pages/custom-box-page'; // Updated import
import FavoritesPage from './pages/favorites-page'; // Updated import
import AuthPage from './pages/auth-page'; // Updated import
import NotFound from './pages/not-found'; // Updated import

const App: React.FC = () => {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Toaster />
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/collections/:category" element={<CollectionsPage />} />
                <Route path="/corporate" element={<CorporatePage />} />
                <Route path="/gifting" element={<GiftingPage />} />
                <Route path="/custom-box" element={<CustomBoxPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

export default App;
