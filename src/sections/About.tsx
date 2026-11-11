import type { FC } from 'react'

export const About: FC = () => {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col justify-center py-24 scroll-mt-20"
    >
      {/* Right-docked floating terminal card (Platform is on track left) */}
      <div className="w-full max-w-2xl xl:max-w-3xl ml-auto mr-0 sm:mr-4 lg:mr-8 pointer-events-auto">
        {/* Station Stop Header */}
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="font-['Geist_Mono'] text-xs font-semibold tracking-widest text-rose-600 uppercase">
            STATION 01 // OVERVIEW & BLUEPRINT
          </span>
        </div>

        <h2 className="font-['Archivo'] text-4xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          THE JOURNEY SO FAR
        </h2>
        <p className="mt-2 font-['Geist_Mono'] text-xs font-semibold tracking-wider text-slate-700 uppercase">
          ARCHITECTING HIGH-OCTANE EXPERIENCES ACROSS TECH, GOVERNANCE & COMMUNITY
        </p>

        {/* Blueprint Container */}
        <div className="card-metro mt-8 rounded-3xl p-6 sm:p-8 border border-white/80 bg-white/85 backdrop-blur-xl shadow-xl text-slate-900">
          <div className="mb-5 flex items-center justify-between border-b border-slate-200/80 pb-3">
            <span className="font-['Geist_Mono'] text-xs font-bold text-amber-600">
              SYS // EXECUTIVE SUMMARY
            </span>
            <span className="font-['Geist_Mono'] text-[10px] font-semibold text-slate-600">TERMINAL: BLUEPRINT · PLATFORM 1</span>
          </div>

          <p className="font-['Geist'] text-base leading-relaxed text-slate-700 sm:text-lg">
            <span className="font-semibold text-slate-900">Shardul Dave</span> is an impact-driven event architect with
            over 5 years of mastery in curating corporate summits, multi-city hackathons, and high-engagement youth
            programs. Specializing in crafting seamless, structured, and outcome-led experiences for global brands, he
            manages the complete event continuum — from conceptual blueprint and policy analysis to precision on-ground
            logistics.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900">
                <span className="font-['Geist_Mono'] text-xs font-bold text-amber-600">01.</span>
                <h3 className="font-['Archivo'] text-sm font-bold uppercase tracking-wider">
                  OPERATIONAL DISCIPLINE
                </h3>
              </div>
              <p className="mt-2 font-['Geist'] text-xs leading-relaxed text-slate-600">
                Grounded in military-cadet precision and zero-defect execution. Whether handling 5,000+ hackathon
                attendees or an intimate board delegation, every timeline is measured and controlled.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900">
                <span className="font-['Geist_Mono'] text-xs font-bold text-sky-600">02.</span>
                <h3 className="font-['Archivo'] text-sm font-bold uppercase tracking-wider">
                  TECH & COMMUNITY SCALE
                </h3>
              </div>
              <p className="mt-2 font-['Geist'] text-xs leading-relaxed text-slate-600">
                Deeply integrated with tech communities, colleges, and developer hubs. Building developer engagement
                ecosystems from the ground up that generate sustainable long-term ROI.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900">
                <span className="font-['Geist_Mono'] text-xs font-bold text-indigo-600">03.</span>
                <h3 className="font-['Archivo'] text-sm font-bold uppercase tracking-wider">
                  GOVERNMENT & SIIP ALLIANCE
                </h3>
              </div>
              <p className="mt-2 font-['Geist'] text-xs leading-relaxed text-slate-600">
                Recipient of the SIIP Grant from the Government of Gujarat. Skilled in public-sector protocols,
                administrative permissions, and high-stakes dignitary facilitation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900">
                <span className="font-['Geist_Mono'] text-xs font-bold text-emerald-600">04.</span>
                <h3 className="font-['Archivo'] text-sm font-bold uppercase tracking-wider">
                  NARRATIVE & TRANSIT AUTHOR
                </h3>
              </div>
              <p className="mt-2 font-['Geist'] text-xs leading-relaxed text-slate-600">
                Author of <em>Local Passenger</em>, capturing the pulse of railway journeys and human encounters. Bringing
                storytelling and authentic human touch to corporate events.
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 pt-5 text-xs font-['Geist_Mono']">
            <div>
              <span className="text-slate-600 font-semibold uppercase text-[10px]">CURRENT ROLE:</span>
              <span className="ml-2 font-bold text-slate-900">Assistant Manager (Events) · Odoo India</span>
            </div>
            <div>
              <span className="text-slate-600 font-semibold uppercase text-[10px]">CORRIDOR:</span>
              <span className="ml-2 font-bold text-rose-600">Anand ⇄ Pan-India</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
