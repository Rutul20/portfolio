import type { FC } from 'react'
import type { MilestoneItem } from '../types/portfolio'

const MILESTONES: MilestoneItem[] = [
  {
    id: 'gov-medal',
    title: "Governor's Medal",
    issuer: 'Hon. Governor of Gujarat',
    year: 'HONOUR CONFERRED',
    desc: 'Awarded for supreme discipline, exemplary leadership, and exceptional conduct in the Regular Day Cadet (RDC) Army contingent.',
    badge: 'STATE MERIT',
  },
  {
    id: 'asian-record',
    title: 'Asian Record Holder',
    issuer: 'Asian Records Academy',
    year: 'RECORD ACHIEVED',
    desc: 'Broke records in orchestrating massive youth participation and community mobilization campaigns with measurable social outcomes.',
    badge: 'CONTINENTAL RECORD',
  },
  {
    id: 'cm-medal',
    title: "Chief Minister's Medal",
    issuer: 'Hon. Chief Minister of Gujarat',
    year: 'STATE RECOGNITION',
    desc: 'Recognized by state leadership for public excellence, crisis intervention, and contribution to youth development frameworks.',
    badge: 'GOVERNANCE HONOUR',
  },
  {
    id: 'ncc-a-grade',
    title: 'National Cadet Corps (NCC) — "A" Grade',
    issuer: 'Directorate of NCC, India',
    year: 'MILITARY DISCIPLINE',
    desc: 'Completed rigorous military drills, regimented training, camp logistics, and leadership evaluations with distinction honors.',
    badge: 'MILITARY MERIT',
  },
]

export const Achievements: FC = () => {
  return (
    <section
      id="achievements"
      className="relative flex min-h-screen flex-col justify-center py-24 scroll-mt-20"
    >
      {/* Right-docked floating terminal card (Platform is on track left) */}
      <div className="w-full max-w-2xl xl:max-w-3xl ml-auto mr-0 sm:mr-4 lg:mr-8 pointer-events-auto">
        {/* Section Header */}
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="font-['Geist_Mono'] text-xs font-semibold tracking-widest text-amber-600 uppercase">
            STATION 05 // HONOURS & MEDALS
          </span>
        </div>

        <h2 className="font-['Archivo'] text-4xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          DISTINCTIONS & RECORDS
        </h2>
        <p className="mt-2 font-['Geist_Mono'] text-xs font-semibold tracking-wider text-slate-700 uppercase">
          OFFICIAL CONFERMENTS FROM STATE GOVERNORS, MINISTRIES & CONTINENTAL ACADEMIES
        </p>

        {/* Milestones Grid */}
        <div className="card-metro mt-8 rounded-3xl p-6 sm:p-8 border border-white/80 bg-white/85 backdrop-blur-xl shadow-xl text-slate-900">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {MILESTONES.map((item: MilestoneItem) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-5 shadow-sm transition-all hover:border-amber-400 hover:shadow-md"
              >
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 font-['Geist_Mono'] text-[9px] font-bold tracking-wider text-amber-700 uppercase">
                    {item.badge}
                  </span>
                  <span className="font-['Geist_Mono'] text-[10px] font-bold text-slate-700">{item.year}</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xl">🎖️</span>
                  <h3 className="font-['Archivo'] text-lg font-bold uppercase tracking-wide text-slate-900 transition-colors group-hover:text-amber-600">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-1 font-['Geist_Mono'] text-xs font-bold text-slate-700">
                  CONFERRED BY: <span className="text-slate-900 font-extrabold">{item.issuer}</span>
                </div>

                <p className="mt-3 font-['Geist'] text-xs leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 pt-5 text-xs font-['Geist_Mono']">
            <span className="text-slate-700 font-bold uppercase">VERIFIED MERIT REGISTRY // GUJARAT CORRIDOR</span>
            <span className="text-amber-600 font-bold">100% REGIMENTAL INTEGRITY</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Achievements
