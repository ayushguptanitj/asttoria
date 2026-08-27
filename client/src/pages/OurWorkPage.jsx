import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GallerySection from '../components/GallerySection'

export default function OurWorkPage() {
  const [activeStep, setActiveStep] = useState(0)

  // Step details for "How We Work"
  const steps = [
    {
      num: '01',
      title: 'Consultation & estimation',
      subtitle: 'Understanding specs & architectural drawings',
      desc: 'Our technical experts review your layout plans, drawings, and ceiling/partition specifications. We work alongside contractors, architects, and builders to estimate exact raw material quantities, preventing over-ordering and ensuring structure-load safety.',
      details: [
        'Detailed layout review and material bill estimation',
        'Load bearing calculation advice for framing spans',
        'Custom specifications alignment (thickness, coating, dimensions)'
      ],
      icon: (
        <svg className="w-8 h-8 text-[#0A4FAF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      num: '02',
      title: 'Custom length manufacturing',
      subtitle: 'Precision cutting to reduce site waste',
      desc: 'We feed established hot-dip galvanized steel rolls into specialized roll-forming machines. Unlike standard suppliers who offer static sizes, we cut sections to your custom architectural lengths, saving you up to 15% in material scrap and reducing on-site joint labor.',
      details: [
        'Roll-forming galvanized iron sheets to precise profile dimensions',
        'Sections cut to exact site lengths from 1.5m to 7.0m',
        'Uniform zinc coating weight maintenance for rust control'
      ],
      icon: (
        <svg className="w-8 h-8 text-[#0A4FAF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
    {
      num: '03',
      title: 'Batch inspection & bundling',
      subtitle: 'Rigid QA checks before packing',
      desc: 'Each custom batch undergoes dimensional checks, gauge measurements, and visual finish assessments. Once cleared, sections are bundled and wrapped securely. This prevents bending or scratching during logistics handling and ensures quick sorting on-site.',
      details: [
        'Gauge/Thickness micrometre verification',
        'Bundle labels with length, count, and project references',
        'Moisture-free packaging to prevent early zinc oxidation'
      ],
      icon: (
        <svg className="w-8 h-8 text-[#0A4FAF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      num: '04',
      title: 'Dispatch & site delivery',
      subtitle: 'On-time transport to prevent site delay',
      desc: 'We arrange secure loading and direct transport to your project coordinates across Mohali, Punjab, and nationwide. Our logistics network guarantees that custom profiles are delivered in phases aligned with your drylining and false ceiling contractor timelines.',
      details: [
        'Secure flatbed loading to prevent structural profile warping',
        'Phase-wise delivery coordinates alignment',
        'Immediate notification and GPS dispatch tracking'
      ],
      icon: (
        <svg className="w-8 h-8 text-[#0A4FAF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ]

  return (
    <div className="bg-white" data-testid="our-work-page">
      {/* ── Page Hero ── */}
      <section className="bg-[#0B1220] text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(10,79,175,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#7BA7E8] font-bold">
              Our Process & Showcases
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mt-4 leading-none">
              How We Deliver <span className="text-[#7BA7E8]">Excellence</span>
            </h1>
            <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">
              From architectural blueprint estimation and custom roll-forming to project delivery, explore our seamless material supply process and finished spaces.
            </p>
          </div>
        </div>
      </section>

      {/* ── How We Work Section ── */}
      <section className="py-20 lg:py-28 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <div className="text-xs uppercase tracking-[0.2em] text-[#0A4FAF] font-bold">
              Operational Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#111827] mt-3">
              Our 4-Step Project Delivery System
            </h2>
            <p className="mt-4 text-[#4B5563] text-sm md:text-base leading-relaxed">
              We stand apart by offering custom structural manufacturing, zero-waste optimization, and direct logistics to keep your commercial construction timelines running on schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
            
            {/* Interactive Timeline Tabs */}
            <div className="lg:col-span-5 space-y-4">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx
                return (
                  <button
                    key={step.num}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-6 border rounded-sm transition-all duration-300 flex items-start gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0A4FAF]/20 ${
                      isActive
                        ? 'bg-[#F9FAFB] border-[#0A4FAF] shadow-md shadow-[#0A4FAF]/5'
                        : 'bg-white border-[#E5E7EB] hover:border-gray-300'
                    }`}
                  >
                    <div className={`text-sm font-extrabold font-mono w-8 h-8 rounded-full grid place-items-center shrink-0 transition-colors ${
                      isActive ? 'bg-[#0A4FAF] text-white' : 'bg-gray-100 text-[#4B5563]'
                    }`}>
                      {step.num}
                    </div>
                    <div>
                      <h3 className={`font-bold text-base transition-colors ${
                        isActive ? 'text-[#0A4FAF]' : 'text-[#111827]'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-[#4B5563] mt-1 font-semibold">{step.subtitle}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Detailed Content Box */}
            <div className="lg:col-span-7 bg-[#F9FAFB] border border-[#E5E7EB] p-8 md:p-10 rounded-sm space-y-6 lg:sticky lg:top-28">
              <div className="flex items-center gap-4 border-b border-[#E5E7EB] pb-6">
                <div className="p-3 bg-white border border-[#E5E7EB] shadow-sm rounded-sm">
                  {steps[activeStep].icon}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#0A4FAF] font-extrabold font-mono">
                    Step {steps[activeStep].num} Details
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#111827] mt-1">
                    {steps[activeStep].title}
                  </h3>
                </div>
              </div>

              <p className="text-[#4B5563] text-sm md:text-base leading-relaxed">
                {steps[activeStep].desc}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase font-extrabold text-[#111827] tracking-wider">
                  Key Actions & Deliverables:
                </h4>
                <ul className="space-y-2">
                  {steps[activeStep].details.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#4B5563]">
                      <svg className="w-5 h-5 text-[#0A4FAF] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── Finished Projects (Gallery) Showcase ── */}
      <section className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <GallerySection />
      </section>

      {/* ── Need Materials for Next Project? (CTA Section) ── */}
      <section className="py-20 lg:py-28 bg-[#0B1220] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(10,79,175,0.18),transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center relative z-10 space-y-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-xs uppercase tracking-[0.25em] text-[#7BA7E8] font-bold">
              Instant Pricing & Estimates
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Need Materials for Your Next Project?
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Submit your drawings or approximate list of framing, plasterboard, and T-sections. Our engineering estimators will provide a detailed quote matching your site's specific dimensions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-[#0A4FAF] hover:bg-[#083D87] text-white text-sm font-extrabold px-8 py-4 rounded-sm transition-all shadow-lg shadow-[#0A4FAF]/25 active:scale-[0.98]"
            >
              Get Free Estimate & Quote
            </Link>
            <a
              href="https://wa.me/919447390415?text=Hello%20Asttoria,%20I%20need%20a%20material%20quotation%20for%20my%20next%20ceiling/partition%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-extrabold px-8 py-4 rounded-sm transition-all"
            >
              Chat with Sales 💬
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
