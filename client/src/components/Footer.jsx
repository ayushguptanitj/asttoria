import { Link } from 'react-router-dom'

const ArrowUpRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="opacity-0 group-hover:opacity-100 transition-opacity"
    aria-hidden="true"
  >
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
)

const navLinks = [
  { label: 'Home', to: '/', testId: 'footer-link-home' },
  { label: 'Products', to: '/products', testId: 'footer-link-products' },
  { label: 'Request Quote', to: '/contact', testId: 'footer-link-request-quote' },
  { label: 'Admin Portal', to: '/admin', testId: 'footer-link-admin' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer data-testid="site-footer" className="bg-[#0B1220] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 lg:py-20">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Brand column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0A4FAF] grid place-items-center font-black text-base">
                A
              </div>
              <div>
                <div className="text-xl font-extrabold">ASTTORIA</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                  ASR TEC · Since 1996
                </div>
              </div>
            </div>

            <p className="mt-6 text-white/70 leading-relaxed max-w-md">
              Manufacturer and supplier of false ceiling frameworks, POP
              sections, partition channels, insulation systems and T-grid
              products for residential, commercial and industrial projects.
            </p>

          </div>

          {/* Navigate column */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-semibold">
              Navigate
            </h4>
            <ul className="mt-5 space-y-3">
              {navLinks.map(({ label, to, testId }) => (
                <li key={testId}>
                  <Link
                    data-testid={testId}
                    to={to}
                    className="group inline-flex items-center gap-1.5 text-white/85 hover:text-white transition-colors"
                  >
                    {label}
                    <ArrowUpRight />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="md:col-span-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-semibold">
              Get in touch
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-white/85">

              {/* Address */}
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#7BA7E8] mt-0.5 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>
                  F-139, Industrial Area, Sector 74, Phase VIII-B, Mohali,
                  Punjab – 160055
                </span>
              </li>

              {/* Phone */}
              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#7BA7E8] shrink-0"
                  aria-hidden="true"
                >
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                </svg>
                <a
                  data-testid="footer-phone"
                  href="tel:919447390415"
                  className="hover:text-white transition-colors"
                >
                  +91 9447390415
                </a>
              </li>

              {/* Email */}
              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#7BA7E8] shrink-0"
                  aria-hidden="true"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
                <a
                  data-testid="footer-email"
                  href="mailto:anahatrandhawal4@gmail.com"
                  className="hover:text-white transition-colors break-all"
                >
                  anahatrandhawal4@gmail.com
                </a>
              </li>

            </ul>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://instagram.com/asttoria"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#E1306C] hover:bg-[#D3225C] text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md shadow-[#E1306C]/10 hover:scale-105"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              
              {/* Telegram */}
              <a
                href="https://t.me/asttoria"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md shadow-[#0088cc]/10 hover:scale-105"
                aria-label="Telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919447390415?text=Hello%2C%20I%20would%20like%20a%20quotation."
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#25D366] hover:bg-[#1ebe5b] text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md shadow-[#25D366]/10 hover:scale-105"
                aria-label="WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/50">
          <div>
            © {year} ASTTORIA (ASR TEC). All rights reserved. |{' '}
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
          <div className="uppercase tracking-[0.25em]">
            Mohali · Punjab · India
          </div>
        </div>

      </div>
    </footer>
  )
}
