import { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import DealershipsSection from '../components/DealershipsSection'
import FeaturesSection from '../components/FeaturesSection'
import ProductsSection from '../components/ProductsSection'
import GallerySection from '../components/GallerySection'
import ProcessSection from '../components/ProcessSection'
import CTASection from '../components/CTASection'
import { API_URL } from '../config'

export default function HomePage() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetchHomepageSettings()
  }, [])

  async function fetchHomepageSettings() {
    try {
      const res = await fetch(`${API_URL}/homepage-settings`)
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (err) {
      console.warn('Backend server offline. Rendering default homepage copy.')
    }
  }

  return (
    <>
      <HeroSection settings={settings} />
      <AboutSection settings={settings} />
      <DealershipsSection />
      <FeaturesSection settings={settings} />
      <ProductsSection settings={settings} />
      <GallerySection />
      <ProcessSection />
      <CTASection />
    </>
  )
}
