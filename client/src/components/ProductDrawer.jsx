import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const DURATION = 320 // ms — keep in sync with CSS transition below

export default function ProductDrawer({ product, onClose }) {
  // `visible` drives the CSS transform; we delay unmount so exit plays out
  const [visible, setVisible] = useState(false)

  // Trigger enter animation after mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Close: play exit animation, then call parent's onClose
  function handleClose() {
    setVisible(false)
    setTimeout(onClose, DURATION)
  }

  // Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!product) return null

  const waText = encodeURIComponent(
    `Hi, I'm interested in ${product.name}. Please share details.`
  )

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
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* ── Drawer panel ── */}
      <div
        role="dialog"
        aria-labelledby="drawer-title"
        aria-describedby="drawer-desc"
        data-testid="product-drawer"
        style={{
          transition: `transform ${DURATION}ms cubic-bezier(0.32, 0.72, 0, 1)`,
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
        }}
        className="fixed inset-y-0 right-0 z-50 h-full w-full sm:max-w-xl bg-white shadow-2xl overflow-y-auto"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-sm p-1 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#0A4FAF]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
          <span className="sr-only">Close</span>
        </button>

        {/* Hero image */}
        <div className="relative aspect-[16/10] bg-[#F3F4F6]">
          <img alt={product.name} className="w-full h-full object-cover" src={product.img} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 bg-white/95 text-[#0A4FAF] text-[10px] uppercase tracking-[0.18em] font-semibold px-2.5 py-0.5 shadow">
            {product.category}
          </div>
        </div>

        {/* Title & description */}
        <div className="px-6 md:px-8 pt-6">
          <h2 id="drawer-title" className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827]">
            {product.name}
          </h2>
          <p id="drawer-desc" className="mt-2 text-sm text-[#4B5563] leading-relaxed">
            {product.short}
          </p>

          {/* Dimensions badge */}
          {product.dimensions && (
            <div className="mt-4 inline-flex items-center gap-2 border border-[#0A4FAF]/30 bg-[#0A4FAF]/5 px-3 py-2 rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="#0A4FAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <path d="M21 7 6.82 21.18"/><path d="M3 3h18v4H3z"/><path d="M3 17h4v4H3z"/>
              </svg>
              <span className="text-xs font-semibold text-[#0A4FAF] tracking-wide">Dimensions:</span>
              <span className="text-xs font-mono text-[#111827] font-semibold">{product.dimensions}</span>
            </div>
          )}
        </div>

        {/* Specifications table */}
        {product.specs?.length > 0 && (
          <div className="px-6 md:px-8 mt-8">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-[#0A4FAF]" aria-hidden="true">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                <path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
              </svg>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#0A4FAF] font-semibold">
                Specifications
              </h4>
            </div>
            <div className="border border-[#E5E7EB] divide-y divide-[#E5E7EB]" data-testid="specs-table">
              {product.specs.map(({ label, value }) => (
                <div key={label} className="grid grid-cols-3 text-sm">
                  <div className="col-span-1 p-3 bg-[#F9FAFB] font-semibold text-[#111827]">{label}</div>
                  <div className="col-span-2 p-3 text-[#4B5563]">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications & Sizes */}
        <div className="px-6 md:px-8 mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {product.applications?.length > 0 && (
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#0A4FAF] font-semibold mb-3">
                Applications
              </h4>
              <ul className="space-y-2 text-sm text-[#111827]">
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
              <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#0A4FAF] font-semibold mb-3">
                Available Sizes
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <span key={s} className="px-3 py-1 border border-[#E5E7EB] text-xs text-[#111827] bg-[#F9FAFB]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky bottom CTA bar */}
        <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] mt-10 px-6 md:px-8 py-4 flex gap-3">
          <Link
            to="/contact"
            onClick={handleClose}
            data-testid="drawer-quote-btn"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0A4FAF] hover:bg-[#083D87] text-white text-sm font-semibold px-4 py-2.5 rounded-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              Brochure ↗
            </a>
          )}
        </div>
      </div>
    </>
  )
}
