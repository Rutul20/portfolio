import type { FC } from 'react'
import type { StationId, StationConfig } from '../types/portfolio'

interface RouteMapProps {
  activeStation: StationId
  onSelectStation: (id: StationId) => void
}

const STATIONS: StationConfig[] = [
  { id: 'central', code: 'ST-00', title: 'Anand Central', subtitle: 'Departure', color: '#ffb547' },
  { id: 'about', code: 'ST-01', title: 'Blueprint', subtitle: 'Overview', color: '#ff7d8f' },
  { id: 'experience', code: 'ST-02', title: 'River Crossing', subtitle: 'Timeline', color: '#6fd0ff' },
  { id: 'projects', code: 'ST-03', title: 'Portfolio', subtitle: 'Initiatives', color: '#a993ff' },
  { id: 'skills', code: 'ST-04', title: 'Mountain Pass', subtitle: 'Matrix', color: '#c6e66b' },
  { id: 'achievements', code: 'ST-05', title: 'Honours', subtitle: 'Milestones', color: '#ffd166' },
  { id: 'contact', code: 'ST-06', title: 'City B Concourse', subtitle: 'Terminus', color: '#53e0c2' },
]

export const RouteMap: FC<RouteMapProps> = ({ activeStation, onSelectStation }) => {
  // Find index of active station to position the train car
  const activeIndex: number = STATIONS.findIndex((s) => s.id === activeStation)
  const safeIndex: number = activeIndex === -1 ? 0 : activeIndex

  // Each node is spaced at 40px (gap-6 + h-4)
  // Distance between stations is 40px
  const trainTopOffset: number = safeIndex * 40 + 2

  return (
    <aside className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="flex flex-col items-end">
        {/* Header title */}
        <div className="mb-4 pr-1 font-['Geist_Mono'] text-[9px] font-semibold uppercase tracking-[0.25em] text-[#8490a6]">
          METRO ROUTE MAP
        </div>

        {/* The Track Container */}
        <div className="relative flex flex-col items-center py-2 pr-1.5">
          {/* Vertical Track Rail */}
          <div
            className="absolute top-2 bottom-2 w-[2px] rounded-full"
            style={{
              background:
                'linear-gradient(180deg, #ffb547 0%, #ff7d8f 20%, #6fd0ff 40%, #a993ff 60%, #c6e66b 80%, #53e0c2 100%)',
              opacity: 0.4,
              right: '9px',
            }}
          />

          {/* Miniature Metro Bullet Train Indicator riding on the rail */}
          <div
            className="pointer-events-none absolute z-30 transition-all duration-500 ease-out"
            style={{
              top: `${trainTopOffset}px`,
              right: '4px',
            }}
          >
            {/* Train Capsule Icon */}
            <div className="relative h-5 w-3 rounded-t-full rounded-b-[3px] bg-gradient-to-b from-white to-[#cfd6e2] shadow-[0_0_0_2px_#05070c,0_0_12px_#ffb547]">
              {/* Dark windshield */}
              <div className="absolute top-1 left-0.5 right-0.5 h-1 rounded-sm bg-[#0d121d]" />
              {/* Headlight glow */}
              <div className="absolute -bottom-0.5 left-0.5 right-0.5 h-0.5 rounded-full bg-[#ffb547] shadow-[0_0_6px_#ffb547]" />
            </div>
          </div>

          {/* Station Stop Nodes */}
          <div className="relative flex flex-col gap-6">
            {STATIONS.map((station: StationConfig) => {
              const isActive: boolean = activeStation === station.id
              return (
                <div key={station.id} className="group relative flex items-center justify-end">
                  {/* Tooltip / Station Tag on Hover or when Active */}
                  <div
                    className={`pointer-events-none absolute right-7 flex items-center gap-2 whitespace-nowrap rounded-lg border px-2.5 py-1 text-right backdrop-blur-md transition-all duration-200 shadow-sm ${
                      isActive
                        ? 'border-amber-400 bg-white/95 opacity-100 translate-x-0'
                        : 'border-slate-200 bg-white/80 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1'
                    }`}
                  >
                    <span className="font-['Geist_Mono'] text-[9px] uppercase tracking-wider text-slate-700 font-bold">
                      {station.code}
                    </span>
                    <span
                      className={`font-['Archivo'] text-xs uppercase tracking-wide ${
                        isActive ? 'font-bold text-amber-600' : 'text-slate-800'
                      }`}
                    >
                      {station.title}
                    </span>
                  </div>

                  {/* Station Node Button */}
                  <button
                    type="button"
                    onClick={() => onSelectStation(station.id)}
                    aria-label={`Go to ${station.title}`}
                    className="relative flex h-4 w-4 items-center justify-center focus:outline-none"
                  >
                    {/* Ring highlight if active */}
                    {isActive && (
                      <span
                        className="absolute h-5 w-5 rounded-full border border-[#ffb547] animate-ping opacity-75"
                        style={{ borderColor: station.color }}
                      />
                    )}

                    {/* Outer Circle */}
                    <div
                      className={`h-3 w-3 rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? 'scale-125 border-white bg-[#ffb547] shadow-[0_0_12px_#ffb547]'
                          : 'border-[#96acd2]/40 bg-[#05070c] group-hover:border-[#ffb547]/80 group-hover:scale-110'
                      }`}
                      style={{
                        backgroundColor: isActive ? station.color : '#05070c',
                        borderColor: isActive ? '#ffffff' : undefined,
                      }}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
