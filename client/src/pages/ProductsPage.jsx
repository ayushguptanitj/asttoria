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
  const rawCat = searchParams.get('cat')
  const initialCats = rawCat ? rawCat.split(',').filter(Boolean) : []
  const rawCompany = searchParams.get('company')
  const initialCompanies = rawCompany ? rawCompany.split(',').filter(Boolean) : []

  const [selectedCategories, setSelectedCategories] = useState(initialCats)
  const [selectedCompanies, setSelectedCompanies] = useState(initialCompanies)
  const [selectedProperties, setSelectedProperties] = useState([])
  const [selectedFilters, setSelectedFilters] = useState({})
  
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  const [productsList, setProductsList] = useState([])
  const [categoriesList, setCategoriesList] = useState([{ id: 'all', label: 'All Products' }])
  const [dealershipsList, setDealershipsList] = useState([])
  const [customFiltersList, setCustomFiltersList] = useState([])
  const [highlightProperties, setHighlightProperties] = useState([])

  useEffect(() => {
    fetchProductsAndCategories()
  }, [])

  // Update selected categories and brands if query params change (e.g. homepage brand logo click redirect)
  useEffect(() => {
    const compQ = searchParams.get('company')
    setSelectedCompanies(compQ ? compQ.split(',').filter(Boolean) : [])
    const catQ = searchParams.get('cat')
    setSelectedCategories(catQ ? catQ.split(',').filter(Boolean) : [])
  }, [searchParams])

  async function fetchProductsAndCategories() {
    try {
      const [prodRes, catRes, dealerRes, filterRes, highlightRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/dealerships`),
        fetch(`${API_URL}/custom-filters`),
        fetch(`${API_URL}/highlight-properties`)
      ])

      if (prodRes.ok && catRes.ok && dealerRes.ok && filterRes.ok && highlightRes.ok) {
        const prodData = await prodRes.json()
        const catData = await catRes.json()
        const dealerData = await dealerRes.json()
        const filterData = await filterRes.json()
        const highlightData = await highlightRes.json()

        setProductsList(prodData)
        setCategoriesList([{ id: 'all', label: 'All Products' }, ...catData])
        setDealershipsList(dealerData)
        setCustomFiltersList(filterData)
        setHighlightProperties(highlightData)
      } else {
        throw new Error('API request failed')
      }
    } catch (e) {
      console.warn('API server unreachable. Falling back to local data files.')
      setProductsList(PRODUCTS)
      setCategoriesList(CATEGORIES)
    }
  }

  const filtered = useMemo(() => {
    let list = productsList
    
    // Category filter (multi-select)
    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.category))
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

    // Company / Brand filter (multi-select)
    if (selectedCompanies.length > 0) {
      list = list.filter((p) => {
        if (selectedCompanies.includes('ASTTORIA') && (!p.company || p.company === '')) {
          return true
        }
        return selectedCompanies.includes(p.company)
      })
    }

    // Special Highlight Property filter (multi-select - UNION logic)
    if (selectedProperties.length > 0) {
      list = list.filter((p) =>
        selectedProperties.some((prop) => p.highlights?.includes(prop))
      )
    }

    // Custom Filters (multi-value specification checks)
    Object.keys(selectedFilters).forEach((groupName) => {
      const checkedOptions = selectedFilters[groupName] || []
      if (checkedOptions.length > 0) {
        list = list.filter((p) => {
          const matchingVals = p.customFilters?.find((cf) => cf.name === groupName)?.values || []
          return checkedOptions.some((opt) => matchingVals.includes(opt))
        })
      }
    })

    return list
  }, [selectedCategories, search, selectedCompanies, selectedProperties, selectedFilters, productsList])

  function handleCategoryToggle(id) {
    if (id === 'all') {
      setSelectedCategories([])
      setSearchParams((sp) => {
        sp.delete('cat')
        return sp
      })
      return
    }
    setSelectedCategories((prev) => {
      const next = prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id]
      setSearchParams((sp) => {
        if (next.length === 0) sp.delete('cat')
        else sp.set('cat', next.join(','))
        return sp
      })
      return next
    })
  }

  function handleCompanyToggle(brandName) {
    if (brandName === 'All Brands') {
      setSelectedCompanies([])
      setSearchParams((sp) => {
        sp.delete('company')
        return sp
      })
      return
    }
    setSelectedCompanies((prev) => {
      const next = prev.includes(brandName)
        ? prev.filter((c) => c !== brandName)
        : [...prev, brandName]
      setSearchParams((sp) => {
        if (next.length === 0) sp.delete('company')
        else sp.set('company', next.join(','))
        return sp
      })
      return next
    })
  }

  function handlePropertyToggle(label) {
    if (label === 'All Properties') {
      setSelectedProperties([])
      return
    }
    setSelectedProperties((prev) => {
      return prev.includes(label)
        ? prev.filter((p) => p !== label)
        : [...prev, label]
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
          highlightProperties={highlightProperties}
        />
      )}

      {/* ── Page Header ── */}
      <section className="bg-[#0B1220] text-white py-16 lg:py-24 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(10,79,175,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#7BA7E8] font-bold">
              Catalogue
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mt-4 leading-none">
              Our <span className="text-[#7BA7E8]">Product</span> Range
            </h1>
            <p className="mt-6 text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
              Engineered for structural integrity and high-performance safety. Discover our complete catalog of certified ceiling sections, partition frameworks, and insulation systems, manufactured to custom spans and international standards.
            </p>
          </div>

          {/* Search */}
          <div className="mt-10 max-w-xl">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true"
              >
                <path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />
              </svg>
              <input
                data-testid="products-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name, spec or material…"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:bg-white/10 focus:border-[#7BA7E8] focus:ring-2 focus:ring-[#7BA7E8]/20 outline-none pl-11 pr-4 py-3.5 text-sm rounded-sm transition-all shadow-md"
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
            const active = (brand === 'All Brands' && selectedCompanies.length === 0) || selectedCompanies.includes(brand)
            return (
              <button
                key={brand}
                onClick={() => handleCompanyToggle(brand)}
                className={`px-4 py-2 text-xs font-semibold rounded-sm border transition-all cursor-pointer ${
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

      {/* ── Properties Filter Bar ── */}
      <section className="bg-white border-b border-[#E5E7EB] py-5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-[#4B5563] font-bold mr-2">Properties:</span>
          {['All Properties', ...highlightProperties.map(h => h.label)].map((prop) => {
            const active = (prop === 'All Properties' && selectedProperties.length === 0) || selectedProperties.includes(prop)
            const match = highlightProperties.find(h => h.label === prop)
            const badgeColor = match?.color || '#0A4FAF'
            return (
              <button
                key={prop}
                onClick={() => handlePropertyToggle(prop)}
                style={active ? { backgroundColor: badgeColor, color: '#ffffff', borderColor: badgeColor } : {}}
                className={`px-4 py-2 text-xs font-semibold rounded-sm border transition-all cursor-pointer ${
                  active
                    ? 'text-white'
                    : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-gray-400 hover:text-[#111827]'
                }`}
              >
                {prop}
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
              const active = (c.id === 'all' && selectedCategories.length === 0) || selectedCategories.includes(c.id)
              return (
                <button
                  key={c.id}
                  data-testid={`filter-${c.id}`}
                  onClick={() => handleCategoryToggle(c.id)}
                  className={`whitespace-nowrap text-sm font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer ${
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
             <aside className="lg:col-span-1 bg-[#F9FAFB] border border-[#E5E7EB] p-6 rounded-sm space-y-8 sticky top-36 hidden lg:block max-h-[calc(100vh-10rem)] overflow-y-auto pr-3">
              <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Filters</h3>
                <button
                  onClick={() => {
                    setSelectedFilters({})
                    setSelectedCategories([])
                    setSelectedCompanies([])
                    setSelectedProperties([])
                    setSearchParams((sp) => {
                      sp.delete('cat')
                      sp.delete('company')
                      return sp
                    })
                  }}
                  className="text-xs text-[#0A4FAF] hover:underline font-semibold cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Custom Specs */}
              {customFiltersList.length > 0 && (
                <div className="space-y-6">
                  {customFiltersList.map((group) => (
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
                                className="w-4 h-4 rounded-sm border-[#E5E7EB] text-[#0A4FAF] focus:ring-[#0A4FAF] cursor-pointer"
                              />
                              <span className={checked ? 'text-[#111827] font-semibold' : ''}>{opt}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
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
                  {/* Category Dropdown */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleCategoryToggle(e.target.value)
                        e.target.value = ""
                      }
                    }}
                    className="bg-white border border-[#E5E7EB] text-xs font-semibold px-2 py-1.5 rounded-sm"
                  >
                    <option value="">Categories...</option>
                    {categoriesList.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} {selectedCategories.includes(c.id) ? '✓' : ''}
                      </option>
                    ))}
                  </select>

                  {/* Brand Dropdown */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleCompanyToggle(e.target.value)
                        e.target.value = ""
                      }
                    }}
                    className="bg-white border border-[#E5E7EB] text-xs font-semibold px-2 py-1.5 rounded-sm"
                  >
                    <option value="">Brands...</option>
                    <option value="ASTTORIA">ASTTORIA {selectedCompanies.includes('ASTTORIA') ? '✓' : ''}</option>
                    {dealershipsList.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} {selectedCompanies.includes(d.name) ? '✓' : ''}
                      </option>
                    ))}
                  </select>

                  {/* Properties Dropdown */}
                  {highlightProperties.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handlePropertyToggle(e.target.value)
                          e.target.value = ""
                        }
                      }}
                      className="bg-white border border-[#E5E7EB] text-xs font-semibold px-2 py-1.5 rounded-sm"
                    >
                      <option value="">Properties...</option>
                      {highlightProperties.map((hp) => (
                        <option key={hp.label} value={hp.label}>
                          {hp.label} {selectedProperties.includes(hp.label) ? '✓' : ''}
                        </option>
                      ))}
                    </select>
                  )}

                  {customFiltersList.map((group) => (
                    <div key={group._id} className="relative inline-block text-left">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleFilterToggle(group.name, e.target.value)
                            e.target.value = ""
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
                  {(selectedCategories.length > 0 || selectedCompanies.length > 0 || selectedProperties.length > 0 || Object.values(selectedFilters).some(arr => arr.length > 0)) && (
                    <button
                      onClick={() => {
                        setSelectedFilters({})
                        setSelectedCategories([])
                        setSelectedCompanies([])
                        setSelectedProperties([])
                        setSearchParams((sp) => {
                          sp.delete('cat')
                          sp.delete('company')
                          return sp
                        })
                      }}
                      className="text-xs text-[#0A4FAF] font-bold border border-[#0A4FAF]/20 px-2.5 py-1.5 rounded-sm cursor-pointer"
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
