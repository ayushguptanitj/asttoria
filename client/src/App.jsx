import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ContactPage from './pages/ContactPage'
import TermsPage from './pages/TermsPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import './App.css'

function AppContent() {
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminPath && <Navbar />}
      <main className={isAdminPath ? '' : 'min-h-[60vh]'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <WhatsAppFloat />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App

