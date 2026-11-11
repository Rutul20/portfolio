import type { FC } from 'react'
import type { StationId } from '../types/portfolio'

interface HeroProps {
  onExplore: (id: StationId) => void
}

export const Hero: FC<HeroProps> = ({ onExplore }) => {
  const flapWords: string[] = [
    'E', 'V', 'E', 'N', 'T', 'S', '·',
    'H', 'A', 'C', 'K', 'A', 'T', 'H', 'O', 'N', 'S'
  ]

  return (
    <section
      id="central"
      className="relative flex min-h-screen flex-col justify-center pt-24 pb-16"
    >
      {/* Left/Center floating translucent terminal card: leaves right side open for 3D train & station */}
      <div className="w-full max-w-2xl xl:max-w-3xl ml-0 sm:ml-4 lg:ml-8 pointer-events-auto">
        {/* Terminal Header Tag */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-500/10 px-3.5 py-1 text-amber-600 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-['Geist_Mono'] text-xs font-semibold tracking-widest uppercase">
              TERMINAL 00 · CITY A CENTRAL PLATFORM
            </span>
          </div>

          <div className="font-['Geist_Mono'] text-xs tracking-wider text-slate-600 uppercase">
            ORIGIN // ANAND · GUJARAT · IN
          </div>
        </div>

        {/* Departure Board Flip Ribbon */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5 font-['Geist_Mono'] text-xs font-bold text-slate-900">
          <span className="mr-2 text-[10px] tracking-widest text-slate-700 font-bold uppercase">DEPARTURE:</span>
          {flapWords.map((char: string, index: number) => (
            <div
              key={index}
              className="flap-cell flex h-7 w-6 items-center justify-center font-['Geist_Mono'] text-xs font-bold text-amber-400 bg-slate-900 rounded-sm shadow-sm"
            >
              {char}
            </div>
          ))}
        </div>

        {/* Main Headline */}
        <div className="mb-6">
          <h1 className="font-['Archivo'] text-5xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-7xl md:text-8xl">
            SHARDUL <span className="text-amber-500">DAVE</span>
          </h1>
          <p className="mt-3 font-['Archivo'] text-xl font-bold uppercase tracking-wider text-slate-700 sm:text-2xl">
            Assistant Manager (Events) · Odoo India
          </p>
          <p className="mt-1 font-['Geist_Mono'] text-xs tracking-wider text-amber-600 uppercase font-semibold">
            HIGH-OCTANE CORPORATE SUMMITS · TECH HACKATHONS · STRATEGIC OPERATIONS
          </p>
        </div>

        {/* Translucent Boarding Pass Card */}
        <div className="card-metro mb-8 rounded-3xl p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-['Geist_Mono'] text-xs font-bold uppercase tracking-widest text-amber-600">
                [ SYSTEM REF: SD-2024 ]
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="font-['Geist_Mono'] text-xs text-slate-600">5+ YEARS ZERO-DEFECT EXECUTION</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-['Geist_Mono'] text-[10px] font-semibold tracking-wider uppercase">
                STATUS: READY FOR BOARDING
              </span>
            </div>
          </div>

          <p className="font-['Geist'] text-base leading-relaxed text-slate-700 sm:text-lg">
            Impact-driven event architect managing nationwide developer summits, corporate conventions, and experiential
            programs. Transforming high-level conceptual blueprints into precision on-ground realities with military-cadet
            discipline.
          </p>

          {/* Quick Route Meta */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200/80 pt-5 sm:grid-cols-4 font-['Geist_Mono'] text-xs">
            <div>
              <div className="text-[10px] tracking-wider text-slate-700 font-bold uppercase">ORIGIN // CITY A</div>
              <div className="mt-1 font-bold text-slate-900">Anand Hub</div>
            </div>
            <div>
              <div className="text-[10px] tracking-wider text-slate-700 font-bold uppercase">DESTINATION // CITY B</div>
              <div className="mt-1 font-bold text-emerald-600">Gandhinagar Capital</div>
            </div>
            <div>
              <div className="text-[10px] tracking-wider text-slate-700 font-bold uppercase">SCALE CAPACITY</div>
              <div className="mt-1 font-bold text-slate-900">10K+ Attendees</div>
            </div>
            <div>
              <div className="text-[10px] tracking-wider text-slate-700 font-bold uppercase">HONOURS</div>
              <div className="mt-1 font-bold text-sky-600">Gov. Medal & Asian Rec.</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons & 3D Interactive Prompt */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => onExplore('about')}
            className="flex items-center gap-2.5 rounded-full bg-amber-500 px-7 py-3.5 font-['Archivo'] text-xs font-bold uppercase tracking-widest text-slate-950 shadow-md transition-all hover:bg-amber-400 hover:scale-105 active:scale-95"
          >
            <span>BOARD 3D METRO // START RIDE</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onExplore('contact')}
            className="flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-6 py-3.5 font-['Archivo'] text-xs font-bold uppercase tracking-widest text-slate-800 backdrop-blur-md transition-all hover:border-amber-400 hover:bg-white hover:text-amber-600 shadow-xs"
          >
            <span>GET IN TOUCH</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2 text-xs font-['Geist_Mono'] text-slate-800 font-bold ml-2">
            <span className="inline-block h-2 w-2 rounded-full bg-sky-500 animate-ping" />
            <span className="uppercase tracking-wider text-[11px]">SCROLL TO RIDE THE 3D TRACK ↓</span>
          </div>
        </div>

        {/* Quick Numbers Bar */}
        <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200/90 bg-white/90 p-5 sm:grid-cols-4 backdrop-blur-md shadow-md">
          <div className="border-r border-slate-200 pr-4 last:border-none">
            <div className="font-['Archivo'] text-3xl font-extrabold text-amber-500">5+</div>
            <div className="mt-1 font-['Geist_Mono'] text-[11px] uppercase tracking-wider text-slate-700 font-bold">
              Years Experience
            </div>
          </div>
          <div className="border-r border-slate-200 pr-4 last:border-none">
            <div className="font-['Archivo'] text-3xl font-extrabold text-sky-600">20+</div>
            <div className="mt-1 font-['Geist_Mono'] text-[11px] uppercase tracking-wider text-slate-700 font-bold">
              Hackathons & Summits
            </div>
          </div>
          <div className="border-r border-slate-200 pr-4 last:border-none">
            <div className="font-['Archivo'] text-3xl font-extrabold text-indigo-600">50K+</div>
            <div className="mt-1 font-['Geist_Mono'] text-[11px] uppercase tracking-wider text-slate-700 font-bold">
              Audience Engaged
            </div>
          </div>
          <div>
            <div className="font-['Archivo'] text-3xl font-extrabold text-emerald-600">01</div>
            <div className="mt-1 font-['Geist_Mono'] text-[11px] uppercase tracking-wider text-slate-700 font-bold">
              Published Book
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
