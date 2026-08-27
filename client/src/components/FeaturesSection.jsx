export default function FeaturesSection({ settings }) {
  const badge = settings?.featuresBadge ?? 'Why ASTTORIA'
  const title = settings?.featuresTitle ?? 'Built on precision. Backed by experience.'
  
  const defaultFeaturesList = [
    { title: 'Custom Length Manufacturing', desc: 'Sections cut to your exact project specifications.' },
    { title: 'High Quality Galvanized Steel', desc: 'Corrosion-resistant G.I. with thick zinc coating.' },
    { title: 'Dealership of established brands', desc: 'Stockage of entire range of tiling, false ceiling and boarding materials' },
    { title: 'Bulk Orders Accepted', desc: 'Project-scale supply for contractors & builders.' },
    { title: 'Fast Delivery', desc: 'Quick dispatch across Mohali, Punjab and pan-India.' },
    { title: 'Industry Experience Since 1996', desc: 'Three decades of manufacturing expertise.' }
  ]
  
  const list = settings?.featuresList && settings.featuresList.length > 0
    ? settings.featuresList
    : defaultFeaturesList

  const DEFAULT_ICONS = [
    // Custom Length
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
      <path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" />
      <path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" />
    </svg>,
    // Galvanized Steel
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>,
    // Dealership
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>,
    // Bulk Orders
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
      <path d="M12 22V12" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <path d="m7.5 4.27 9 5.15" />
    </svg>,
    // Fast Delivery
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
    </svg>,
    // Experience
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 16h.01" /><path d="M16 16h.01" />
      <path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
      <path d="M8 16h.01" />
    </svg>
  ]

  return (
    <section className="py-20 lg:py-28 bg-[#F9FAFB] border-y border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-[#0A4FAF] font-semibold">
            {badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#111827] mt-3 leading-[1.1]">
            {title}
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((f, i) => (
            <div
              key={f.title}
              data-testid={`feature-card-${i}`}
              className="group bg-white border border-[#E5E7EB] p-7 hover:border-[#0A4FAF] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#0A4FAF]/10 grid place-items-center text-[#0A4FAF] group-hover:bg-[#0A4FAF] group-hover:text-white transition-colors">
                {DEFAULT_ICONS[i % DEFAULT_ICONS.length]}
              </div>
              <h3 className="text-lg font-bold text-[#111827] mt-5">{f.title}</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed mt-2">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
