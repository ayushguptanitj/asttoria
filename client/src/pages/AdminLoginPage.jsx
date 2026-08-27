import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem('admin_token')
    if (token) {
      navigate('/admin')
    }
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('admin_token', data.token)
        navigate('/admin')
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch (err) {
      setError('Cannot connect to admin server. Please ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#0A4FAF]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#7BA7E8]/5 blur-[120px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl relative">
        
        {/* Brand/Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0A4FAF] text-white font-black text-xl mb-4 shadow-lg shadow-[#0A4FAF]/20">
            A
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">ASTTORIA ADMIN</h1>
          <p className="text-xs text-white/50 uppercase tracking-[0.2em] mt-1.5">Control Panel Login</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-200 text-xs rounded-sm flex items-start gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] focus:ring-2 focus:ring-[#0A4FAF]/20 outline-none pl-11 pr-4 py-3.5 text-sm text-white rounded-lg transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-white/[0.04] border border-white/10 focus:border-[#0A4FAF] focus:ring-2 focus:ring-[#0A4FAF]/20 outline-none pl-11 pr-4 py-3.5 text-sm text-white rounded-lg transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A4FAF] hover:bg-[#083D87] disabled:bg-[#0A4FAF]/50 text-white font-bold py-4 rounded-lg shadow-lg shadow-[#0A4FAF]/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-8 text-sm cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Authenticating...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a href="/" className="text-xs text-white/40 hover:text-white transition-colors">
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  )
}
