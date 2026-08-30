import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const DURATION = 280 // ms — keep in sync with CSS transitions

export default function ProductDrawer({ product, onClose, highlightProperties = [] }) {
  // `visible` drives the fade-in / zoom-in animation state
  const [visible, setVisible] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(null)

  // Construct image slideshow list (main image + project showcase images)
  const slides = product
    ? [
        { name: product.name, url: product.img || 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=800' },
        ...(product.projectsUsed || []).map(p => ({ name: p.name, url: p.imageUrl }))
      ]
    : []

  // Trigger enter animation on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Close: play fade-out / zoom-out, then call onClose
  function handleClose() {
    setVisible(false)
    setTimeout(onClose, DURATION)
  }

  // Combined Keyboard event listeners (Escape to close, Arrows to navigate)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (activeImageIndex !== null) {
          setActiveImageIndex(null)
        } else {
          handleClose()
        }
      } else if (activeImageIndex !== null) {
        if (e.key === 'ArrowRight') {
          setActiveImageIndex((prev) => (prev + 1) % slides.length)
        } else if (e.key === 'ArrowLeft') {
          setActiveImageIndex((prev) => (prev - 1 + slides.length) % slides.length)
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeImageIndex, slides.length])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!product) return null

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        style={{
          transition: `opacity ${DURATION}ms ease`,
          opacity: visible ? 1 : 0,
        }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />

      {/* ── Centred Modal Wrapper ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
        {/* Modal Container */}
        <div
          role="dialog"
          aria-labelledby="drawer-title"
          aria-describedby="drawer-desc"
          data-testid="product-drawer"
          style={{
            transition: `opacity ${DURATION}ms ease, transform ${DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
            transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(12px)',
            opacity: visible ? 1 : 0,
          }}
          className="pointer-events-auto bg-white border border-[#E5E7EB] w-full max-w-4xl max-h-[85vh] md:max-h-[80vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative rounded-sm"
        >
          {/* Left: Image Column */}
          <div className="w-full md:w-5/12 bg-[#F3F4F6] relative flex flex-col justify-between overflow-hidden">
            <div className="w-full h-48 md:h-full relative overflow-hidden group cursor-zoom-in" onClick={() => setActiveImageIndex(0)}>
              <img
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src={product.img || 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=800'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Category tag */}
              <div className="absolute top-4 left-4 bg-white/95 text-[#0A4FAF] text-[10px] uppercase tracking-[0.18em] font-bold px-2.5 py-0.5 shadow-sm">
                {product.category}
              </div>
            </div>
          </div>

          {/* Right: Content Column */}
          <div className="w-full md:w-7/12 flex flex-col justify-between max-h-[85vh] md:max-h-[80vh] overflow-y-auto">
            
            {/* Header / Info block */}
            <div className="p-6 md:p-8 pb-4 relative">
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-sm p-1 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#0A4FAF] cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>

              {/* Brand Label */}
              <div className="text-[10px] uppercase tracking-wider text-[#4B5563] font-bold">
                {product.company || 'ASTTORIA'}
              </div>
              <h2 id="drawer-title" className="text-xl md:text-2xl font-black tracking-tight text-[#111827] mt-1.5 leading-snug">
                {product.name}
              </h2>

              {/* Dynamic Highlight Badges */}
              {product.highlights?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3.5">
                  {product.highlights.map((lbl) => {
                    const match = highlightProperties.find(hp => hp.label === lbl)
                    const color = match?.color || '#0A4FAF'
                    return (
                      <span
                        key={lbl}
                        style={{ backgroundColor: `${color}12`, color, borderColor: `${color}25` }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 border text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm"
                      >
                        <span style={{ backgroundColor: color }} className="w-1.5 h-1.5 rounded-full" />
                        {lbl}
                      </span>
                    )
                  })}
                </div>
              )}

              <p id="drawer-desc" className="mt-3.5 text-xs md:text-sm text-[#4B5563] leading-relaxed">
                {product.short}
              </p>

              {/* Dimensions */}
              {product.dimensions && (
                <div className="mt-4 inline-flex items-center gap-2 border border-[#0A4FAF]/20 bg-[#0A4FAF]/5 px-3 py-1.5 rounded-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#0A4FAF]">Dimensions:</span>
                  <span className="text-xs font-mono font-bold text-[#111827]">{product.dimensions}</span>
                </div>
              )}
            </div>

            {/* Specifications & Details Block */}
            <div className="px-6 md:px-8 pb-6 flex-1 space-y-6">
              {/* Specs Table */}
              {product.specs?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#0A4FAF] font-bold">
                      Technical Specs
                    </h4>
                  </div>
                  <div className="border border-[#E5E7EB] divide-y divide-[#E5E7EB]" data-testid="specs-table">
                    {product.specs.map(({ label, value }) => (
                      <div key={label} className="grid grid-cols-3 text-xs md:text-sm">
                        <div className="col-span-1 p-2.5 bg-[#F9FAFB] font-semibold text-[#111827]">{label}</div>
                        <div className="col-span-2 p-2.5 text-[#4B5563]">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid block for Apps & Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {product.applications?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#0A4FAF] font-bold mb-3">
                      Applications
                    </h4>
                    <ul className="space-y-1.5 text-xs md:text-sm text-[#111827]">
                      {product.applications.map((app) => (
                        <li key={app} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-[#0A4FAF] mt-1.5 shrink-0 rounded-full" />
                          {app}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.sizes?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#0A4FAF] font-bold mb-3">
                      Available Sizes
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {product.sizes.map((s) => (
                        <span key={s} className="px-2.5 py-1 border border-[#E5E7EB] text-xs text-[#111827] bg-[#F9FAFB] rounded-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Projects Featuring This Product */}
              {product.projectsUsed && product.projectsUsed.length > 0 && (
                <div className="border-t border-[#E5E7EB] pt-6 mt-6">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#0A4FAF] font-bold mb-4">
                    Projects Featuring This Product
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.projectsUsed.map((proj, idx) => (
                      <div key={idx} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-sm overflow-hidden flex flex-col shadow-sm hover:border-[#0A4FAF]/30 transition-colors cursor-zoom-in" onClick={() => setActiveImageIndex(idx + 1)}>
                        <div className="w-full h-36 overflow-hidden bg-gray-100">
                          <img src={proj.imageUrl} alt={proj.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-bold text-[#111827] leading-snug line-clamp-2">{proj.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Actions bar */}
            <div className="border-t border-[#E5E7EB] bg-white p-6 md:p-8 py-4 flex gap-3 sticky bottom-0">
              <Link
                to="/contact"
                onClick={handleClose}
                data-testid="drawer-quote-btn"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0A4FAF] hover:bg-[#083D87] text-white text-sm font-semibold px-4 py-2.5 rounded-sm transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                  <path d="m21.854 2.147-10.94 10.939"/>
                </svg>
                Request Quote
              </Link>

              {product.brochureUrl && (
                <a
                  href={product.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-[#0A4FAF] text-[#0A4FAF] hover:bg-[#0A4FAF] hover:text-white transition-colors text-sm font-semibold px-4 py-2.5 rounded-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Brochure ↗
                </a>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Image Lightbox Overlay ── */}
      {activeImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 select-none pointer-events-auto">
          {/* Close Lightbox */}
          <button
            type="button"
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all focus:outline-none cursor-pointer"
            aria-label="Close image viewer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>

          {/* Navigation Controls */}
          {slides.length > 1 && (
            <>
              {/* Prev Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev - 1 + slides.length) % slides.length);
                }}
                className="absolute left-4 sm:left-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all focus:outline-none cursor-pointer"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev + 1) % slides.length);
                }}
                className="absolute right-4 sm:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all focus:outline-none cursor-pointer"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </>
          )}

          {/* Main Lightbox Image */}
          <div className="w-full max-w-4xl max-h-[75vh] flex items-center justify-center relative">
            <img
              src={slides[activeImageIndex].url}
              alt={slides[activeImageIndex].name}
              className="max-w-full max-h-[75vh] object-contain rounded shadow-2xl animate-fade-in"
            />
          </div>

          {/* Caption & Counter */}
          <div className="mt-6 text-center max-w-2xl px-4">
            <p className="text-white text-sm font-bold tracking-wide">{slides[activeImageIndex].name}</p>
            <p className="text-gray-400 text-xs mt-1.5 font-mono">
              Image {activeImageIndex + 1} of {slides.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
