export default function AboutSection({ settings }) {
  const badge = settings?.aboutBadge ?? 'About ASTTORIA'
  const title = settings?.aboutTitle ?? 'Trusted Since 1996'
  const description = settings?.aboutDescription ?? 'ASTTORIA is a leading supplier and manufacturer of false ceiling frameworks, POP sections, partition channels, insulation systems, gypsum accessories and T-grid products. We provide customized solutions for residential, commercial and industrial projects.'
  const image = settings?.aboutImage ?? 'https://images.pexels.com/photos/30990849/pexels-photo-30990849.jpeg?auto=compress&cs=tinysrgb&w=1200'
  const points = settings?.aboutPoints && settings.aboutPoints.length > 0 ? settings.aboutPoints : [
    'Custom manufacturing capability',
    '100% galvanized steel',
    'Bulk order specialists',
    'Pan-India delivery',
  ]

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* Left — Image */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              alt="ASTTORIA manufacturing"
              className="w-full h-full object-cover"
              src={image}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#0A4FAF] text-white p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-white/80 mb-1">
                Trusted Since
              </div>
              <div className="text-4xl md:text-5xl font-black">1996</div>
            </div>
          </div>
        </div>

        {/* Right — Content */}
        <div className="lg:col-span-7">
          <div className="text-sm uppercase tracking-[0.2em] text-[#0A4FAF] font-extrabold">
            {badge}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111827] mt-3 leading-[1.1]">
            {title}
          </h2>
          <p className="mt-6 text-[#4B5563] leading-relaxed text-base md:text-lg">
            {description}
          </p>

          {/* Checklist */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {points.map((point) => (
              <div key={point} className="flex items-start gap-2 text-sm text-[#111827]">
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
                  className="text-[#0A4FAF] shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                {point}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

