import { useState, useEffect } from 'react'
import type { FC } from 'react'
import type { StationId } from '../types/portfolio'

interface HeaderProps {
  activeStation: StationId
  onSelectStation: (id: StationId) => void
}

export const Header: FC<HeaderProps> = ({ activeStation, onSelectStation }) => {
  const [timeString, setTimeString] = useState<string>('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    const updateClock = (): void => {
      const now: Date = new Date()
      const hours: string = String(now.getHours()).padStart(2, '0')
      const minutes: string = String(now.getMinutes()).padStart(2, '0')
      const seconds: string = String(now.getSeconds()).padStart(2, '0')
      setTimeString(`${hours}:${minutes}:${seconds}`)
    }
    updateClock()
    const timer: ReturnType<typeof setInterval> = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  const navLinks: { id: StationId; label: string; code: string }[] = [
    { id: 'about', label: 'Blueprint', code: '01' },
    { id: 'experience', label: 'River Line', code: '02' },
    { id: 'projects', label: 'Portfolio', code: '03' },
    { id: 'skills', label: 'Mountain Pass', code: '04' },
    { id: 'achievements', label: 'Honours', code: '05' },
    { id: 'contact', label: 'City B Terminus', code: '06' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all shadow-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectStation('central')}
            className="flex items-center gap-2.5 text-left transition hover:opacity-85 focus:outline-none"
          >
            {/* Metro Mark Icon */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-xs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-amber-500">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M7 12h10M12 7v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1 font-['Archivo'] text-sm font-bold uppercase tracking-wider text-slate-900">
                <span>SHARDUL</span>
                <span className="text-amber-500">METRO</span>
              </div>
              <div className="font-['Geist_Mono'] text-[9px] uppercase tracking-widest text-slate-700 font-bold">
                LINE 01 · DAYLIGHT EXP
              </div>
            </div>
          </button>

          {/* Line Badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-sky-300 bg-sky-50 px-2.5 py-0.5 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="font-['Geist_Mono'] text-[10px] font-bold tracking-wider text-sky-900 uppercase">
              ANAND ⇄ GANDHINAGAR
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => {
            const isActive: boolean = activeStation === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectStation(item.id)}
                className={`relative px-3 py-1.5 font-['Geist_Mono'] text-xs uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'text-amber-600 font-bold'
                    : 'text-slate-700 hover:text-slate-950 font-semibold'
                }`}
              >
                <span className="mr-1 text-[10px] text-slate-600 font-bold">{item.code}</span>
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Right Tools: Time Clock & Action */}
        <div className="flex items-center gap-3">
          {/* Live Terminal Clock */}
          <div className="hidden font-['Geist_Mono'] text-xs font-semibold text-slate-700 sm:flex sm:items-center sm:gap-2 border border-slate-300 rounded-md px-2.5 py-1 bg-white/90 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] tracking-wider text-slate-600 uppercase font-bold">IST</span>
            <span className="text-slate-900 font-extrabold">{timeString || '12:00:00'}</span>
          </div>

          {/* Quick Connect CTA Button */}
          <button
            type="button"
            onClick={() => onSelectStation('contact')}
            className="flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1.5 font-['Archivo'] text-xs font-bold uppercase tracking-wider text-slate-950 shadow-sm transition hover:bg-amber-400 active:scale-95"
          >
            <span>CONNECT</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#96acd2]/20 bg-[#0d121d] text-[#eef2f8] lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#96acd2]/20 bg-[#05070c]/95 px-6 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectStation(item.id)
                  setMobileMenuOpen(false)
                }}
                className="flex items-center justify-between rounded-lg border border-transparent px-3 py-2.5 text-left font-['Geist_Mono'] text-xs uppercase tracking-wider text-[#aab4c6] transition hover:border-[#96acd2]/20 hover:bg-[#141b2a] hover:text-[#ffb547]"
              >
                <span>{item.label}</span>
                <span className="text-[10px] text-[#8490a6]">{item.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
