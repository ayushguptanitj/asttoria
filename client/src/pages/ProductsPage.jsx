import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES, PRODUCTS } from '../data/products'
import ProductDrawer from '../components/ProductDrawer'
import { API_URL } from '../config'

const ArrowUpRight = ({ className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M7 7h10v10" /><path d="M7 17 17 7" />
  </svg>
)

function ProductCard({ product, onOpen }) {
  return (
    <button
      type="button"
      data-testid={`product-card-${product.id}`}
      onClick={() => onOpen(product)}
      className="group text-left bg-white border border-[#E5E7EB] hover:border-[#0A4FAF] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-12px_rgba(10,79,175,0.18)] focus:outline-none focus:ring-2 focus:ring-[#0A4FAF] rounded-sm overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F4F6]">
        <img
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={product.img || 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=800'}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#0A4FAF] font-semibold">
          {product.category}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="text-[10px] uppercase tracking-wider text-[#4B5563] font-semibold mb-1">
          {product.company || 'ASTTORIA'}
        </div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base md:text-lg font-bold text-[#111827] leading-snug">
            {product.name}
          </h3>
          <ArrowUpRight className="text-[#4B5563] group-hover:text-[#0A4FAF] group-hover:rotate-45 transition-all shrink-0" />
        </div>
        <p className="mt-2 text-sm text-[#4B5563] leading-relaxed line-clamp-2">
          {product.short}
        </p>
        <div className="mt-4 inline-flex items-center text-xs font-semibold text-[#0A4FAF] uppercase tracking-[0.15em]">
          View Specs
        </div>
      </div>
    </button>
  )
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCat = searchParams.get('cat') || 'all'
  const initialCompany = searchParams.get('company') || 'All Brands'

  const [activeCategory, setActiveCategory] = useState(initialCat)
  const [selectedCompany, setSelectedCompany] = useState(initialCompany)
  const [selectedFilters, setSelectedFilters] = useState({})
  
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  const [productsList, setProductsList] = useState([])
  const [categoriesList, setCategoriesList] = useState([{ id: 'all', label: 'All Products' }])
  const [dealershipsList, setDealershipsList] = useState([])
  const [customFiltersList, setCustomFiltersList] = useState([])

  useEffect(() => {
    fetchProductsAndCategories()
  }, [])

  // Update selected company if search query param changes (e.g. logo clicked)
  useEffect(() => {
    const companyQuery = searchParams.get('company') || 'All Brands'
    setSelectedCompany(companyQuery)
  }, [searchParams])

  async function fetchProductsAndCategories() {
    try {
      const [prodRes, catRes, dealerRes, filterRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/dealerships`),
        fetch(`${API_URL}/custom-filters`)
      ])

      let prods = PRODUCTS
      let cats = CATEGORIES
      let dealers = []
      let filters = []

      if (prodRes.ok) prods = await prodRes.json()
      if (catRes.ok) cats = await catRes.json()
      if (dealerRes.ok) dealers = await dealerRes.json()
      if (filterRes.ok) filters = await filterRes.json()

      setProductsList(prods)
      setCategoriesList([{ id: 'all', label: 'All Products' }, ...cats])
      setDealershipsList(dealers)
      setCustomFiltersList(filters)
    } catch (error) {
      console.warn('API server unreachable. Falling back to local data files.')
      setProductsList(PRODUCTS)
      setCategoriesList(CATEGORIES)
    }
  }

  const filtered = useMemo(() => {
    let list = productsList
    
    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory)
    }
    
    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q))
      )
    }

    // Company / Brand filter
    if (selectedCompany !== 'All Brands') {
      list = list.filter((p) => p.company === selectedCompany)
    }

    // Custom Filters
    Object.keys(selectedFilters).forEach((groupName) => {
      const checkedOptions = selectedFilters[groupName] || []
      if (checkedOptions.length > 0) {
        list = list.filter((p) => {
          const matchingVal = p.customFilters?.find((cf) => cf.name === groupName)?.value
          return checkedOptions.includes(matchingVal)
        })
      }
    })

    return list
  }, [activeCategory, search, selectedCompany, selectedFilters, productsList])

  function handleCategory(id) {
    setActiveCategory(id)
    setSearchParams((prev) => {
      if (id === 'all') prev.delete('cat')
      else prev.set('cat', id)
      return prev
    })
  }

  function handleFilterToggle(groupName, value) {
    setSelectedFilters((prev) => {
      const current = prev[groupName] || []
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [groupName]: updated }
    })
  }

  return (
    <div data-testid="products-page">
      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* ── Page Header ── */}
      <section className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.2em] text-[#0A4FAF] font-semibold">
              Catalogue
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] mt-3 leading-[1.05]">
              Our <span className="text-[#0A4FAF]">Product</span> Range
            </h1>
            <p className="mt-5 text-[#4B5563] text-base md:text-lg leading-relaxed">
              Industrial-grade ceiling, partition, insulation and T-grid products
              manufactured to exact specifications.
            </p>
          </div>

          {/* Search */}
          <div className="mt-10 max-w-xl">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4B5563]" aria-hidden="true"
              >
                <path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />
              </svg>
              <input
                data-testid="products-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name, spec or material…"
                className="w-full bg-white border border-[#E5E7EB] focus:border-[#0A4FAF] focus:ring-2 focus:ring-[#0A4FAF]/20 outline-none pl-11 pr-4 py-3.5 text-sm rounded-sm transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Filter Bar ── */}
      <section className="bg-white border-b border-[#E5E7EB] py-5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-[#4B5563] font-bold mr-2">Brand:</span>
          {['All Brands', ...dealershipsList.map((d) => d.name)].map((brand) => {
            const active = selectedCompany === brand
            return (
              <button
                key={brand}
                onClick={() => {
                  setSelectedCompany(brand)
                  setSearchParams((prev) => {
                    if (brand === 'All Brands') prev.delete('company')
                    else prev.set('company', brand)
                    return prev
                  })
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-sm border transition-all ${
                  active
                    ? 'bg-[#0A4FAF] text-white border-[#0A4FAF]'
                    : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-[#0A4FAF] hover:text-[#0A4FAF]'
                }`}
              >
                {brand}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Sticky Category Filter Bar ── */}
      <section className="sticky top-16 md:top-20 z-30 bg-white/85 backdrop-blur-xl border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div
            data-testid="category-filters"
            className="flex gap-2 overflow-x-auto py-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {categoriesList.map((c) => {
              const active = activeCategory === c.id
              return (
                <button
                  key={c.id}
                  data-testid={`filter-${c.id}`}
                  onClick={() => handleCategory(c.id)}
                  className={`whitespace-nowrap text-sm font-semibold px-4 py-2 rounded-full border transition-all ${
                    active
                      ? 'bg-[#0A4FAF] text-white border-[#0A4FAF]'
                      : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-[#0A4FAF] hover:text-[#0A4FAF]'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Main Products Content (Sidebar + Grid) ── */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
            
            {/* Left Column: Filters Sidebar */}
            <aside className="lg:col-span-1 bg-[#F9FAFB] border border-[#E5E7EB] p-6 rounded-sm space-y-8 sticky top-36 hidden lg:block">
              <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Filters</h3>
                <button
                  onClick={() => setSelectedFilters({})}
                  className="text-xs text-[#0A4FAF] hover:underline font-semibold"
                >
                  Clear All
                </button>
              </div>

              {customFiltersList.length > 0 ? (
                customFiltersList.map((group) => (
                  <div key={group._id} className="space-y-3">
                    <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#4B5563]">
                      {group.name}
                    </h4>
                    <div className="space-y-2">
                      {group.options.map((opt) => {
                        const checked = selectedFilters[group.name]?.includes(opt) || false
                        return (
                          <label key={opt} className="flex items-center gap-3 cursor-pointer group text-sm text-[#4B5563] hover:text-[#111827]">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleFilterToggle(group.name, opt)}
                              className="w-4 h-4 rounded-sm border-[#E5E7EB] text-[#0A4FAF] focus:ring-[#0A4FAF]"
                            />
                            <span className={checked ? 'text-[#111827] font-semibold' : ''}>{opt}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#4B5563] italic">No specifications filters defined.</p>
              )}
            </aside>

            {/* Right Column: Cards Grid */}
            <div className="lg:col-span-3">
              {/* Result count & Clear Active Mobile Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="text-sm text-[#4B5563]" data-testid="result-count">
                  Showing{' '}
                  <span className="text-[#111827] font-semibold">{filtered.length}</span>{' '}
                  products
                </div>

                {/* Mobile Filters Trigger (Horizontal scroll on mobile) */}
                <div className="lg:hidden flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-[#4B5563] font-bold">Specs:</span>
                  {customFiltersList.map((group) => (
                    <div key={group._id} className="relative inline-block text-left">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleFilterToggle(group.name, e.target.value)
                            e.target.value = "" // Reset select value to allow subsequent clicks
                          }
                        }}
                        className="bg-white border border-[#E5E7EB] text-xs font-semibold px-2 py-1.5 rounded-sm"
                      >
                        <option value="">{group.name}...</option>
                        {group.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt} {selectedFilters[group.name]?.includes(opt) ? '✓' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  {Object.values(selectedFilters).some(arr => arr.length > 0) && (
                    <button
                      onClick={() => setSelectedFilters({})}
                      className="text-xs text-[#0A4FAF] font-bold border border-[#0A4FAF]/20 px-2.5 py-1.5 rounded-sm"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Cards */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((product) => (
                    <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 text-[#4B5563]">
                  <p className="text-lg font-semibold text-[#111827]">No products found</p>
                  <p className="mt-2 text-sm">Try a different search term, company or category.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
