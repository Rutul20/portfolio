import { useState } from 'react'
import type { FC } from 'react'
import type { ExperienceItem } from '../types/portfolio'

const EXPERIENCES: ExperienceItem[] = [
  {
    company: 'Odoo India',
    role: 'Assistant Manager (Events)',
    period: 'JAN 2024 — PRESENT',
    location: 'Gandhinagar / Pan-India',
    badge: 'ACTIVE TERMINUS',
    color: '#0284c7',
    description:
      "Directing Odoo India's premier nationwide event architecture, community engagements, and high-energy developer summits.",
    bullets: [
      'Heading the full production lifecycle for flagship Odoo Hackathons across Indian tech hubs.',
      'Orchestrating industrial visits, university hack leagues, and corporate campus alliances.',
      'Managing Learning & Development (L&D) conventions and massive employee engagement festivals.',
      'Supervising multidisciplinary staging, audio-visual vendors, registration funnels, and VIP logistics.',
    ],
    tags: ['Hackathons', 'Event Architecture', 'L&D Initiatives', 'Academic Tie-ups', 'Vendor Mgmt'],
  },
  {
    company: 'Institute of Rural Management Anand (IRMA)',
    role: 'Program Manager',
    period: 'APR 2023 — SEP 2023',
    location: 'Anand, Gujarat',
    badge: 'TRANSIT INTERCHANGE',
    color: '#d97706',
    description:
      'Spearheaded university-wide events, corporate engagement programs, and talent development workshops at premier rural management institute.',
    bullets: [
      'Facilitated high-profile academic and industry conferences with national delegates.',
      'Managed corporate partnership roadshows, youth engagement, and curriculum delivery schedules.',
      'Streamlined budget allocation and multi-stakeholder operational compliance.',
    ],
    tags: ['Program Management', 'Corporate Roadshows', 'University Engagement', 'Talent Ops'],
  },
  {
    company: 'ECOBHOO Campsite',
    role: 'Operator & Project Lead',
    period: 'JAN 2022 — MAR 2023',
    location: 'Kanekal Island, Gujarat',
    badge: 'ECO HUB',
    color: '#16a34a',
    description:
      'Operated and managed an experiential nature campsite, driving eco-tourism, outdoor education, and local community synergy.',
    bullets: [
      'Secured prestigious SIIP Grant by the Government of Gujarat for pioneering sustainable tourism initiatives.',
      'Oversaw hospitality logistics, guest operations, safety protocols, and curated adventure events.',
      'Achieved viral organic community traction through experiential wilderness storytelling.',
    ],
    tags: ['SIIP Grant Winner', 'Eco-Tourism', 'Wilderness Logistics', 'Community Ops'],
  },
  {
    company: 'Gujarat Tourism, Government of Gujarat',
    role: 'Management Trainee — Niche Tourism',
    period: 'JAN 2021 — DEC 2021',
    location: 'Gandhinagar, Gujarat',
    badge: 'GOV SECTOR',
    color: '#e11d48',
    description:
      'Supported strategic state-level tourism campaigns, festival coordination, and policy documentation for heritage and niche travel sectors.',
    bullets: [
      'Coordinated logistical support for state-wide cultural festivals and official delegation tours.',
      'Researched and drafted policy frameworks for eco-tourism and adventure tourism sites.',
      'Assisted in multi-departmental communications across district tourism offices.',
    ],
    tags: ['Gov Relations', 'Tourism Policy', 'Cultural Summits', 'District Coordination'],
  },
  {
    company: 'Independent Content Creator & Author',
    role: 'Creator & Publisher',
    period: 'OCT 2017 — DEC 2021',
    location: 'Gujarat / Digital',
    badge: 'CREATIVE ORIGIN',
    color: '#7c3aed',
    description:
      'Created and scaled an independent cultural channel and authored the book "Local Passenger", exploring travel culture and authentic stories.',
    bullets: [
      'Published "Local Passenger" — chronicling grassroots transit journeys and community memoirs.',
      'Grew digital audience to 50,000+ through storytelling and experiential documentaries.',
      'Conducted field interviews and cultural documentation across 20+ transit routes.',
    ],
    tags: ['Book Author', 'Audience Growth', 'Storytelling', 'Field Production'],
  },
]

export const Experience: FC = () => {
  const [activeStop, setActiveStop] = useState<number>(0)
  const current: ExperienceItem = EXPERIENCES[activeStop]

  return (
    <section
      id="experience"
      className="relative flex min-h-screen flex-col justify-center py-24 scroll-mt-20"
    >
      {/* Left-docked floating terminal card (Platform is on track right) */}
      <div className="w-full max-w-2xl xl:max-w-3xl mr-auto ml-0 sm:ml-4 lg:ml-8 pointer-events-auto">
        {/* Station Stop Header */}
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-sky-500 shadow-[0_0_12px_rgba(2,132,199,0.6)]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="font-['Geist_Mono'] text-xs font-semibold tracking-widest text-sky-600 uppercase">
            STATION 02 // CAREER INTERCHANGE
          </span>
        </div>

        <h2 className="font-['Archivo'] text-4xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          CHRONOLOGY & HUBS
        </h2>
        <p className="mt-2 font-['Geist_Mono'] text-xs font-semibold tracking-wider text-slate-700 uppercase">
          TRACKING KEY ROLES FROM ECO-TOURISM HUBS TO ENTERPRISE EVENT ARCHITECTURE
        </p>

        {/* Interchange Route Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {EXPERIENCES.map((exp: ExperienceItem, idx: number) => {
            const isSelected: boolean = activeStop === idx
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStop(idx)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 font-['Geist_Mono'] text-xs font-bold transition-all shadow-sm ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'border border-slate-200/90 bg-white/85 text-slate-700 hover:border-sky-400 hover:text-slate-900'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: isSelected ? '#ffffff' : exp.color }}
                />
                <span>{exp.company}</span>
              </button>
            )
          })}
        </div>

        {/* Detail Card */}
        <div className="card-metro mt-6 rounded-3xl p-6 sm:p-8 border border-white/80 bg-white/85 backdrop-blur-xl shadow-xl text-slate-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-['Geist_Mono'] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                  style={{
                    borderColor: `${current.color}60`,
                    backgroundColor: `${current.color}15`,
                    color: current.color,
                  }}
                >
                  {current.badge}
                </span>
                <span className="font-['Geist_Mono'] text-xs font-bold text-slate-700">
                  {current.period}
                </span>
              </div>
              <h3 className="mt-2 font-['Archivo'] text-2xl font-bold uppercase text-slate-900 sm:text-3xl">
                {current.role}
              </h3>
              <div className="font-['Geist_Mono'] text-xs font-semibold text-amber-600 mt-0.5">
                {current.company} · {current.location}
              </div>
            </div>
          </div>

          <p className="font-['Geist'] text-base leading-relaxed text-slate-700">
            {current.description}
          </p>

          {/* Key Deliverables */}
          <div className="mt-6 space-y-2.5">
            <div className="font-['Geist_Mono'] text-[11px] font-bold uppercase tracking-wider text-slate-700">
              CORE RESPONSIBILITIES // MILESTONES:
            </div>
            {current.bullets.map((bullet: string, bIdx: number) => (
              <div key={bIdx} className="flex items-start gap-3 text-sm text-slate-700 font-['Geist']">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: current.color }}
                />
                <span>{bullet}</span>
              </div>
            ))}
          </div>

          {/* Chips */}
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
