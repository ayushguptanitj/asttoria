import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { API_URL } from '../config'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, homepage, gallery, products, categories, leads
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ products: 0, categories: 0, gallery: 0, leads: 0 })
  
  // Data lists from API
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [gallery, setGallery] = useState([])
  const [leads, setLeads] = useState([])
  const [homepage, setHomepage] = useState(null)
  const [dealerships, setDealerships] = useState([])
  const [dealershipForm, setDealershipForm] = useState({ name: '', logoUrl: '' })
  const [customFilters, setCustomFilters] = useState([])

  // Forms / Editing states
  const [productForm, setProductForm] = useState({
    name: '', category: '', short: '', img: '', dimensions: '',
    specs: [{ label: '', value: '' }],
    applications: '', sizes: '',
    company: '', customFilters: [], brochureUrl: '', highlights: [],
    projectsUsed: []
  })
  const [editingProduct, setEditingProduct] = useState(null) // null = adding, productObj = editing
  const [showProductModal, setShowProductModal] = useState(false)

  const [categoryName, setCategoryName] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const [galleryForm, setGalleryForm] = useState({ title: '', imageUrl: '', description: '' })
  
  const [leadDetail, setLeadDetail] = useState(null)

  const [filterName, setFilterName] = useState('')
  const [filterOptionsText, setFilterOptionsText] = useState('')
  const [editingFilter, setEditingFilter] = useState(null)

  const [highlightProperties, setHighlightProperties] = useState([])
  const [badgeLabel, setBadgeLabel] = useState('')
  const [badgeColor, setBadgeColor] = useState('#EF4444')
  const [editingBadge, setEditingBadge] = useState(null)
  const [connectionError, setConnectionError] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    verifyTokenAndFetchData()
  }, [])

  async function verifyTokenAndFetchData() {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }

    try {
      // 1. Verify token
      const verifyRes = await fetch(`${API_URL}/admin/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok || !verifyData.success) {
        handleLogout()
        return
      }
    } catch (err) {
      console.error('Auth verification failed (server may be offline):', err)
      setConnectionError(true)
      setLoading(false)
      return
    }

    // 2. Fetch all collections individually so a single route failure (e.g. 404 from old server version) doesn't crash the dashboard loading
    let prodData = []
    let catData = []
    let galData = []
    let leadData = []
    let homeData = null
    let dlData = []
    let filtersData = []
    let highlightData = []

    try {
      const res = await fetch(`${API_URL}/products`)
      if (res.ok) prodData = await res.json()
    } catch (e) { console.error('Error fetching products:', e) }

    try {
      const res = await fetch(`${API_URL}/categories`)
      if (res.ok) catData = await res.json()
    } catch (e) { console.error('Error fetching categories:', e) }

    try {
      const res = await fetch(`${API_URL}/gallery`)
      if (res.ok) galData = await res.json()
    } catch (e) { console.error('Error fetching gallery:', e) }

    try {
      const res = await fetch(`${API_URL}/quotes`, { headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) leadData = await res.json()
    } catch (e) { console.error('Error fetching leads:', e) }

    try {
      const res = await fetch(`${API_URL}/homepage-settings`)
      if (res.ok) homeData = await res.json()
    } catch (e) { console.error('Error fetching homepage settings:', e) }

    try {
      const res = await fetch(`${API_URL}/dealerships`)
      if (res.ok) dlData = await res.json()
    } catch (e) { console.error('Error fetching dealerships:', e) }

    try {
      const res = await fetch(`${API_URL}/custom-filters`)
      if (res.ok) filtersData = await res.json()
    } catch (e) { console.error('Error fetching custom filters:', e) }

    try {
      const res = await fetch(`${API_URL}/highlight-properties`)
      if (res.ok) highlightData = await res.json()
    } catch (e) { console.error('Error fetching highlight properties:', e) }

    setProducts(prodData)
    setCategories(catData)
    setGallery(galData)
    setLeads(leadData)
    setHomepage(homeData)
    setDealerships(dlData)
    setCustomFilters(filtersData)
    setHighlightProperties(highlightData)

    setStats({
      products: prodData.length,
      categories: catData.length,
      gallery: galData.length,
      leads: leadData.length,
      dealerships: dlData.length
    })

    // Default the category in productForm to the first category if available
    if (catData.length > 0) {
      setProductForm(prev => ({ ...prev, category: catData[0].id }))
    }
    setLoading(false)
  }

  function handleLogout() {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  // Helper auth header
  function getAuthHeader() {
    const token = localStorage.getItem('admin_token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  // --- Category Handlers ---
  async function handleAddCategory(e) {
    e.preventDefault()
    if (!categoryId.trim() || !categoryName.trim()) return

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ id: categoryId.trim().toLowerCase(), label: categoryName.trim() })
      })
      const data = await res.json()
      if (data.success) {
        setCategories([...categories, data.data])
        setCategoryId('')
        setCategoryName('')
        // Update stats
        setStats(prev => ({ ...prev, categories: prev.categories + 1 }))
        // Refresh product select dropdown default if empty
        if (productForm.category === '') {
          setProductForm(prev => ({ ...prev, category: data.data.id }))
        }
      } else {
        alert(data.message || 'Failed to add category')
      }
    } catch (err) {
      alert('Error creating category')
    }
  }

  async function handleDeleteCategory(dbId, nameId) {
    if (!window.confirm(`Are you sure you want to delete this category? Products in this category will prevent deletion.`)) return

    try {
      const res = await fetch(`${API_URL}/categories/${dbId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      })
      const data = await res.json()
      if (data.success) {
        setCategories(categories.filter(c => c._id !== dbId))
        setStats(prev => ({ ...prev, categories: prev.categories - 1 }))
      } else {
        alert(data.message || 'Failed to delete category')
      }
    } catch (err) {
      alert('Error deleting category')
    }
  }

  // --- Product Handlers ---
  function openAddProductModal() {
    setEditingProduct(null)
    setProductForm({
      name: '',
      category: categories[0]?.id || '',
      short: '',
      img: '',
      dimensions: '',
      specs: [{ label: '', value: '' }],
      applications: '',
      sizes: '',
      company: dealerships[0]?.name || '',
      customFilters: [],
      brochureUrl: '',
      highlights: [],
      projectsUsed: []
    })
    setShowProductModal(true)
  }

  function openEditProductModal(prod) {
    setEditingProduct(prod)
    setProductForm({
      name: prod.name,
      category: prod.category,
      short: prod.short,
      img: prod.img || '',
      dimensions: prod.dimensions || '',
      specs: prod.specs.length > 0 ? prod.specs : [{ label: '', value: '' }],
      applications: prod.applications ? prod.applications.join(', ') : '',
      sizes: prod.sizes ? prod.sizes.join(', ') : '',
      company: prod.company || '',
      customFilters: prod.customFilters || [],
      brochureUrl: prod.brochureUrl || '',
      highlights: prod.highlights || [],
      projectsUsed: prod.projectsUsed || []
    })
    setShowProductModal(true)
  }

  // Specifications subform
  function handleSpecChange(index, field, value) {
    const updated = [...productForm.specs]
    updated[index][field] = value
    setProductForm({ ...productForm, specs: updated })
  }

  function handleProductCustomFilterChange(filterName, values) {
    let updated = [...(productForm.customFilters || [])]
    const exists = updated.find(cf => cf.name === filterName)
    if (exists) {
      exists.values = values
    } else {
      updated.push({ name: filterName, values })
    }
    setProductForm({ ...productForm, customFilters: updated })
  }

  function addSpecField() {
    setProductForm({
      ...productForm,
      specs: [...productForm.specs, { label: '', value: '' }]
    })
  }

  function removeSpecField(index) {
    const updated = productForm.specs.filter((_, i) => i !== index)
    setProductForm({ ...productForm, specs: updated.length > 0 ? updated : [{ label: '', value: '' }] })
  }

  async function handleSaveProduct(e) {
    e.preventDefault()

    // Filter empty specifications
    const filteredSpecs = productForm.specs.filter(s => s.label.trim() && s.value.trim())

    // Parse comma-separated inputs
    const appsArray = productForm.applications
      ? productForm.applications.split(',').map(s => s.trim()).filter(Boolean)
      : []
    const sizesArray = productForm.sizes
      ? productForm.sizes.split(',').map(s => s.trim()).filter(Boolean)
      : []

    const payload = {
      name: productForm.name,
      category: productForm.category,
      short: productForm.short,
      img: productForm.img,
      dimensions: productForm.dimensions,
      specs: filteredSpecs,
      applications: appsArray,
      sizes: sizesArray,
      company: productForm.company,
      customFilters: productForm.customFilters,
      brochureUrl: productForm.brochureUrl,
      highlights: productForm.highlights,
      projectsUsed: productForm.projectsUsed
    }

    try {
      let res, data
      if (editingProduct) {
        // Edit product
        res = await fetch(`${API_URL}/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify(payload)
        })
        data = await res.json()
        if (data.success) {
          setProducts(products.map(p => p._id === editingProduct._id ? data.data : p))
          setShowProductModal(false)
        } else {
          alert(data.message || 'Failed to update product')
        }
      } else {
        // Create product
        res = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(payload)
        })
        data = await res.json()
        if (data.success) {
          setProducts([...products, data.data])
          setShowProductModal(false)
          setStats(prev => ({ ...prev, products: prev.products + 1 }))
        } else {
          alert(data.message || 'Failed to create product')
        }
      }
    } catch (err) {
      alert('Error saving product settings')
    }
  }

  async function handleDeleteProduct(dbId) {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return

    try {
      const res = await fetch(`${API_URL}/products/${dbId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      })
      const data = await res.json()
      if (data.success) {
        setProducts(products.filter(p => p._id !== dbId))
        setStats(prev => ({ ...prev, products: prev.products - 1 }))
      } else {
        alert(data.message || 'Failed to delete product')
      }
    } catch (err) {
      alert('Error deleting product')
    }
  }

  // --- Homepage Copy Editing Handlers ---
  function handleHomepageChange(section, key, val) {
    setHomepage(prev => ({
      ...prev,
      [key]: val
    }))
  }

  function handleHomepageStatChange(index, field, val) {
    const updatedStats = [...homepage.heroStats]
    updatedStats[index][field] = val
    setHomepage({ ...homepage, heroStats: updatedStats })
  }

  function handleHomepagePointChange(index, val) {
    const updatedPoints = [...homepage.aboutPoints]
    updatedPoints[index] = val
    setHomepage({ ...homepage, aboutPoints: updatedPoints })
  }

  function addHomepagePoint() {
    setHomepage({
      ...homepage,
      aboutPoints: [...homepage.aboutPoints, 'New checklist item']
    })
  }

  function handleHomepageFeatureChange(index, field, val) {
    const updatedFeatures = [...homepage.featuresList]
    updatedFeatures[index][field] = val
    setHomepage({ ...homepage, featuresList: updatedFeatures })
  }

  function handleHomepageProductChange(index, field, val) {
    const updatedProducts = [...homepage.productsList]
    updatedProducts[index][field] = val
    setHomepage({ ...homepage, productsList: updatedProducts })
  }

  function removeHomepagePoint(index) {
    setHomepage({
      ...homepage,
      aboutPoints: homepage.aboutPoints.filter((_, i) => i !== index)
    })
  }

  async function handleSaveHomepage(e) {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/homepage-settings`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(homepage)
      })
      const data = await res.json()
      if (data.success) {
        setHomepage(data.data)
        alert('Homepage content updated successfully!')
      } else {
        alert(data.message || 'Failed to update homepage content')
      }
    } catch (err) {
      alert('Error updating homepage settings')
    }
  }

  // --- Dealership Handlers ---
  async function handleAddDealership(e) {
    e.preventDefault()
    if (!dealershipForm.name.trim() || !dealershipForm.logoUrl.trim()) return

    try {
      const res = await fetch(`${API_URL}/dealerships`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(dealershipForm)
      })
      const data = await res.json()
      if (data.success) {
        setDealerships([...dealerships, data.data])
        setDealershipForm({ name: '', logoUrl: '' })
        setStats(prev => ({ ...prev, dealerships: prev.dealerships + 1 }))
      } else {
        alert(data.message || 'Failed to add dealership logo')
      }
    } catch (err) {
      alert('Error adding dealership logo')
    }
  }

  async function handleDeleteDealership(id) {
    if (!window.confirm('Are you sure you want to remove this dealership partner?')) return

    try {
      const res = await fetch(`${API_URL}/dealerships/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      })
      const data = await res.json()
      if (data.success) {
        setDealerships(dealerships.filter(item => item._id !== id))
        setStats(prev => ({ ...prev, dealerships: prev.dealerships - 1 }))
      } else {
        alert(data.message || 'Failed to delete dealership')
      }
    } catch (err) {
      alert('Error deleting dealership')
    }
  }

  // --- Custom Filters Handlers ---
  async function handleAddOrUpdateFilter(e) {
    e.preventDefault()
    if (!filterName.trim() || !filterOptionsText.trim()) return

    const options = filterOptionsText.split(',').map(o => o.trim()).filter(Boolean)
    const payload = { name: filterName.trim(), options }

    try {
      if (editingFilter) {
        // Update
        const res = await fetch(`${API_URL}/custom-filters/${editingFilter._id}`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (data.success) {
          setCustomFilters(customFilters.map(f => f._id === editingFilter._id ? data.data : f))
          setFilterName('')
          setFilterOptionsText('')
          setEditingFilter(null)
        } else {
          alert(data.message || 'Failed to update filter')
        }
      } else {
        // Create
        const res = await fetch(`${API_URL}/custom-filters`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (data.success) {
          setCustomFilters([...customFilters, data.data])
          setFilterName('')
          setFilterOptionsText('')
        } else {
          alert(data.message || 'Failed to create filter')
        }
      }
    } catch (err) {
      alert('Error saving filter group')
    }
  }

  function startEditFilter(filter) {
    setEditingFilter(filter)
    setFilterName(filter.name)
    setFilterOptionsText(filter.options.join(', '))
  }

  function cancelEditFilter() {
    setEditingFilter(null)
    setFilterName('')
    setFilterOptionsText('')
  }

  async function handleDeleteFilter(dbId) {
    if (!window.confirm('Are you sure you want to delete this custom specification filter? Products referencing it will retain their values, but it will be removed from the sidebar.')) return

    try {
      const res = await fetch(`${API_URL}/custom-filters/${dbId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      })
      const data = await res.json()
      if (data.success) {
        setCustomFilters(customFilters.filter(f => f._id !== dbId))
      } else {
        alert(data.message || 'Failed to delete filter group')
      }
    } catch (err) {
      alert('Error deleting filter group')
    }
  }

  // --- Highlight Properties CRUD Handlers ---
  async function handleAddOrUpdateBadge(e) {
    e.preventDefault()
    if (!badgeLabel.trim() || !badgeColor.trim()) return

    const payload = { label: badgeLabel.trim(), color: badgeColor.trim() }

    try {
      if (editingBadge) {
        // Update
        const res = await fetch(`${API_URL}/highlight-properties/${editingBadge._id}`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (data.success) {
          setHighlightProperties(highlightProperties.map(b => b._id === editingBadge._id ? data.data : b))
          setBadgeLabel('')
          setBadgeColor('#EF4444')
          setEditingBadge(null)
        } else {
          alert(data.message || 'Failed to update property badge')
        }
      } else {
        // Create
        const res = await fetch(`${API_URL}/highlight-properties`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (data.success) {
          setHighlightProperties([...highlightProperties, data.data])
          setBadgeLabel('')
          setBadgeColor('#EF4444')
        } else {
          alert(data.message || 'Failed to create property badge')
        }
      }
    } catch (err) {
      alert('Error saving property badge')
    }
  }

  function startEditBadge(badge) {
    setEditingBadge(badge)
    setBadgeLabel(badge.label)
    setBadgeColor(badge.color)
  }

  function cancelEditBadge() {
    setEditingBadge(null)
    setBadgeLabel('')
    setBadgeColor('#EF4444')
  }

  async function handleDeleteBadge(dbId) {
    if (!window.confirm('Are you sure you want to delete this special property badge? Products referencing this badge will no longer display it.')) return

    try {
      const res = await fetch(`${API_URL}/highlight-properties/${dbId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      })
      const data = await res.json()
      if (data.success) {
        setHighlightProperties(highlightProperties.filter(b => b._id !== dbId))
      } else {
        alert(data.message || 'Failed to delete property badge')
      }
    } catch (err) {
      alert('Error deleting property badge')
    }
  }

  // --- Gallery Handlers ---
  async function handleAddGalleryItem(e) {
    e.preventDefault()
    if (!galleryForm.title.trim() || !galleryForm.imageUrl.trim()) return

    try {
      const res = await fetch(`${API_URL}/gallery`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(galleryForm)
      })
      const data = await res.json()
      if (data.success) {
        setGallery([data.data, ...gallery])
        setGalleryForm({ title: '', imageUrl: '', description: '' })
        setStats(prev => ({ ...prev, gallery: prev.gallery + 1 }))
      } else {
        alert(data.message || 'Failed to add gallery project')
      }
    } catch (err) {
      alert('Error adding gallery item')
    }
  }

  async function handleDeleteGalleryItem(id) {
    if (!window.confirm('Delete this project gallery photo?')) return

    try {
      const res = await fetch(`${API_URL}/gallery/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      })
      const data = await res.json()
      if (data.success) {
        setGallery(gallery.filter(item => item._id !== id))
        setStats(prev => ({ ...prev, gallery: prev.gallery - 1 }))
      } else {
        alert(data.message || 'Failed to delete gallery item')
      }
    } catch (err) {
      alert('Error deleting gallery item')
    }
  }

  // --- Leads / Inquiry Handlers ---
  async function handleDeleteLead(id) {
    if (!window.confirm('Are you sure you want to delete this lead from the inbox?')) return

    try {
      const res = await fetch(`${API_URL}/quotes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      })
      const data = await res.json()
      if (data.success) {
        setLeads(leads.filter(l => l._id !== id))
        setLeadDetail(null)
        setStats(prev => ({ ...prev, leads: prev.leads - 1 }))
      } else {
        alert(data.message || 'Failed to delete lead')
      }
    } catch (err) {
      alert('Error deleting lead')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center font-sans text-white text-sm">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#0A4FAF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>Loading admin panel dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-gray-200 font-sans flex">
      {/* 1. Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-white/[0.02] flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <img src={logo} alt="ASTTORIA Logo" className="w-8 h-8 object-contain" />
          <div>
            <h1 className="font-extrabold text-sm text-white tracking-wider uppercase">ASTTORIA</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.18em]">Admin Panel</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 space-y-1.5">
          {[
            { id: 'dashboard', label: 'Overview', icon: '📊' },
            { id: 'homepage', label: 'Edit Homepage Copy', icon: '✏️' },
            { id: 'gallery', label: 'Project Gallery', icon: '🖼️' },
            { id: 'dealerships', label: 'Manage Dealerships', icon: '🤝' },
            { id: 'custom-filters', label: 'Custom Specifications', icon: '⚙️' },
            { id: 'special-badges', label: 'Special Properties', icon: '🏷️' },
            { id: 'products', label: 'Manage Products', icon: '🛠️' },
            { id: 'categories', label: 'Filters & Categories', icon: '📂' },
            { id: 'leads', label: 'Customer Leads', icon: '✉️', count: stats.leads }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-[#0A4FAF] text-white shadow-lg shadow-[#0A4FAF]/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="flex-1">{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          <a
            href="/"
            target="_blank"
            className="w-full text-center text-xs py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white rounded-md transition-colors"
          >
            Visit Live Site ↗
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-center text-xs py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-md transition-colors font-bold cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto p-8 lg:p-12 relative max-h-screen">
        {connectionError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8 flex items-start gap-4 shrink-0">
            <span className="text-2xl mt-0.5">⚠️</span>
            <div>
              <h3 className="font-bold text-white text-md">Backend API Server Offline or Unreachable</h3>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                The frontend is attempting to connect to the backend server at <code className="bg-white/5 px-1.5 py-0.5 rounded font-mono text-white text-[11px]">{API_URL}</code>, but the connection was refused. 
                Please verify that your Express backend server is running locally (e.g. on port 3001) and refresh the page. If you recently restarted the dev server, you may also need to clear your browser cache.
              </p>
            </div>
          </div>
        )}
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Overview Dashboard</h2>
              <p className="text-gray-400 mt-2 text-sm">Welcome back. Here is a summary of Asttoria's catalog database and customer quotation requests.</p>
            </div>

            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { title: 'Total Products', value: stats.products, color: 'rgb(10,79,175)', icon: '🛠️' },
                { title: 'Categories', value: stats.categories, color: 'rgb(123,167,232)', icon: '📂' },
                { title: 'Gallery Items', value: stats.gallery, color: 'rgb(37,211,102)', icon: '🖼️' },
                { title: 'Dealerships', value: stats.dealerships || 0, color: 'rgb(139,92,246)', icon: '🤝' },
                { title: 'Quote Inquiries', value: stats.leads, color: 'rgb(239,68,68)', icon: '✉️' }
              ].map(card => (
                <div key={card.title} className="bg-white/[0.02] border border-white/5 p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-2xl">{card.icon}</div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{card.title}</div>
                  <div className="text-4xl font-extrabold text-white mt-4">{card.value}</div>
                  <div className="mt-4 w-10 h-1" style={{ backgroundColor: card.color }}></div>
                </div>
              ))}
            </div>

            {/* Recent inquiries preview */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Recent Customer Quote Inquiries</h3>
                <button onClick={() => setActiveTab('leads')} className="text-xs font-semibold text-[#0A4FAF] hover:text-[#7BA7E8] transition-colors">
                  View All leads →
                </button>
              </div>

              {leads.length > 0 ? (
                <div className="space-y-4">
                  {leads.slice(0, 3).map(lead => (
                    <div key={lead._id} className="p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-lg flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-white">{lead.full_name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {lead.email} · {lead.phone} · Location: {lead.project_location || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300">
                          {lead.contact_method}
                        </span>
                        <button
                          onClick={() => {
                            setLeadDetail(lead)
                            setActiveTab('leads')
                          }}
                          className="text-xs text-[#0A4FAF] hover:underline font-semibold"
                        >
                          View Detail
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 text-sm">
                  No quote inquiries logged yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: HOMEPAGE COPY EDITOR */}
        {activeTab === 'homepage' && homepage && (
          <form onSubmit={handleSaveHomepage} className="space-y-10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Edit Homepage Content</h2>
              <p className="text-gray-400 mt-2 text-sm">Configure Hero layout texts, numbers, stats, and About sections.</p>
            </div>

            {/* Hero Configuration */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-xl space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">1. Hero Showcase Section</h3>
              
              <div>
                <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Background Image URL</label>
                <input
                  type="text"
                  value={homepage.heroBgImage}
                  onChange={(e) => handleHomepageChange('hero', 'heroBgImage', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Main Heading</label>
                <input
                  type="text"
                  value={homepage.heroTitle}
                  onChange={(e) => handleHomepageChange('hero', 'heroTitle', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Subtitle Description</label>
                <textarea
                  rows={3}
                  value={homepage.heroSubtitle}
                  onChange={(e) => handleHomepageChange('hero', 'heroSubtitle', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                />
              </div>

              {/* Hero Stats (4 items) */}
              <div>
                <label className="block text-xs uppercase font-semibold text-gray-400 mb-4">Hero Stat Counters (Fixed to 4 columns)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {homepage.heroStats?.map((stat, i) => (
                    <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-lg space-y-3">
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-semibold">Number ({i+1})</label>
                        <input
                          type="text"
                          value={stat.num}
                          onChange={(e) => handleHomepageStatChange(i, 'num', e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-3 py-2 text-xs rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-semibold">Label ({i+1})</label>
                        <input
                          type="text"
                          value={stat.lbl}
                          onChange={(e) => handleHomepageStatChange(i, 'lbl', e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-3 py-2 text-xs rounded mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About Us Configuration */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-xl space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">2. About Us Section</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Badge Text</label>
                  <input
                    type="text"
                    value={homepage.aboutBadge}
                    onChange={(e) => handleHomepageChange('about', 'aboutBadge', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Featured Image URL</label>
                  <input
                    type="text"
                    value={homepage.aboutImage}
                    onChange={(e) => handleHomepageChange('about', 'aboutImage', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Section Title Text</label>
                <input
                  type="text"
                  value={homepage.aboutTitle}
                  onChange={(e) => handleHomepageChange('about', 'aboutTitle', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">About Description</label>
                <textarea
                  rows={4}
                  value={homepage.aboutDescription}
                  onChange={(e) => handleHomepageChange('about', 'aboutDescription', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                />
              </div>

              {/* Checklist points */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs uppercase font-semibold text-gray-400">Checkbox Highlights list</label>
                  <button
                    type="button"
                    onClick={addHomepagePoint}
                    className="text-xs bg-[#0A4FAF]/20 text-[#7BA7E8] hover:bg-[#0A4FAF]/30 px-3 py-1 rounded font-semibold transition-colors"
                  >
                    + Add Point
                  </button>
                </div>
                <div className="space-y-3">
                  {homepage.aboutPoints?.map((pt, i) => (
                    <div key={i} className="flex gap-3">
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => handleHomepagePointChange(i, e.target.value)}
                        className="flex-1 bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-2.5 text-sm rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeHomepagePoint(i)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3.5 rounded-lg border border-red-500/20 text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Choose Us (Features) Configuration */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-xl space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">3. Why Choose Us Section</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Badge Text</label>
                  <input
                    type="text"
                    value={homepage.featuresBadge ?? ''}
                    onChange={(e) => handleHomepageChange('features', 'featuresBadge', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Section Title Text</label>
                  <input
                    type="text"
                    value={homepage.featuresTitle ?? ''}
                    onChange={(e) => handleHomepageChange('features', 'featuresTitle', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
              </div>

              {/* Grid of features */}
              <div className="space-y-4">
                <label className="block text-xs uppercase font-semibold text-gray-400">Features Checklist (6 features)</label>
                <div className="grid grid-cols-1 gap-4">
                  {homepage.featuresList?.map((feat, i) => (
                    <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-lg grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-semibold">Feature {i+1} Title</label>
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => handleHomepageFeatureChange(i, 'title', e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-3 py-2 text-xs rounded mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-semibold">Feature {i+1} Description</label>
                        <input
                          type="text"
                          value={feat.desc}
                          onChange={(e) => handleHomepageFeatureChange(i, 'desc', e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-3 py-2 text-xs rounded mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Range Section Configuration */}
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-xl space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">4. Product Range Section</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Badge Text</label>
                  <input
                    type="text"
                    value={homepage.productsBadge ?? ''}
                    onChange={(e) => handleHomepageChange('products', 'productsBadge', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Section Title Text</label>
                  <input
                    type="text"
                    value={homepage.productsTitle ?? ''}
                    onChange={(e) => handleHomepageChange('products', 'productsTitle', e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
              </div>

              {/* Grid of product range cards */}
              <div className="space-y-4">
                <label className="block text-xs uppercase font-semibold text-gray-400">Product Range Cards (6 Categories)</label>
                <div className="grid grid-cols-1 gap-4">
                  {homepage.productsList?.map((prod, i) => (
                    <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-lg space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs text-[#7BA7E8] font-bold uppercase">Card #{i+1} ({prod.num} - {prod.id})</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase font-semibold">Title</label>
                          <input
                            type="text"
                            value={prod.title}
                            onChange={(e) => handleHomepageProductChange(i, 'title', e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-3 py-2 text-xs rounded mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 uppercase font-semibold">Image URL</label>
                          <input
                            type="text"
                            value={prod.img}
                            onChange={(e) => handleHomepageProductChange(i, 'img', e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-3 py-2 text-xs rounded mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 uppercase font-semibold">Description</label>
                        <input
                          type="text"
                          value={prod.desc}
                          onChange={(e) => handleHomepageProductChange(i, 'desc', e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-3 py-2 text-xs rounded mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#0A4FAF] hover:bg-[#083D87] text-white font-bold px-8 py-4 rounded-lg shadow-lg shadow-[#0A4FAF]/15 text-sm cursor-pointer"
            >
              Save Homepage Copy changes
            </button>
          </form>
        )}

        {/* TAB 3: PROJECT GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Project Gallery Showcase</h2>
              <p className="text-gray-400 mt-2 text-sm">Add and delete roofing, ceiling, and partition project reference photos shown on the homepage.</p>
            </div>

            {/* Add new item */}
            <form onSubmit={handleAddGalleryItem} className="bg-white/[0.02] border border-white/5 p-8 rounded-xl space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Showcase a New Project</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Project Name / Caption *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. False Ceiling Grid Installation"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.pexels.com/..."
                    value={galleryForm.imageUrl}
                    onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. Completed grid office framework using asttoria channels"
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="bg-[#0A4FAF] hover:bg-[#083D87] text-white font-bold px-6 py-3.5 rounded-lg text-sm shadow-md cursor-pointer"
              >
                Add Project to Gallery
              </button>
            </form>

            {/* List and delete */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Active Projects Grid ({gallery.length})</h3>
              
              {gallery.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map(item => (
                    <div key={item._id} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:border-[#0A4FAF]/45 transition-colors group">
                      <div className="aspect-[4/3] bg-gray-800 relative">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleDeleteGalleryItem(item._id)}
                          className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded shadow-lg transition-colors cursor-pointer text-xs font-bold"
                        >
                          Remove Project
                        </button>
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-white">{item.title}</h4>
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">{item.description || 'No description provided.'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-xl text-gray-500">
                  No projects showcases created. Seed values will fallback or show blank.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCT CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-10">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Product Catalog</h2>
                <p className="text-gray-400 mt-2 text-sm">Add, update, search, and delete Asttoria products catalog.</p>
              </div>
              <button
                onClick={openAddProductModal}
                className="bg-[#0A4FAF] hover:bg-[#083D87] text-white font-bold px-5 py-3 rounded-lg text-sm shadow-md shrink-0 cursor-pointer"
              >
                + Add New Product
              </button>
            </div>

            {/* List products table */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-gray-400">
                      <th className="py-4 px-6">Image</th>
                      <th className="py-4 px-6">Product Details</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Dimensions</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map(p => (
                      <tr key={p._id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 px-6">
                          <img
                            src={p.img || 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=80'}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-md bg-gray-800 border border-white/10"
                          />
                        </td>
                        <td className="py-4 px-6 max-w-xs">
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-xs text-gray-400 mt-1 truncate">{p.short}</div>
                        </td>
                        <td className="py-4 px-6 font-semibold uppercase tracking-wider text-[11px] text-[#7BA7E8]">
                          {categories.find(c => c.id === p.category)?.label || p.category}
                        </td>
                        <td className="py-4 px-6 text-xs">{p.dimensions || 'N/A'}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2.5">
                            <button
                              onClick={() => openEditProductModal(p)}
                              className="text-xs bg-[#0A4FAF]/20 text-[#7BA7E8] hover:bg-[#0A4FAF]/30 px-3 py-1.5 rounded transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PRODUCT ADD / EDIT DIALOG MODAL */}
            {showProductModal && (
              <div className="fixed inset-0 z-50 bg-[#0B1220]/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-3xl bg-[#0F172A] border border-white/10 p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <h3 className="text-xl font-bold text-white">
                      {editingProduct ? `Edit Details: ${editingProduct.name}` : 'Create New Product'}
                    </h3>
                    <button
                      onClick={() => setShowProductModal(false)}
                      className="text-gray-400 hover:text-white text-lg font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-6">
                    {/* Basic Grid */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Category Filter *</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full bg-[#1E293B] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg text-white"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Main Image URL</label>
                        <input
                          type="text"
                          placeholder="https://images.pexels.com/..."
                          value={productForm.img}
                          onChange={(e) => setProductForm({ ...productForm, img: e.target.value })}
                          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Product Dimensions</label>
                        <input
                          type="text"
                          placeholder="e.g. 122 × 35 × 0.45 mm"
                          value={productForm.dimensions}
                          onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Brand and Custom Filters Grid */}
                    <div className="grid md:grid-cols-2 gap-5 border-t border-white/5 pt-5">
                      <div>
                        <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Company / Dealership Brand</label>
                        <select
                          value={productForm.company}
                          onChange={(e) => setProductForm({ ...productForm, company: e.target.value })}
                          className="w-full bg-[#1E293B] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg text-white"
                        >
                          <option value="">No Brand (ASTTORIA)</option>
                          {dealerships.map(d => (
                            <option key={d._id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Brochure PDF URL</label>
                        <input
                          type="text"
                          placeholder="e.g. https://example.com/brochure.pdf"
                          value={productForm.brochureUrl || ''}
                          onChange={(e) => setProductForm({ ...productForm, brochureUrl: e.target.value })}
                          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                        />
                      </div>
                      
                      {customFilters.map((group) => {
                        const currentVals = productForm.customFilters?.find(cf => cf.name === group.name)?.values || []
                        return (
                          <div key={group._id} className="col-span-1 md:col-span-2 space-y-2">
                            <label className="block text-xs uppercase font-semibold text-gray-400">
                              Spec: {group.name}
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-lg max-h-40 overflow-y-auto">
                              {group.options.map(opt => {
                                const checked = currentVals.includes(opt)
                                return (
                                  <label key={opt} className="flex items-center gap-2 text-xs text-gray-300 hover:text-white cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        let updatedVals
                                        if (checked) {
                                          updatedVals = currentVals.filter(v => v !== opt)
                                        } else {
                                          updatedVals = [...currentVals, opt]
                                        }
                                        handleProductCustomFilterChange(group.name, updatedVals)
                                      }}
                                      className="w-4 h-4 rounded-sm border-white/10 text-[#0A4FAF] focus:ring-0 focus:ring-offset-0 bg-[#1E293B] cursor-pointer"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Special Property Badges Checkboxes */}
                    <div className="border-t border-white/5 pt-5">
                      <label className="block text-xs uppercase font-semibold text-gray-400 mb-3">Special Highlight Badges</label>
                      {highlightProperties.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                          {highlightProperties.map(badge => {
                            const isChecked = productForm.highlights?.includes(badge.label) || false
                            return (
                              <label key={badge._id} className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    const current = productForm.highlights || []
                                    const updated = current.includes(badge.label)
                                      ? current.filter(lbl => lbl !== badge.label)
                                      : [...current, badge.label]
                                    setProductForm({ ...productForm, highlights: updated })
                                  }}
                                  className="w-4 h-4 rounded border-white/10 text-[#0A4FAF] focus:ring-[#0A4FAF]/20 bg-white/[0.04]"
                                />
                                <span
                                  style={{ color: isChecked ? badge.color : '#9CA3AF' }}
                                  className="text-xs font-bold font-mono tracking-wide uppercase transition-colors"
                                >
                                  {badge.label}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic">No special properties defined. Create some in the Special Properties tab.</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Short Description *</label>
                      <textarea
                        required
                        rows={2}
                        value={productForm.short}
                        onChange={(e) => setProductForm({ ...productForm, short: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                      />
                    </div>

                    {/* Specifications List */}
                    <div className="border border-white/5 p-5 bg-white/[0.01] rounded-xl space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs uppercase font-semibold text-gray-400">Technical Specifications</label>
                        <button
                          type="button"
                          onClick={addSpecField}
                          className="text-xs bg-[#0A4FAF]/20 text-[#7BA7E8] hover:bg-[#0A4FAF]/30 px-3 py-1 rounded font-semibold transition-colors"
                        >
                          + Add Row
                        </button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {productForm.specs.map((spec, i) => (
                          <div key={i} className="flex gap-3">
                            <input
                              type="text"
                              placeholder="Spec Label (e.g. Material)"
                              value={spec.label}
                              onChange={(e) => handleSpecChange(i, 'label', e.target.value)}
                              className="flex-1 bg-white/[0.04] border border-white/10 outline-none px-3 py-2 text-xs rounded"
                            />
                            <input
                              type="text"
                              placeholder="Value (e.g. Galvanized Steel)"
                              value={spec.value}
                              onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
                              className="flex-1 bg-white/[0.04] border border-white/10 outline-none px-3 py-2 text-xs rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeSpecField(i)}
                              className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/15 text-xs px-2.5 rounded transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Applications & Sizes */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Applications (Comma separated)</label>
                        <span className="text-[10px] text-gray-400">e.g. False ceilings, Office walls, Showrooms</span>
                        <input
                          type="text"
                          value={productForm.applications}
                          onChange={(e) => setProductForm({ ...productForm, applications: e.target.value })}
                          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Available Sizes (Comma separated)</label>
                        <span className="text-[10px] text-gray-400">e.g. 3.0 m, 3.66 m, 4.0 m</span>
                        <input
                          type="text"
                          value={productForm.sizes}
                          onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg mt-1"
                        />
                      </div>
                    </div>

                    {/* Projects Featuring This Product */}
                    <div className="border-t border-white/5 pt-5 space-y-4">
                      <div>
                        <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-400">Projects Featuring This Product</label>
                        <p className="text-[11px] text-gray-400 mt-1">Upload images of projects where this product has been installed.</p>
                      </div>

                      {productForm.projectsUsed && productForm.projectsUsed.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                          {productForm.projectsUsed.map((proj, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-2 rounded-lg relative group">
                              <img src={proj.imageUrl} alt={proj.name} className="w-10 h-10 object-cover rounded" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{proj.name}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = productForm.projectsUsed.filter((_, i) => i !== idx);
                                  setProductForm({ ...productForm, projectsUsed: updated });
                                }}
                                className="p-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition-colors text-xs cursor-pointer font-semibold"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Sub-form to add a project */}
                      <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-3">
                        <div className="text-xs font-bold text-white">Add Project Showcase Item</div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              id="new-project-name"
                              placeholder="Project / Location Name (e.g. Centara Mall)"
                              className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-3 py-2 text-xs rounded"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              id="new-project-image"
                              placeholder="Project Image URL (e.g. https://...)"
                              className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-3 py-2 text-xs rounded"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const nameEl = document.getElementById('new-project-name');
                            const imgEl = document.getElementById('new-project-image');
                            if (nameEl && imgEl && nameEl.value.trim() && imgEl.value.trim()) {
                              const newProj = { name: nameEl.value.trim(), imageUrl: imgEl.value.trim() };
                              setProductForm({
                                ...productForm,
                                projectsUsed: [...(productForm.projectsUsed || []), newProj]
                              });
                              nameEl.value = '';
                              imgEl.value = '';
                            } else {
                              alert('Please provide both a project name and an image URL.');
                            }
                          }}
                          className="w-full py-2 bg-[#0A4FAF]/20 hover:bg-[#0A4FAF]/30 border border-[#0A4FAF]/30 text-[#7BA7E8] text-xs font-bold rounded transition-colors cursor-pointer"
                        >
                          + Add Project to Product Showcase
                        </button>
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowProductModal(false)}
                        className="bg-white/[0.04] hover:bg-white/[0.08] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#0A4FAF] hover:bg-[#083D87] text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all cursor-pointer"
                      >
                        Save Product
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CATEGORIES / FILTERS */}
        {activeTab === 'categories' && (
          <div className="grid md:grid-cols-12 gap-10">
            {/* Create Category */}
            <div className="md:col-span-5 space-y-6">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Manage Filters</h2>
                <p className="text-gray-400 mt-2 text-sm">Add custom product categories which appear as filters on the frontend product catalog page.</p>
              </div>

              <form onSubmit={handleAddCategory} className="bg-white/[0.02] border border-white/5 p-6 rounded-xl space-y-5">
                <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">Add New Filter Category</h3>
                
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Category ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. tiling, rooftop"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Unique slug letters, numbers, and dashes only.</p>
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Filter Display Label *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tiling Solutions"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0A4FAF] hover:bg-[#083D87] text-white font-bold py-3 rounded-lg text-xs tracking-wider uppercase shadow-md transition-colors cursor-pointer"
                >
                  Create Filter Option
                </button>
              </form>
            </div>

            {/* List and delete categories */}
            <div className="md:col-span-7 space-y-6">
              <h3 className="text-xl font-bold text-white">Active Catalog Filters ({categories.length})</h3>
              
              <div className="bg-white/[0.02] border border-white/5 rounded-xl divide-y divide-white/5">
                {categories.map(c => (
                  <div key={c._id} className="p-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-bold text-white">{c.label}</div>
                      <div className="text-xs text-gray-500 mt-1">Slug ID: <span className="font-semibold text-gray-400">{c.id}</span></div>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(c._id, c.id)}
                      className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3.5 py-1.5 rounded-lg border border-red-500/15 font-semibold transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5.5: MANAGE DEALERSHIPS */}
        {activeTab === 'dealerships' && (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Dealership Partners</h2>
              <p className="text-gray-400 mt-2 text-sm">Add and delete logos of companies you have dealership or partnership with.</p>
            </div>

            {/* Add new dealership */}
            <form onSubmit={handleAddDealership} className="bg-white/[0.02] border border-white/5 p-8 rounded-xl space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Register a Dealership Partner</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Company/Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saint-Gobain Gyproc"
                    value={dealershipForm.name}
                    onChange={(e) => setDealershipForm({ ...dealershipForm, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Logo Image URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://placehold.co/200x80/..."
                    value={dealershipForm.logoUrl}
                    onChange={(e) => setDealershipForm({ ...dealershipForm, logoUrl: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#0A4FAF] hover:bg-[#083D87] text-white font-bold px-6 py-3.5 rounded-lg text-sm shadow-md cursor-pointer"
              >
                Add Dealership Logo
              </button>
            </form>

            {/* List and delete */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Dealership Partners List ({dealerships.length})</h3>
              
              {dealerships.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {dealerships.map(partner => (
                    <div key={partner._id} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:border-[#0A4FAF]/45 transition-all p-5 flex flex-col items-center relative group">
                      <button
                        onClick={() => handleDeleteDealership(partner._id)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors cursor-pointer text-[10px] font-bold"
                      >
                        Remove
                      </button>
                      <div className="w-full h-16 flex items-center justify-center overflow-hidden bg-white/5 rounded p-2">
                        <img src={partner.logoUrl} alt={partner.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="text-xs font-bold text-white mt-3 text-center truncate w-full">
                        {partner.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-xl text-gray-500">
                  No dealership partners registered. Fallback to default brands.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: CUSTOM SPECIFICATIONS FILTERS */}
        {activeTab === 'custom-filters' && (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Custom Specifications Filters</h2>
              <p className="text-gray-400 mt-2 text-sm">Create, edit, and delete custom filter groups (like Thickness, Finish, Type) and define their options. These filters will appear on the Products page sidebar.</p>
            </div>

            {/* Add/Edit Form */}
            <form onSubmit={handleAddOrUpdateFilter} className="bg-white/[0.02] border border-white/5 p-8 rounded-xl space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">
                {editingFilter ? 'Edit Specification Filter Group' : 'Create New Specification Filter Group'}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Filter Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thickness, Material Finish, Type"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Options (Comma separated) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0.50 mm, 0.55 mm, 0.60 mm"
                    value={filterOptionsText}
                    onChange={(e) => setFilterOptionsText(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#0A4FAF] hover:bg-[#083D87] text-white font-bold px-6 py-3 rounded-lg shadow-lg shadow-[#0A4FAF]/15 text-sm cursor-pointer"
                >
                  {editingFilter ? 'Update Filter Group' : 'Add Filter Group'}
                </button>
                {editingFilter && (
                  <button
                    type="button"
                    onClick={cancelEditFilter}
                    className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-lg text-sm cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Active Custom Specifications ({customFilters.length})</h3>

              {customFilters.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {customFilters.map(filter => (
                    <div key={filter._id} className="bg-white/[0.02] border border-white/5 p-6 rounded-xl space-y-4 relative group">
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => startEditFilter(filter)}
                          className="bg-[#0A4FAF]/20 text-[#7BA7E8] hover:bg-[#0A4FAF]/30 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFilter(filter._id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2.5 py-1 rounded text-xs font-semibold border border-red-500/20 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>

                      <div>
                        <h4 className="text-md font-bold text-white">{filter.name}</h4>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {filter.options.map(opt => (
                            <span key={opt} className="bg-white/[0.04] border border-white/10 text-white/80 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                              {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-xl text-gray-500">
                  No custom specifications filters defined yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'special-badges' && (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Special Property Badges</h2>
              <p className="text-gray-400 mt-2 text-sm">Define highlighted product properties (like Heat Resistant, Rust Proof, Fire Rated) and specify unique color codes for each. These badges will render as highlighted pills when a product is clicked.</p>
            </div>

            {/* Add/Edit Form */}
            <form onSubmit={handleAddOrUpdateBadge} className="bg-white/[0.02] border border-white/5 p-8 rounded-xl space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">
                {editingBadge ? 'Edit Special Property Badge' : 'Create New Special Property Badge'}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Badge Name / Label *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heat Resistant, Impact Resistant, Soundproof"
                    value={badgeLabel}
                    onChange={(e) => setBadgeLabel(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-2">Badge Color Code *</label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      required
                      value={badgeColor}
                      onChange={(e) => setBadgeColor(e.target.value)}
                      className="w-12 h-11 bg-white/[0.04] border border-white/10 rounded-lg cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      required
                      placeholder="e.g. #EF4444"
                      value={badgeColor}
                      onChange={(e) => setBadgeColor(e.target.value)}
                      className="flex-1 bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] outline-none px-4 py-3 text-sm rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#0A4FAF] hover:bg-[#083D87] text-white font-bold px-6 py-3 rounded-lg shadow-lg shadow-[#0A4FAF]/15 text-sm cursor-pointer"
                >
                  {editingBadge ? 'Update Badge' : 'Add Property Badge'}
                </button>
                {editingBadge && (
                  <button
                    type="button"
                    onClick={cancelEditBadge}
                    className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-lg text-sm cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Active Special Badges ({highlightProperties.length})</h3>

              {highlightProperties.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {highlightProperties.map(badge => (
                    <div key={badge._id} className="bg-white/[0.02] border border-white/5 p-6 rounded-xl space-y-4 relative group flex flex-col justify-between">
                      <div className="absolute top-4 right-4 flex gap-1.5">
                        <button
                          onClick={() => startEditBadge(badge)}
                          className="bg-[#0A4FAF]/20 text-[#7BA7E8] hover:bg-[#0A4FAF]/30 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBadge(badge._id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-semibold border border-red-500/20 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="space-y-3 pt-2">
                        <span
                          style={{ backgroundColor: `${badge.color}15`, color: badge.color, borderColor: `${badge.color}30` }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-bold uppercase tracking-wider rounded-full animate-none"
                        >
                          <span style={{ backgroundColor: badge.color }} className="w-1.5 h-1.5 rounded-full" />
                          {badge.label}
                        </span>
                        <div className="text-xs text-gray-500 font-mono">
                          Color: {badge.color}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-xl text-gray-500">
                  No special properties badges defined yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: CUSTOMER LEADS / INQUIRIES INBOX */}
        {activeTab === 'leads' && (
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Leads Inbox</h2>
              <p className="text-gray-400 mt-2 text-sm">Review submitted quotation inquiries and requirements submitted from your website's contact form.</p>
            </div>

            <div className="grid md:grid-cols-12 gap-8 items-start">
              {/* Inbox List */}
              <div className="md:col-span-6 space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Quotation Requests ({leads.length})</h3>

                {leads.length > 0 ? (
                  <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
                    {leads.map(lead => {
                      const isActive = leadDetail?._id === lead._id
                      const dateStr = new Date(lead.createdAt).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })
                      return (
                        <button
                          key={lead._id}
                          onClick={() => setLeadDetail(lead)}
                          className={`w-full p-5 border text-left rounded-xl transition-all block ${
                            isActive
                              ? 'bg-white/[0.04] border-[#0A4FAF] shadow-lg shadow-[#0A4FAF]/5'
                              : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-3">
                            <span className="font-bold text-white text-base">{lead.full_name}</span>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">{dateStr}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1 truncate">{lead.company_name || 'Individual'} · {lead.phone}</div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                              {lead.contact_method}
                            </span>
                            {lead.products_required.slice(0, 2).map((p, idx) => (
                              <span key={idx} className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded bg-[#0A4FAF]/10 text-[#7BA7E8]">
                                {p}
                              </span>
                            ))}
                            {lead.products_required.length > 2 && (
                              <span className="text-[9px] font-extrabold text-gray-500">+{lead.products_required.length - 2} more</span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-xl text-gray-500">
                    Your Leads inbox is currently empty.
                  </div>
                )}
              </div>

              {/* Inquiry Detail View */}
              <div className="md:col-span-6 bg-white/[0.02] border border-white/5 rounded-xl p-6 md:p-8 min-h-[450px]">
                {leadDetail ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start border-b border-white/5 pb-4 gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-white">{leadDetail.full_name}</h4>
                        <p className="text-sm text-gray-400 mt-1">{leadDetail.company_name || 'Individual Client'}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteLead(leadDetail._id)}
                        className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/15 text-xs px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
                      >
                        Delete Inquiry
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="text-gray-400 uppercase font-semibold">Phone</div>
                        <a href={`tel:${leadDetail.phone}`} className="text-[#7BA7E8] font-bold mt-1 block hover:underline">{leadDetail.phone}</a>
                      </div>
                      <div>
                        <div className="text-gray-400 uppercase font-semibold">Email</div>
                        <a href={`mailto:${leadDetail.email}`} className="text-[#7BA7E8] font-bold mt-1 block hover:underline">{leadDetail.email}</a>
                      </div>
                      <div>
                        <div className="text-gray-400 uppercase font-semibold">Project Location</div>
                        <div className="text-white mt-1">{leadDetail.project_location || 'Not Specified'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 uppercase font-semibold">Contact Preference</div>
                        <div className="text-white font-bold mt-1">{leadDetail.contact_method}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400 uppercase font-semibold mb-2">Requested Products</div>
                      <div className="flex flex-wrap gap-2">
                        {leadDetail.products_required.map((p, idx) => (
                          <span key={idx} className="text-xs bg-[#0A4FAF]/20 text-[#7BA7E8] px-3 py-1 rounded border border-[#0A4FAF]/30 font-semibold">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-400 uppercase font-semibold">Estimated Quantity</div>
                        <div className="text-white text-sm font-semibold mt-1.5">{leadDetail.quantity_required || 'Not Specified'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 uppercase font-semibold">Submission Date</div>
                        <div className="text-white text-xs mt-1.5">
                          {new Date(leadDetail.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400 uppercase font-semibold mb-2">Additional Specifications / Requirements</div>
                      <div className="bg-white/[0.03] border border-white/10 p-4 rounded-lg text-sm text-gray-200 leading-relaxed max-h-48 overflow-y-auto">
                        {leadDetail.additional_requirements || 'No additional details provided by the client.'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm py-20 text-center space-y-3">
                    <span>✉️</span>
                    <span>Select an inquiry from the list to view detailed requirements.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
