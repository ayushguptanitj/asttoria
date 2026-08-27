export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/919447390415?text=Hello%2C%20I%20would%20like%20a%20quotation."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5b] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
    >
      {/* Ping ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />

      {/* WhatsApp icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10"
        aria-hidden="true"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
    </a>
  )
}
