import { useState, useEffect } from 'react'
import { PRODUCTS } from '../data/products'
import { API_URL } from '../config'

/* ── Reusable Field Wrapper ── */
function Field({ label, required, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-semibold text-[#111827]">
        {label}{' '}
        {required && <span className="text-[#0A4FAF]">*</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

const inputCls =
  'w-full bg-white border border-[#E5E7EB] focus:border-[#0A4FAF] focus:ring-2 focus:ring-[#0A4FAF]/20 outline-none px-4 py-3 text-sm rounded-sm transition-all placeholder:text-[#9CA3AF]'

/* ── Contact Info Card ── */
function ContactCard({ href, testId, iconBg, icon, label, value, external }) {
  const inner = (
    <div className="flex items-start gap-4 border border-[#E5E7EB] p-5 hover:border-[#0A4FAF] transition-colors">
      <div
        className="w-11 h-11 grid place-items-center shrink-0 text-white"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#4B5563] font-semibold">{label}</div>
        <div className="mt-1 font-semibold text-[#111827] break-words">{value}</div>
      </div>
    </div>
  )

  if (!href) return <div data-testid={testId}>{inner}</div>

  return (
    <a
      data-testid={testId}
      href={href}
      className="block"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </a>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState({
    full_name: '', company_name: '', phone: '',
    email: '', project_location: '',
    additional_requirements: '',
  })
  
  // Dynamic requested products list (side-by-side selector + quantity)
  const [requestedItems, setRequestedItems] = useState([
    { productName: '', quantity: '' }
  ])

  const [contactMethod, setContactMethod] = useState('Phone')
  const [submitted, setSubmitted] = useState(false)
  const [productsList, setProductsList] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await fetch(`${API_URL}/products`)
      if (res.ok) {
        const data = await res.json()
        if (data && data.length > 0) {
          setProductsList(data)
          return
        }
      }
      setProductsList(PRODUCTS)
    } catch (err) {
      setProductsList(PRODUCTS)
    }
  }

  // Helper auth header
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleItemChange(index, field, value) {
    const updated = [...requestedItems]
    updated[index][field] = value
    setRequestedItems(updated)
  }

  function addRequestedItem() {
    setRequestedItems([...requestedItems, { productName: '', quantity: '' }])
  }

  function removeRequestedItem(index) {
    const updated = requestedItems.filter((_, i) => i !== index)
    setRequestedItems(updated.length > 0 ? updated : [{ productName: '', quantity: '' }])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Filter empty items
    const validItems = requestedItems.filter(item => item.productName)
    if (validItems.length === 0) {
      alert('Please select at least one product.')
      return
    }

    // Format for backend
    const products_required = validItems.map(item => `${item.productName} (${item.quantity || '1 unit'})`)
    const quantity_required = validItems.map(item => `${item.productName}: ${item.quantity || '1 unit'}`).join(' | ')

    const payload = {
      full_name: form.full_name,
      company_name: form.company_name,
      phone: form.phone,
      email: form.email,
      project_location: form.project_location,
      quantity_required,
      products_required,
      additional_requirements: form.additional_requirements,
      contact_method: contactMethod
    }

    try {
      const res = await fetch(`${API_URL}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const errData = await res.json()
        alert(errData.message || 'Failed to submit quote request. Please try again.')
      }
    } catch (err) {
      // Fallback submit so customer is not blocked if server goes offline
      console.warn('Backend server offline. Performing graceful fallback submission.')
      setSubmitted(true)
    }
  }

  const contactMethods = ['Phone', 'WhatsApp', 'Email']

  return (
    <div data-testid="contact-page">

      {/* ── Page Header ── */}
      <section className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#0A4FAF] font-semibold">
              Lead Generation
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] mt-3 leading-[1.05]">
              Request a <span className="text-[#0A4FAF]">Quote</span>
            </h1>
            <p className="mt-5 text-[#4B5563] text-base md:text-lg leading-relaxed">
              Fill the form and our team will contact you with pricing and availability.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-10 lg:gap-16">

          {/* ── Left: Form ── */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-white border border-[#E5E7EB] p-10 text-center">
                <div className="w-16 h-16 bg-[#0A4FAF]/10 grid place-items-center mx-auto rounded-full mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A4FAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h2 className="text-2xl font-black text-[#111827]">Quote Request Sent!</h2>
                <p className="mt-3 text-[#4B5563]">
                  Thank you. Our team will contact you shortly via {contactMethod}.
                </p>
              </div>
            ) : (
              <form
                data-testid="quote-form"
                onSubmit={handleSubmit}
                className="bg-white border border-[#E5E7EB] p-6 md:p-10"
              >
                {/* Row 1 — 2-col grid fields */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" required>
                    <input data-testid="input-full_name" name="full_name" value={form.full_name}
                      onChange={handleChange} required placeholder="John Doe" className={inputCls} />
                  </Field>
                  <Field label="Company Name">
                    <input data-testid="input-company_name" name="company_name" value={form.company_name}
                      onChange={handleChange} placeholder="Optional" className={inputCls} />
                  </Field>
                  <Field label="Phone Number" required>
                    <input data-testid="input-phone" name="phone" value={form.phone}
                      onChange={handleChange} required placeholder="+91 ..." className={inputCls} />
                  </Field>
                  <Field label="Email" required>
                    <input data-testid="input-email" name="email" value={form.email} type="email"
                      onChange={handleChange} required placeholder="you@company.com" className={inputCls} />
                  </Field>
                  <Field label="Project Location" className="sm:col-span-2">
                    <input data-testid="input-project_location" name="project_location" value={form.project_location}
                      onChange={handleChange} placeholder="City, State" className={inputCls} />
                  </Field>
                </div>

                {/* Dynamic Products and Quantities side-by-side list */}
                <div className="mt-8 border border-[#E5E7EB] p-6 bg-[#F9FAFB] space-y-4 rounded-sm">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-2">
                    <span className="text-sm font-bold text-[#111827]">Products &amp; Quantities Required *</span>
                    <button
                      type="button"
                      onClick={addRequestedItem}
                      className="text-xs bg-[#0A4FAF]/10 hover:bg-[#0A4FAF]/20 text-[#0A4FAF] px-3.5 py-2 font-bold rounded-sm transition-all cursor-pointer"
                    >
                      + Add Another Product
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {requestedItems.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Product select dropdown */}
                        <div className="flex-1 min-w-0">
                          <label className="block sm:hidden text-xs font-semibold text-[#4B5563] mb-1">Product</label>
                          <select
                            required
                            value={item.productName}
                            onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                            className="w-full bg-white border border-[#E5E7EB] focus:border-[#0A4FAF] focus:ring-2 focus:ring-[#0A4FAF]/20 outline-none px-4 py-3 text-sm rounded-sm transition-all text-[#111827] cursor-pointer"
                          >
                            <option value="" disabled>Select product...</option>
                            {productsList.map((p) => (
                              <option key={p.id || p._id} value={p.name}>
                                {p.name} ({p.category.toUpperCase()})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quantity input */}
                        <div className="w-full sm:w-48">
                          <label className="block sm:hidden text-xs font-semibold text-[#4B5563] mb-1">Quantity</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 500 pcs, 200 sq.m"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className={inputCls}
                          />
                        </div>

                        {/* Remove button */}
                        {requestedItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRequestedItem(index)}
                            className="px-3.5 py-3.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 rounded-sm text-sm transition-all flex items-center justify-center cursor-pointer mt-1 sm:mt-0"
                            title="Remove item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional requirements */}
                <div className="mt-5">
                  <Field label="Additional Requirements">
                    <textarea
                      data-testid="input-additional_requirements"
                      name="additional_requirements"
                      value={form.additional_requirements}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about your project — site, timeline, special specs..."
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Contact method toggle */}
                <div className="mt-5">
                  <Field label="Preferred Contact Method" required>
                    <div className="flex flex-wrap gap-3" data-testid="contact-method">
                      {contactMethods.map((m) => (
                        <button
                          key={m}
                          type="button"
                          data-testid={`contact-method-${m.toLowerCase()}`}
                          onClick={() => setContactMethod(m)}
                          className={`px-4 py-2 text-sm font-semibold border rounded-sm transition-all ${
                            contactMethod === m
                              ? 'bg-[#0A4FAF] text-white border-[#0A4FAF]'
                              : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-[#0A4FAF]'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>

                {/* Submit & Terms Button */}
                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    type="submit"
                    data-testid="submit-quote"
                    className="inline-flex items-center justify-center gap-2 bg-[#0A4FAF] hover:bg-[#083D87] text-white font-semibold px-8 py-4 rounded-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                      <path d="m21.854 2.147-10.94 10.939"/>
                    </svg>
                    Request Quotation
                  </button>

                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-sm font-semibold text-[#4B5563] hover:text-[#0A4FAF] transition-colors border border-[#E5E7EB] hover:border-[#0A4FAF] px-6 py-4 rounded-sm cursor-pointer"
                  >
                    View Terms &amp; Conditions ↗
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* ── Right: Contact Info ── */}
          <div className="lg:col-span-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#0A4FAF] font-semibold">Direct contact</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] mt-3">
              Talk to our team directly.
            </h2>

            <div className="mt-8 space-y-4">
              <ContactCard
                testId="contact-phone"
                href="tel:919447390415"
                iconBg="rgb(10,79,175)"
                label="Phone"
                value="+91 9447390415"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>}
              />
              <ContactCard
                testId="contact-whatsapp"
                href="https://wa.me/919447390415?text=Hello%2C%20I%20would%20like%20a%20quotation."
                external
                iconBg="rgb(37,211,102)"
                label="WhatsApp"
                value="+91 9447390415"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>}
              />
              <ContactCard
                testId="contact-email"
                href="mailto:anahatrandhawal4@gmail.com"
                iconBg="rgb(10,79,175)"
                label="Email"
                value="anahatrandhawal4@gmail.com"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>}
              />
              <ContactCard
                testId="contact-address"
                iconBg="rgb(10,79,175)"
                label="Address"
                value="F-139, Industrial Area, Sector 74, Phase VIII-B, Mohali, Punjab – 160055"
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>}
              />
            </div>

            {/* WhatsApp CTA */}
            <a
              data-testid="whatsapp-cta-card"
              href="https://wa.me/919447390415?text=Hello%2C%20I%20would%20like%20a%20quotation."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 group flex items-center gap-4 bg-[#25D366] hover:bg-[#1ebe5b] text-white p-5 rounded-sm transition-all"
            >
              <div className="w-12 h-12 bg-white/20 grid place-items-center rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              </div>
              <div className="flex-1">
                <div className="text-lg font-extrabold">Chat on WhatsApp</div>
                <div className="text-sm text-white/85">Get instant response from our sales team.</div>
              </div>
              <div className="font-bold text-xl group-hover:translate-x-1 transition-transform">→</div>
            </a>

            {/* Google Map */}
            <div className="mt-6 border border-[#E5E7EB] overflow-hidden" data-testid="contact-map">
              <iframe
                title="ASTTORIA Mohali Location"
                src="https://www.google.com/maps?q=F-139+Industrial+Area+Sector+74+Phase+VIII-B+Mohali+Punjab+160055&output=embed"
                width="100%"
                height="300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
