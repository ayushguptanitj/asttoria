import { Link } from 'react-router-dom'

const ArrowRight = ({ cls = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cls}
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const categories = [
  {
    id: 'ceiling',
    num: '01',
    title: 'Ceiling Framework',
    desc: 'Broad & narrow ceiling sections, channels, angles.',
    img: 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'pop',
    num: '02',
    title: 'POP Sections',
    desc: 'POP main, angle and cross profiles for plaster ceilings.',
    img: 'https://images.pexels.com/photos/32239084/pexels-photo-32239084.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'partition',
    num: '03',
    title: 'Partition Framework',
    desc: 'Studs and floor channels in 2" and 3" sizes.',
    img: 'https://images.pexels.com/photos/36003986/pexels-photo-36003986.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'insulation',
    num: '04',
    title: 'Insulation Products',
    desc: 'Hat channels & furring for acoustic and thermal systems.',
    img: 'https://images.pexels.com/photos/30990849/pexels-photo-30990849.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'tsection',
    num: '05',
    title: 'T-Section Products',
    desc: 'Complete T-grid suspended ceiling system.',
    img: 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'accessories',
    num: '06',
    title: 'Accessories & Hardware',
    desc: 'Clips, cleets, screws, anchors and jointing material.',
    img: 'https://images.pexels.com/photos/30990849/pexels-photo-30990849.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]


export default function ProductsSection({ settings }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="text-xs uppercase tracking-[0.2em] text-[#0A4FAF] font-semibold">
              {settings?.productsBadge ?? 'Product Range'}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#111827] mt-3 leading-[1.1]">
              {settings?.productsTitle ?? 'Complete framing & ceiling ecosystem'}
            </h2>
          </div>
          <Link
            data-testid="view-all-products"
            className="inline-flex items-center gap-2 text-[#0A4FAF] font-semibold hover:gap-3 transition-all"
            to="/products"
          >
            View all products
            <ArrowRight />
          </Link>
        </div>

        {/* Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(settings?.productsList && settings.productsList.length > 0 ? settings.productsList : categories).map((c) => (
            <Link
              key={c.id}
              data-testid={`category-preview-${c.id}`}
              className="group relative aspect-[5/6] overflow-hidden bg-[#111827]"
              to={`/products?cat=${c.id}`}
            >
              <img
                alt={c.title}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                src={c.img}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="text-xs uppercase tracking-[0.2em] text-[#7BA7E8] font-semibold">
                  {c.num}
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-2 leading-tight">
                  {c.title}
                </h3>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">{c.desc}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-white font-semibold text-sm">
                  Browse
                  <ArrowRight cls="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
