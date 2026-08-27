export default function HeroSection({ settings }) {
  const title = settings?.heroTitle ?? 'Premium False Ceiling & Partition Framework Solutions'
  const subtitle = settings?.heroSubtitle ?? 'Manufacturing and supplying ceiling systems, partition frameworks, insulation channels, T-grid systems, gypsum accessories and industrial framing products since 1996.'
  const bgImage = settings?.heroBgImage ?? 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=1200'
  const stats = settings?.heroStats && settings.heroStats.length > 0 ? settings.heroStats : [
    { num: '29+', lbl: 'Years' },
    { num: '500+', lbl: 'Projects' },
    { num: '6', lbl: 'Product Lines' },
    { num: '100%', lbl: 'G.I. Steel' },
  ]

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Subtle bottom gradient to keep stats legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 w-full py-24 lg:py-32">
        <div className="max-w-3xl">


          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight text-balance">
            {title}
          </h1>

          {/* Description */}
          <p className="mt-6 text-base md:text-lg text-white/80 leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              data-testid="hero-explore-btn"
              className="group inline-flex items-center gap-2 bg-[#0A4FAF] hover:bg-[#083D87] text-white font-semibold px-7 py-4 rounded-sm transition-all active:scale-[0.98]"
              href="/products"
            >
              Explore Products
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
                className="group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <a
              data-testid="hero-quote-btn"
              className="inline-flex items-center gap-2 bg-white/0 hover:bg-white/10 text-white border border-white/40 hover:border-white font-semibold px-7 py-4 rounded-sm transition-all"
              href="/contact"
            >
              Request Quotation
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            {stats.map(({ num, lbl }) => (
              <div key={lbl}>
                <div className="text-2xl md:text-3xl font-extrabold text-white">
                  {num}
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/60 mt-1">
                  {lbl}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

