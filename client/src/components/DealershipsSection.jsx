import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../config'

export default function DealershipsSection() {
  const [dealerships, setDealerships] = useState([])

  const defaultDealerships = [
    { _id: 'def-1', name: 'Saint-Gobain Gyproc', logoUrl: 'https://placehold.co/200x80/0F172A/ffffff?text=Saint-Gobain+Gyproc' },
    { _id: 'def-2', name: 'USG Boral', logoUrl: 'https://placehold.co/200x80/0F172A/ffffff?text=USG+Boral' },
    { _id: 'def-3', name: 'Armstrong', logoUrl: 'https://placehold.co/200x80/0F172A/ffffff?text=Armstrong' },
    { _id: 'def-4', name: 'Knauf', logoUrl: 'https://placehold.co/200x80/0F172A/ffffff?text=Knauf' }
  ]

  useEffect(() => {
    fetchDealerships()
  }, [])

  async function fetchDealerships() {
    try {
      const res = await fetch(`${API_URL}/dealerships`)
      if (res.ok) {
        const data = await res.json()
        setDealerships(data)
      } else {
        setDealerships(defaultDealerships)
      }
    } catch (err) {
      setDealerships(defaultDealerships)
    }
  }

  return (
    <section className="py-16 lg:py-20 bg-[#F9FAFB] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-[#0A4FAF] font-semibold">
            Authorized Channels
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111827] mt-3">
            Our Official <span className="text-[#0A4FAF]">Dealerships</span>
          </h2>
          <p className="mt-4 text-[#4B5563] text-sm md:text-base leading-relaxed">
            We are official distributors and authorized dealers of industry-leading brands, guaranteeing authentic products and direct manufacturer support for your framework and ceiling needs.
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center">
          {dealerships.map((partner) => (
            <Link
              key={partner._id}
              to={`/products?company=${encodeURIComponent(partner.name)}`}
              className="bg-white border border-[#E5E7EB] hover:border-[#0A4FAF] hover:shadow-[0_8px_20px_-8px_rgba(10,79,175,0.12)] p-6 flex flex-col items-center justify-center h-32 rounded-sm transition-all duration-300 group cursor-pointer"
            >
              {/* Logo Image */}
              <div className="w-full h-12 flex items-center justify-center overflow-hidden">
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain transition-all duration-300"
                />
              </div>
              
              {/* Brand Label */}
              <div className="text-xs font-semibold text-[#4B5563] group-hover:text-[#0A4FAF] transition-colors mt-3">
                {partner.name}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
