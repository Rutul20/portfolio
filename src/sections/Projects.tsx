import { useState } from 'react'
import type { FC } from 'react'
import type { ProjectItem } from '../types/portfolio'

const PROJECTS: ProjectItem[] = [
  {
    id: 'odoo-hackathons',
    title: 'Odoo India Flagship Hackathons',
    subtitle: 'High-Impact Developer Marathons & Tech Ecosystem Summits',
    category: 'TECH SUMMITS & HACKATHONS',
    scale: '5,000+ PARTICIPANTS · PAN-INDIA',
    status: 'OPERATIONAL',
    description:
      'Architecting end-to-end hackathon infrastructure across premier engineering campuses and tech convention centers. Managing 48-hour continuous operations, mentor tracks, judging protocols, and live broadcast production.',
    highlights: [
      'Engineered zero-downtime operational flow for 1,000+ simultaneous in-person coders.',
      'Led multidisciplinary crew: staging, electrical redundancy, security, and catering logistics.',
      'Achieved 98% participant satisfaction score and direct recruitment pipeline conversion.',
    ],
    tags: ['Hackathons', 'Event Tech', 'Stage Direction', 'Sponsor Alignment', 'Large-Scale Ops'],
  },
  {
    id: 'gujarat-tourism',
    title: 'Gujarat Tourism Governance & Summits',
    subtitle: 'State-Level Policy Support & Cultural Promotion Campaigns',
    category: 'PUBLIC POLICY & TOURISM',
    scale: 'STATE-WIDE IMPACT // TCGL',
    status: 'COMPLETED',
    description:
      'Executed high-level administrative tasks, policy framework drafting, and logistical coordination for Gujarat Tourism exhibitions and cultural festivals under the Niche Tourism Department.',
    highlights: [
      'Facilitated inter-agency government approvals and safety compliance documentation.',
      'Coordinated VIP protocol arrangements for foreign dignitaries and state ministers.',
      'Supported targeted digital and on-ground marketing campaigns boosting footfall.',
    ],
    tags: ['Govt Permissions', 'Policy Drafting', 'VIP Protocols', 'Public Relations'],
  },
  {
    id: 'local-passenger',
    title: 'Local Passenger (Published Book)',
    subtitle: 'Critically Acclaimed Short Story Anthology on Indian Railways',
    category: 'LITERARY & CULTURAL MEDIA',
    scale: 'NATIONAL & INTERNATIONAL CIRCULATION',
    status: 'COMPLETED',
    description:
      'Authored and published a widely-read anthology capturing human resilience, serendipity, and transit emotions aboard the Indian railway network. Bridges Shardul’s passion for transit aesthetics with heartfelt storytelling.',
    highlights: [
      'Featured across literary platforms, press columns, and university panel discussions.',
      'Sold thousands of copies nationwide, connecting with everyday commuters and travelers.',
      'Informed his signature empathetic approach to community and audience engagement.',
    ],
    tags: ['Book Author', 'Creative Writing', 'Media Relations', 'Story Architecture'],
  },
  {
    id: 'ecobhoo-campsite',
    title: 'ECOBHOO Island Campsite Initiative',
    subtitle: 'Sustainable Eco-Tourism Retreat on Kanekal Island',
    category: 'SUSTAINABLE OUTDOOR EXPERIENCES',
    scale: 'SIIP GRANT RECIPIENT · GOVT OF GUJARAT',
    status: 'COMPLETED',
    description:
      'Founded and directed outdoor operations for an eco-sensitive nature campsite. Managed island logistics, waste-neutral hospitality systems, and community empowerment programs.',
    highlights: [
      'Won competitive SIIP Grant from Government of Gujarat for sustainable innovation.',
      'Maintained 100% safety record across all wilderness and water adventure excursions.',
      'Empowered local island youth with seasonal hospitality and guiding employment.',
    ],
    tags: ['SIIP Grant Winner', 'Eco-Tourism', 'Risk Mitigation', 'Community Tourism'],
  },
]

export const Projects: FC = () => {
  const [selectedId, setSelectedId] = useState<string>(PROJECTS[0].id)
  const current: ProjectItem = PROJECTS.find((p: ProjectItem) => p.id === selectedId) || PROJECTS[0]

  return (
    <section
      id="projects"
      className="relative flex min-h-screen flex-col justify-center py-24 scroll-mt-20"
    >
      {/* Right-docked floating terminal card (Platform is on track left) */}
      <div className="w-full max-w-2xl xl:max-w-3xl ml-auto mr-0 sm:mr-4 lg:mr-8 pointer-events-auto">
        {/* Section Header */}
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="font-['Geist_Mono'] text-xs font-semibold tracking-widest text-indigo-600 uppercase">
            STATION 03 // PORTFOLIO JUNCTION
          </span>
        </div>

        <h2 className="font-['Archivo'] text-4xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          FLAGSHIP INITIATIVES
        </h2>
        <p className="mt-2 font-['Geist_Mono'] text-xs font-semibold tracking-wider text-slate-700 uppercase">
          MULTI-CITY HACKATHONS, STATE PROJECTS & CULTURAL MEDIA
        </p>

        {/* Project Selector Pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {PROJECTS.map((proj: ProjectItem) => {
            const isSelected: boolean = proj.id === selectedId
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => setSelectedId(proj.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 font-['Geist_Mono'] text-xs font-bold transition-all shadow-sm ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'border border-slate-200/90 bg-white/85 text-slate-700 hover:border-indigo-400 hover:text-slate-900'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-indigo-500'
                  }`}
                />
                <span className="truncate max-w-[180px]">{proj.title}</span>
              </button>
            )
          })}
        </div>

        {/* Active Project Dossier */}
        <div className="card-metro mt-6 rounded-3xl p-6 sm:p-8 border border-white/80 bg-white/85 backdrop-blur-xl shadow-xl text-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <span className="font-['Geist_Mono'] text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
                {current.category}
              </span>
              <h3 className="mt-1 font-['Archivo'] text-2xl font-bold uppercase text-slate-900 sm:text-3xl">
                {current.title}
              </h3>
              <p className="font-['Geist_Mono'] text-xs font-semibold text-amber-600 mt-0.5">
                {current.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 font-['Geist_Mono'] text-[10px] font-bold text-indigo-700 uppercase">
                {current.scale}
              </span>
            </div>
          </div>

          <p className="mt-5 font-['Geist'] text-base leading-relaxed text-slate-700">
            {current.description}
          </p>

          {/* Operational Highlights */}
          <div className="mt-6 space-y-2.5">
            <div className="font-['Geist_Mono'] text-[11px] font-bold uppercase tracking-wider text-slate-700">
              EXECUTION HIGHLIGHTS // METRICS:
            </div>
            {current.highlights.map((highlight: string, hIdx: number) => (
              <div key={hIdx} className="flex items-start gap-3 text-sm text-slate-700 font-['Geist']">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200/80 pt-5">
            {current.tags.map((tag: string, tIdx: number) => (
              <span
                key={tIdx}
                className="rounded-full border border-slate-200 bg-slate-100/80 px-3 py-1 font-['Geist_Mono'] text-[11px] font-medium text-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
