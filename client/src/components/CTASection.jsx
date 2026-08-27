export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-[#0A4FAF] relative overflow-hidden">
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-center">

          {/* Left — Text */}
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1]">
              Need materials for your next project?
            </h2>
            <p className="mt-5 text-white/85 text-base md:text-lg max-w-2xl">
              Tell us your requirements and our team will get back with pricing,
              availability and delivery details.
            </p>
          </div>

          {/* Right — Buttons */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:justify-end gap-3">
            <a
              data-testid="cta-quote-btn"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F3F4F6] text-[#0A4FAF] font-semibold px-7 py-4 rounded-sm transition-all"
              href="/contact"
            >
              Get a Custom Quote
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
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <a
              data-testid="cta-whatsapp-btn"
              href="https://wa.me/919447390415?text=Hello%2C%20I%20would%20like%20a%20quotation."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/60 hover:bg-white/10 text-white font-semibold px-7 py-4 rounded-sm transition-all"
            >
              WhatsApp
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
