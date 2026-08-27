const steps = [
  { num: '01', label: 'Requirement Discussion' },
  { num: '02', label: 'Product Selection' },
  { num: '03', label: 'Quotation' },
  { num: '04', label: 'Order Processing' },
  { num: '05', label: 'Delivery' },
]

export default function ProcessSection() {
  return (
    <section className="py-20 lg:py-28 bg-[#0B1220] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-[#7BA7E8] font-semibold">
            How we work
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-3 leading-[1.1]">
            From requirement to delivery — a clear, structured process.
          </h2>
        </div>

        {/* Steps */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-0">
          {steps.map((step, i) => (
            <div
              key={step.num}
              data-testid={`process-step-${i}`}
              className="relative md:px-4"
            >
              <div className="flex md:block items-center gap-4">
                <div className="w-12 h-12 border border-white/30 grid place-items-center text-lg font-extrabold shrink-0">
                  {step.num}
                </div>
                <h4 className="text-base md:text-lg font-bold md:mt-5">
                  {step.label}
                </h4>
              </div>
              {/* Connector line — hidden on last item */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 right-0 w-1/2 h-px bg-white/20" />
              )}
              {/* Left half connector */}
              {i > 0 && (
                <div className="hidden md:block absolute top-6 left-0 w-1/2 h-px bg-white/20" />
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
