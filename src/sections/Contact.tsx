import { useState } from 'react'
import type { FC } from 'react'

export const Contact: FC = () => {
  const [emailCopied, setEmailCopied] = useState<boolean>(false)
  const [phoneCopied, setPhoneCopied] = useState<boolean>(false)
  const emailAddress: string = 'sharduldave13@gmail.com'
  const phoneNumber: string = '+91 9033160131'
  const phoneDial: string = '+919033160131'

  const handleCopyEmail = (): void => {
    navigator.clipboard.writeText(emailAddress)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2500)
  }

  const handleCopyPhone = (): void => {
    navigator.clipboard.writeText(phoneNumber)
    setPhoneCopied(true)
    setTimeout(() => setPhoneCopied(false), 2500)
  }

  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col justify-center py-28 scroll-mt-20"
    >
      {/* Left-docked floating terminal card (Platform is on track right) */}
      <div className="w-full max-w-2xl xl:max-w-3xl mr-auto ml-0 sm:ml-4 lg:ml-8 pointer-events-auto">
        {/* Section Header */}
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          <span className="font-['Geist_Mono'] text-xs font-semibold tracking-widest text-emerald-600 uppercase">
            STATION 06 // CONCOURSE TERMINUS
          </span>
        </div>

        <h2 className="font-['Archivo'] text-4xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          LET'S CONNECT
        </h2>
        <p className="mt-2 font-['Geist_Mono'] text-xs font-semibold tracking-wider text-slate-700 uppercase">
          FINAL PLATFORM // DISCUSSING HIGH-IMPACT HACKATHONS, PRODUCTION ADVISORY & ALLIANCES
        </p>

        {/* Boarding Concourse Pass */}
        <div className="card-metro mt-8 overflow-hidden rounded-3xl border border-white/80 bg-white/85 backdrop-blur-xl shadow-xl text-slate-900">
          {/* Ticket Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-slate-50/90 px-6 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="font-['Geist_Mono'] text-xs font-bold uppercase tracking-widest text-amber-600">
                TICKET // BOARDING PASS
              </span>
              <span className="font-['Geist_Mono'] text-[10px] font-semibold text-slate-600">
                SERIAL: SD-PASS-2024
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-['Geist_Mono'] text-[10px] font-bold tracking-wider uppercase">
                INQUIRIES OPEN
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="font-['Geist'] text-base leading-relaxed text-slate-700">
              Whether you are architecting a nationwide hackathon, planning a corporate summit, or looking to exchange
              perspectives on transit stories and experiential operations — my channels are open.
            </p>

            {/* Channels Grid */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Direct Phone / Call Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white/85 p-4 shadow-sm transition hover:border-emerald-400">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="font-['Geist_Mono'] text-[10px] font-bold uppercase tracking-wider">
                      PHONE
                    </span>
                  </div>
                  <div className="mt-2 font-['Geist_Mono'] text-xs font-bold text-slate-900 break-all">
                    {phoneNumber}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href={`tel:${phoneDial}`}
                    className="flex-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-center font-['Archivo'] text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    CALL
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="rounded-lg border border-slate-300 px-2.5 py-1.5 font-['Geist_Mono'] text-[10px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    {phoneCopied ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white/85 p-4 shadow-sm transition hover:border-amber-400">
                <div>
                  <div className="flex items-center gap-2 text-amber-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span className="font-['Geist_Mono'] text-[10px] font-bold uppercase tracking-wider">
                      INBOX
                    </span>
                  </div>
                  <div className="mt-2 font-['Geist_Mono'] text-xs font-bold text-slate-900 break-all">
                    {emailAddress}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href={`mailto:${emailAddress}`}
                    className="flex-1 rounded-lg bg-amber-500 px-3 py-1.5 text-center font-['Archivo'] text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-sm transition hover:bg-amber-600"
                  >
                    MAIL
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="rounded-lg border border-slate-300 px-2.5 py-1.5 font-['Geist_Mono'] text-[10px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    {emailCopied ? 'COPIED!' : 'COPY'}
                  </button>
                </div>
              </div>

              {/* LinkedIn Card */}
              <a
                href="https://www.linkedin.com/in/shardul-dave-7240ab105/"
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white/85 p-4 shadow-sm transition hover:border-sky-400"
              >
                <div>
                  <div className="flex items-center gap-2 text-sky-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <span className="font-['Geist_Mono'] text-[10px] font-bold uppercase tracking-wider">
                      LINKEDIN
                    </span>
                  </div>
                  <div className="mt-2 font-['Archivo'] text-base font-bold text-slate-900 transition-colors group-hover:text-sky-600">
                    Shardul Dave
                  </div>
                  <div className="mt-0.5 font-['Geist_Mono'] text-[11px] font-semibold text-slate-600">
                    /in/shardul-dave
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 font-['Geist_Mono'] text-[11px] font-semibold text-sky-600">
                  <span>CONNECT</span>
                  <span>→</span>
                </div>
              </a>
            </div>

            {/* Terminal Concourse Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 pt-5 font-['Geist_Mono'] text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span>📍 TERMINUS // CITY B:</span>
                <span className="font-bold text-slate-900">Gandhinagar Capital Concourse · Gujarat</span>
              </div>
              <div className="text-slate-600">
                <span>EXP 01 HIGH-SPEED CORRIDOR // COMPLETED ROUTE</span>
              </div>
            </div>
          </div>
        </div>

        {/* High-Contrast Frosted Glass Footer */}
        <footer className="mt-14 pb-14 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-300/90 bg-white/95 px-6 py-3.5 shadow-xl shadow-slate-900/10 backdrop-blur-md">
            <span className="inline-flex items-center gap-2 font-['Geist_Mono'] text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
              LIVE TELEMETRY
            </span>
            <span className="text-slate-300">|</span>
            <p className="font-['Geist_Mono'] text-xs font-bold text-slate-800">
              © {new Date().getFullYear()} Shardul Dave · All Rights Reserved · Anand ⇄ Gandhinagar Daylight Metro
            </p>
          </div>
        </footer>
      </div>
    </section>
  )
}

export default Contact
