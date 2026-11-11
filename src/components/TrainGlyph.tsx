import type { FC } from 'react'

interface TrainGlyphProps {
  cars?: number
  spinning?: boolean
  className?: string
  scale?: number
}

let glyphCounter: number = 0

export const TrainGlyph: FC<TrainGlyphProps> = ({
  cars = 3,
  spinning = false,
  className = '',
}) => {
  const gradientId: string = `train-metallic-${++glyphCounter}`
  const totalWidth: number = cars * 64 + 16

  return (
    <svg
      className={`train ${spinning ? 'is-spinning' : ''} ${className}`}
      viewBox={`0 0 ${totalWidth} 42`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >
      <defs>
        {/* Metallic train body gradient */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f6fa" />
          <stop offset="45%" stopColor="#dfe4ec" />
          <stop offset="75%" stopColor="#c5cdd8" />
          <stop offset="100%" stopColor="#9da8b8" />
        </linearGradient>

        {/* Headlight beam gradient */}
        <linearGradient id="headlight-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffb547" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#ffb547" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffb547" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Headlight beam projection forward if car 1 (front) */}
      <polygon
        points={`${totalWidth - 8},26 ${totalWidth + 50},14 ${totalWidth + 50},38`}
        fill="url(#headlight-beam)"
        opacity={0.65}
      />

      {/* Render train carriages */}
      {Array.from({ length: cars }).map((_: unknown, carIdx: number) => {
        // carIdx = 0 is lead car (front), others are passenger trailers
        const isLeadCar: boolean = carIdx === cars - 1
        const xOffset: number = (cars - 1 - carIdx) * 64 + 2

        return (
          <g key={carIdx} transform={`translate(${xOffset}, 0)`}>
            {/* Main car body */}
            {isLeadCar ? (
              // Aerodynamic nose for lead locomotive
              <path
                d="M4 8h36c10 0 17 6 20 15v5c0 2-1.5 3.5-3.5 3.5H4c-2 0-3.5-1.5-3.5-3.5V11.5C.5 9.5 2 8 4 8Z"
                fill={`url(#${gradientId})`}
              />
            ) : (
              // Rectangular passenger coach
              <rect
                x="0.5"
                y="8"
                width="60"
                height="23.5"
                rx="4"
                fill={`url(#${gradientId})`}
              />
            )}

            {/* Dark window band cutout */}
            <rect
              x={6}
              y="12.5"
              width={isLeadCar ? 32 : 48}
              height="7"
              rx="2"
              fill="#0d121d"
            />

            {/* Glowing amber interior passenger windows */}
            <rect
              x={8}
              y="13.6"
              width={isLeadCar ? 28 : 44}
              height="4.8"
              rx="1.5"
              fill="#ffb547"
              opacity={0.75}
            />

            {/* Cockpit windshield angle line for locomotive */}
            {isLeadCar && (
              <path
                d="M42 12.5L52 20.5"
                stroke="#0d121d"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}

            {/* Signature Golden Signal Metro Stripe */}
            <rect
              x="0.5"
              y="23.5"
              width={isLeadCar ? 52 : 60}
              height="2"
              fill="#ffb547"
            />

            {/* Lower dark chassis underbody */}
            <rect
              x="2"
              y="28"
              width={isLeadCar ? 54 : 57}
              height="3.5"
              rx="1.5"
              fill="#2a3140"
            />

            {/* High-intensity front headlight */}
            {isLeadCar && (
              <>
                <circle cx="58" cy="26" r="2.2" fill="#fff4dc" />
                <circle cx="58" cy="26" r="4.5" fill="#ffb547" opacity={0.4} />
              </>
            )}

            {/* Wheel bogies with rotating spokes */}
            <g className="train__wheels" fill="#1b212c" stroke="#aeb8c8" strokeWidth="1">
              {[12, 22, 38, 48].map((wheelX: number) => (
                <g
                  key={wheelX}
                  transform={`translate(${wheelX}, 34)`}
                  className={spinning ? 'animate-[spin_0.6s_linear_infinite]' : ''}
                  style={{ transformOrigin: `${wheelX}px 34px` }}
                >
                  <circle r="4" fill="#141a24" stroke="#aab4c6" strokeWidth="1" />
                  <path d="M-3.5 0h7M0 -3.5v7" stroke="#eef2f8" strokeWidth="1" />
                  <circle r="1" fill="#ffb547" />
                </g>
              ))}
            </g>
          </g>
        )
      })}
    </svg>
  )
}
