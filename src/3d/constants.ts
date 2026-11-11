export interface Station3DConfig {
  id: string
  code: string
  title: string
  kicker: string
  color: string
  t: number // Position along the 0 -> 1 curve
  platformSide: 1 | -1 // Right or Left of track
  platformLength: number
  platformWidth: number
}

export const STATION_3D_CONFIGS: Station3DConfig[] = [
  {
    id: 'central',
    code: 'P0',
    title: 'Anand Central',
    kicker: 'Platform 0 · Anand Departures',
    color: '#ffb547',
    t: 0.05,
    platformSide: 1,
    platformLength: 26,
    platformWidth: 4.5,
  },
  {
    id: 'about',
    code: 'ST-01',
    title: 'Blueprint Terminal',
    kicker: 'Platform 1 · Overview & Story',
    color: '#ff7d8f',
    t: 0.20,
    platformSide: -1,
    platformLength: 24,
    platformWidth: 4.2,
  },
  {
    id: 'experience',
    code: 'ST-02',
    title: 'River Interchange',
    kicker: 'Platform 2 · Cable Bridge Crossing',
    color: '#6fd0ff',
    t: 0.38,
    platformSide: 1,
    platformLength: 28,
    platformWidth: 4.6,
  },
  {
    id: 'projects',
    code: 'ST-03',
    title: 'Portfolio Junction',
    kicker: 'Platform 3 · Flagship Summits',
    color: '#a993ff',
    t: 0.54,
    platformSide: -1,
    platformLength: 26,
    platformWidth: 4.4,
  },
  {
    id: 'skills',
    code: 'ST-04',
    title: 'Mountain Pass',
    kicker: 'Platform 4 · Operational Matrix',
    color: '#c6e66b',
    t: 0.69,
    platformSide: 1,
    platformLength: 24,
    platformWidth: 4.2,
  },
  {
    id: 'achievements',
    code: 'ST-05',
    title: 'Honours Platform',
    kicker: 'Platform 5 · State Honours',
    color: '#ffd166',
    t: 0.83,
    platformSide: -1,
    platformLength: 24,
    platformWidth: 4.2,
  },
  {
    id: 'contact',
    code: 'ST-06',
    title: 'City B Concourse',
    kicker: 'Platform 6 · City B Terminus',
    color: '#53e0c2',
    t: 0.95,
    platformSide: 1,
    platformLength: 26,
    platformWidth: 4.6,
  },
]

export const METRO_COLORS: {
  sky: number
  skyFog: number
  sun: number
  grass: number
  river: number
  concrete: number
  steel: number
  signal: number
  cobalt: number
  windowGlow: number
  tailRed: number
  cyanLivery: number
  whiteLivery: number
} = {
  sky: 0xbfe3f7,
  skyFog: 0xd9eefa,
  sun: 0xfffaed,
  grass: 0x5bb86a,
  river: 0x0ea5e9,
  concrete: 0xe2e8f0,
  steel: 0xf8fafc,
  signal: 0xf59e0b,
  cobalt: 0x1d4ed8,
  windowGlow: 0xffe6a3,
  tailRed: 0xef4444,
  cyanLivery: 0x0284c7,
  whiteLivery: 0xffffff,
}

export const TRAIN_SPECS: {
  leadLength: number
  coachLength: number
  width: number
  height: number
  wheelRadius: number
  bogieSpacing: number
} = {
  leadLength: 11.8,
  coachLength: 9.6,
  width: 2.5,
  height: 2.22,
  wheelRadius: 0.38,
  bogieSpacing: 6.8,
}
