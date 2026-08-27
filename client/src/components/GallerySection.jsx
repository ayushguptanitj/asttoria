import { useState, useEffect } from 'react'
import { API_URL } from '../config'

export default function GallerySection() {
  const [gallery, setGallery] = useState([])

  const defaultGallery = [
    {
      _id: 'default-1',
      title: 'False Ceiling Grid Installation',
      imageUrl: 'https://images.pexels.com/photos/18289606/pexels-photo-18289606.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'A completed commercial grid ceiling installation with white powder coated T-sections.'
    },
    {
      _id: 'default-2',
      title: 'Modern Drywall Partition',
      imageUrl: 'https://images.pexels.com/photos/36003986/pexels-photo-36003986.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Office cabins framing built with 3" heavy-duty vertical metal studs.'
    },
    {
      _id: 'default-3',
      title: 'Acoustic Sound Insulation',
      imageUrl: 'https://images.pexels.com/photos/30990849/pexels-photo-30990849.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Hat-channel furring installed with sound isolation boards for studio insulation.'
    }
  ]

  useEffect(() => {
    fetchGallery()
  }, [])

  async function fetchGallery() {
    try {
      const res = await fetch(`${API_URL}/gallery`)
      if (res.ok) {
        const data = await res.json()
        setGallery(data)
      } else {
        setGallery(defaultGallery)
      }
    } catch (err) {
      setGallery(defaultGallery)
    }
  }

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        <div className="max-w-3xl mb-14">
          <div className="text-xs uppercase tracking-[0.2em] text-[#0A4FAF] font-semibold">
            Our Work Portfolio
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#111827] mt-3 leading-[1.1]">
            Showcasing Our <span className="text-[#0A4FAF]">Finished Projects</span>
          </h2>
          <p className="mt-5 text-[#4B5563] text-base md:text-lg leading-relaxed">
            Take a look at some of the false ceiling grids, drywall partition configurations, and commercial tiling frameworks installed by our dealer network and contractors.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div 
              key={item._id}
              className="group relative overflow-hidden bg-gray-100 aspect-[4/3] border border-[#E5E7EB] hover:border-[#0A4FAF] transition-all duration-300 rounded-sm"
            >
              {/* Image */}
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Bottom Content Overlay (Slides up on hover) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-base font-extrabold text-white leading-tight">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-2 text-xs text-white/80 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Default Small Tag (shows caption when not hovered) */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs text-[#111827] font-bold group-hover:opacity-0 transition-opacity">
                {item.title}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
