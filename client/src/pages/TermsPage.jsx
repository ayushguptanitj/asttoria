import { useEffect } from 'react'

export default function TermsPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white text-[#111827] py-16 lg:py-24" data-testid="terms-page">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        
        {/* Page Header */}
        <div className="border-b border-[#E5E7EB] pb-10 mb-12">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#0A4FAF] font-bold">
            Legal &amp; Compliance Boilerplate
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111827] mt-3">
            Terms of Service &amp; <span className="text-[#0A4FAF]">Privacy Policy</span>
          </h1>
          <p className="mt-4 text-[#4B5563] text-sm sm:text-base leading-relaxed">
            Last Updated: August 24, 2026. This page contains the official commercial terms, website usage rules, and privacy statements of ASTTORIA (ASR TEC).
          </p>
        </div>

        {/* Section 1: Business Terms and Conditions */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#0A4FAF]/10 text-[#0A4FAF] font-bold rounded-full flex items-center justify-center text-sm">
              1
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Commercial Terms &amp; Conditions
            </h2>
          </div>
          
          <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
            The following commercial terms govern all quotes, orders, invoices, and sales transactions conducted by ASTTORIA (ASR TEC):
          </p>

          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-sm divide-y divide-[#E5E7EB]">
            {[
              { id: '1', title: 'Payment Terms', desc: 'Payment is due within 15 days from the date of the invoice.' },
              { id: '2', title: 'Overdue Penalties', desc: 'Interest at the rate of 24% p.a. will be applicable on all overdue payments.' },
              { id: '3', title: 'Taxation & Duties', desc: 'All prices quoted are exclusive of GST. GST will be charged extra as applicable.' },
              { id: '4', title: 'Order Confirmations', desc: 'Orders once confirmed cannot be cancelled under any circumstances. Any advance paid is strictly non-refundable.' },
              { id: '5', title: 'Transfer of Risk', desc: 'Risk of damage or loss transfers to the customer immediately upon dispatch. We hold no responsibility once goods leave our premises.' },
              { id: '6', title: 'Discrepancies & Shortages', desc: 'Claims for material shortage or damage must be reported in writing within 24 hours of delivery.' },
              { id: '7', title: 'Return & Exchange Policy', desc: 'We enforce a strict "No Return / No Exchange" policy. Replacements will only be provided for manufacturing defects verified by our technical team.' },
              { id: '8', title: 'Product Warranty', desc: 'Warranty is strictly applicable as per the manufacturer\'s policy. No warranty coverage is provided for physical damage, onsite misuse, or improper handling.' },
              { id: '9', title: 'Cheque Dishonour Penalty', desc: 'A fine of ₹1,000 + GST will be applicable on any cheque dishonour or transaction payment failure.' },
              { id: '10', title: 'Limitation of Liability', desc: 'Our company is not liable for any indirect, incidental, special, or consequential losses/damages arising from sales or logistics.' },
              { id: '11', title: 'Legal Jurisdiction', desc: 'All transactions, disputes, and claims are subject to Mohali (Punjab) jurisdiction only.' }
            ].map(rule => (
              <div key={rule.id} className="p-5 flex gap-4">
                <span className="text-[#0A4FAF] font-bold text-sm select-none">{rule.id.padStart(2, '0')}.</span>
                <div>
                  <h4 className="text-sm font-extrabold text-[#111827]">{rule.title}</h4>
                  <p className="mt-1 text-xs sm:text-sm text-[#4B5563] leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Website Usage Policy (SEO Boost) */}
        <section className="mb-14 border-t border-[#E5E7EB] pt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#0A4FAF]/10 text-[#0A4FAF] font-bold rounded-full flex items-center justify-center text-sm">
              2
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Website Usage Policy
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            <p>
              Welcome to the ASTTORIA online portal (the "Website"). By accessing, browsing, or using this Website, you acknowledge that you have read, understood, and agree to be bound by these usage guidelines.
            </p>
            <h4 className="font-bold text-[#111827] text-sm mt-4">Intellectual Property Rights</h4>
            <p>
              All content, images, diagrams, product descriptions, catalog structures, and coding present on this Website are the exclusive intellectual property of ASTTORIA (ASR TEC). Unauthorized replication, scraping, or distribution of this content is strictly prohibited.
            </p>
            <h4 className="font-bold text-[#111827] text-sm mt-4">Prohibited Site Usage</h4>
            <p>
              You agree not to use the Website for any unlawful purpose or to send spam, falsify inquiry information, attempt to gain unauthorized access to our administrative databases, or launch denial-of-service (DoS) attacks.
            </p>
          </div>
        </section>

        {/* Section 3: Privacy Policy (Google SEO Required) */}
        <section className="mb-14 border-t border-[#E5E7EB] pt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#0A4FAF]/10 text-[#0A4FAF] font-bold rounded-full flex items-center justify-center text-sm">
              3
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Privacy Policy
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
            <p>
              At ASTTORIA, we value your privacy. This policy outlines how we handle data collected when you request a quotation or contact us.
            </p>
            
            <h4 className="font-bold text-[#111827] text-sm mt-4">1. Information We Collect</h4>
            <p>
              We collect user-provided details through quote requests and contact forms, including: Full Name, Company Name, Contact Number (Phone/WhatsApp), Email Address, Project Location, and Products Required.
            </p>

            <h4 className="font-bold text-[#111827] text-sm mt-4">2. How We Use Your Information</h4>
            <p>
              We collect this information solely to process your quotation, evaluate stock availability, and coordinate logistics/delivery. We do not sell, rent, or distribute your personal details to third-party marketing companies.
            </p>

            <h4 className="font-bold text-[#111827] text-sm mt-4">3. Cookies &amp; Tracking (SEO Compliance)</h4>
            <p>
              This website may use cookies or simple tracking scripts to improve user experience, monitor web traffic anonymously, and optimize site speed. You can disable cookies in your web browser preferences.
            </p>

            <h4 className="font-bold text-[#111827] text-sm mt-4">4. Security</h4>
            <p>
              We implement industry-standard database encryption protocols to safeguard contact information and quote queries submitted through our website.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
