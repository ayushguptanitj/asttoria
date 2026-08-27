import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          data-testid="nav-logo"
          className="flex items-center gap-3 group"
          to="/"
        >
          <div className="w-9 h-9 bg-[#0A4FAF] text-white grid place-items-center font-black tracking-tight text-base">
            A
          </div>
          <div className="leading-none">
            <div className="text-lg md:text-xl font-extrabold tracking-tight text-[#111827]">
              ASTTORIA
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#4B5563] mt-0.5">
              ASR TEC · Since 1996
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { to: '/', label: 'Home', testId: 'nav-link-home', end: true },
            { to: '/products', label: 'Products', testId: 'nav-link-products' },
            { to: '/projects', label: 'Our Work', testId: 'nav-link-projects' },
            { to: '/terms', label: 'Terms & Conditions', testId: 'nav-link-terms' },
            { to: '/contact', label: 'Contact', testId: 'nav-link-contact' },
          ].map(({ to, label, testId, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              data-testid={testId}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-colors ${
                  isActive ? 'text-[#0A4FAF]' : 'text-[#111827] hover:text-[#0A4FAF]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            data-testid="nav-quote-btn"
            to="/contact"
            className="bg-[#0A4FAF] hover:bg-[#083D87] text-white text-sm font-semibold px-5 py-2.5 rounded-sm transition-all active:scale-[0.98]"
          >
            Request Quote
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          data-testid="nav-toggle"
          className="md:hidden p-2"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            /* X icon when open */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 12h16" />
              <path d="M4 18h16" />
              <path d="M4 6h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 pb-5 pt-4 flex flex-col gap-4">
          {[
            { to: '/', label: 'Home', testId: 'nav-link-home-mobile', end: true },
            { to: '/products', label: 'Products', testId: 'nav-link-products-mobile' },
            { to: '/projects', label: 'Our Work', testId: 'nav-link-projects-mobile' },
            { to: '/terms', label: 'Terms & Conditions', testId: 'nav-link-terms-mobile' },
            { to: '/contact', label: 'Contact', testId: 'nav-link-contact-mobile' },
          ].map(({ to, label, testId, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              data-testid={testId}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-colors ${
                  isActive ? 'text-[#0A4FAF]' : 'text-[#111827] hover:text-[#0A4FAF]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center bg-[#0A4FAF] hover:bg-[#083D87] text-white text-sm font-semibold px-5 py-2.5 rounded-sm transition-all active:scale-[0.98]"
            >
              Request Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
