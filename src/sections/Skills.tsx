import { useState } from 'react'
import type { FC } from 'react'
import type { SkillCategory } from '../types/portfolio'

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'HACKATHON & EVENT PRODUCTION',
    code: 'OPS-01',
    description: 'Battle-tested mechanics for high-pressure, multi-thousand attendee conferences and marathons.',
    skills: [
      { name: '48-Hour Hackathon Operations', level: 'Mastery', highlight: true },
      { name: 'Large-Scale Staging & Audio-Visuals', level: 'Mastery', highlight: true },
      { name: 'Crowd Flow & Evacuation Protocols', level: 'Advanced' },
      { name: 'Participant Registration & Onboarding', level: 'Mastery' },
      { name: 'Electrical & Server Redundancy Ops', level: 'Advanced' },
      { name: 'F&B and 24/7 Hospitality Supply', level: 'Mastery' },
    ],
  },
  {
    title: 'GOVERNANCE & VENDOR RELATIONS',
    code: 'OPS-02',
    description: 'Navigating state ministries, regulatory sanctions, and commercial procurement.',
    skills: [
      { name: 'State Government Permissions', level: 'Mastery', highlight: true },
      { name: 'Policy Drafting & Regulatory Review', level: 'Advanced' },
      { name: 'Vendor Procurement & RFP Negotiation', level: 'Mastery', highlight: true },
      { name: 'Multi-Lakh Budget Reconciliation', level: 'Mastery' },
      { name: 'Crisis Management & Contingencies', level: 'Mastery' },
      { name: 'VIP Protocols & Diplomatic Security', level: 'Advanced' },
    ],
  },
  {
    title: 'ACADEMIC ALLIANCES & LEADERSHIP',
    code: 'OPS-03',
    description: 'Bridging corporate institutions with premier educational ecosystems.',
    skills: [
      { name: 'University Campus Tie-ups & MoUs', level: 'Mastery', highlight: true },
      { name: 'Industrial Visit Programs', level: 'Mastery' },
      { name: 'Corporate Learning & Development', level: 'Mastery' },
      { name: 'Cross-Functional Volunteer Crew Leads', level: 'Mastery', highlight: true },
      { name: 'Talent Acquisition Hackathons', level: 'Advanced' },
      { name: 'Community Hack Leagues', level: 'Mastery' },
    ],
  },
  {
    title: 'STORYTELLING & MEDIA IMPACT',
    code: 'OPS-04',
    description: 'Transforming technical events into memorable cultural touchpoints.',
    skills: [
      { name: 'Stage Emcee & Keynote Hosting', level: 'Mastery', highlight: true },
      { name: 'Published Literary Authoring', level: 'Mastery', highlight: true },
      { name: 'Cinematic Travel Documentaries', level: 'Advanced' },
      { name: 'Experiential Brand Narrative', level: 'Mastery' },
      { name: 'Press & Media Relations', level: 'Advanced' },
      { name: 'Audience Engagement Strategy', level: 'Mastery' },
    ],
  },
]

export const Skills: FC = () => {
  const [activeTab, setActiveTab] = useState<string>(SKILL_CATEGORIES[0].code)
  const current: SkillCategory = SKILL_CATEGORIES.find((c: SkillCategory) => c.code === activeTab) || SKILL_CATEGORIES[0]

  return (
    <section
      id="skills"
      className="relative flex min-h-screen flex-col justify-center py-24 scroll-mt-20"
    >
      {/* Left-docked floating terminal card (Platform is on track right) */}
      <div className="w-full max-w-2xl xl:max-w-3xl mr-auto ml-0 sm:ml-4 lg:ml-8 pointer-events-auto">
        {/* Section Header */}
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="font-['Geist_Mono'] text-xs font-semibold tracking-widest text-emerald-600 uppercase">
            STATION 04 // OPERATIONS MATRIX
          </span>
        </div>

        <h2 className="font-['Archivo'] text-4xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          CAPABILITIES MATRIX
        </h2>
        <p className="mt-2 font-['Geist_Mono'] text-xs font-semibold tracking-wider text-slate-700 uppercase">
          TACTICAL COMPETENCIES FORGED THROUGH HIGH-STAKES CONFERENCES & LIVE PRODUCTION
        </p>

        {/* Category Pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {SKILL_CATEGORIES.map((cat: SkillCategory) => {
            const isSelected: boolean = cat.code === activeTab
            return (
              <button
                key={cat.code}
                type="button"
                onClick={() => setActiveTab(cat.code)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 font-['Geist_Mono'] text-xs font-bold transition-all shadow-sm ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'border border-slate-200/90 bg-white/85 text-slate-700 hover:border-emerald-400 hover:text-slate-900'
                }`}
              >
                <span>{cat.code}</span>
                <span className="truncate max-w-[140px] hidden sm:inline">{cat.title}</span>
              </button>
            )
          })}
        </div>

        {/* Active Category Card */}
        <div className="card-metro mt-6 rounded-3xl p-6 sm:p-8 border border-white/80 bg-white/85 backdrop-blur-xl shadow-xl text-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div>
              <span className="font-['Geist_Mono'] text-xs font-bold text-emerald-600">
                {current.code} // CLUSTER
              </span>
              <h3 className="mt-1 font-['Archivo'] text-2xl font-bold uppercase tracking-wide text-slate-900">
                {current.title}
              </h3>
            </div>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-['Geist_Mono'] text-[10px] font-bold text-emerald-700 uppercase">
              ACTIVE READY
            </span>
          </div>

          <p className="mt-4 font-['Geist'] text-sm text-slate-600">
            {current.description}
          </p>

          {/* Skills Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {current.skills.map((skill: { name: string; level: string; highlight?: boolean }, idx: number) => (
              <div
                key={idx}
                className={`flex items-center justify-between rounded-xl border p-3 font-['Geist_Mono'] text-xs transition-colors ${
                  skill.highlight
                    ? 'border-emerald-300 bg-emerald-50/70 text-slate-900 font-semibold shadow-xs'
                    : 'border-slate-200/90 bg-white/70 text-slate-700'
                }`}
              >
                <span>{skill.name}</span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200/80 pt-4 text-xs font-['Geist_Mono'] text-slate-700 font-semibold">
            <span>TOTAL PROFICIENCIES: 24+ OPERATIONAL MECHANICS</span>
            <span className="text-emerald-600 font-bold">ZERO DEFECT EXECUTION</span>
          </div>
        </div>
      </div>
    </section>
  )
}
