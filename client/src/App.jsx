import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './services/auth'
import Nav from './components/Nav'
import Login from './components/Login'
import Register from './components/Register'
import ModelList from './components/ModelList'
import ModelForm from './components/ModelForm'
import ToastProvider from './components/Toast'
import Footer from './components/Footer'
import PublicModels from './pages/PublicModels'
import ModelPurchase from './pages/ModelPurchase'
import MyModels from './pages/MyModels'
import MyPurchases from './pages/MyPurchases'
import NotFound from './pages/NotFound'
import Home from './pages/Home'

function Protected({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) return <div className="center">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Nav />
        <main className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/public" element={<PublicModels />} />
            <Route path="/purchase" element={<Protected><ModelPurchase /></Protected>} />
            <Route path="/my-models" element={<Protected><MyModels /></Protected>} />
            <Route path="/my-purchases" element={<Protected><MyPurchases /></Protected>} />
            <Route path="/add" element={<Protected><ModelForm /></Protected>} />
            <Route path="/edit/:id" element={<Protected><ModelForm editMode={true} /></Protected>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </main>
      </ToastProvider>
    </AuthProvider>
  );
}
