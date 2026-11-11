import { useState, useEffect } from 'react'
import type { FC } from 'react'
import type { StationId } from './types/portfolio'
import { Header } from './components/Header'
import { RouteMap } from './components/RouteMap'
import { MetroCanvas } from './components/MetroCanvas'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Experience } from './sections/Experience'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'
import { Achievements } from './sections/Achievements'
import { Contact } from './sections/Contact'

const App: FC = () => {
  const [activeStation, setActiveStation] = useState<StationId>('central')

  // Smooth scroll handler to target section
  const handleSelectStation = (id: StationId): void => {
    setActiveStation(id)
    const element: HTMLElement | null = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Track active section on window scroll
  useEffect(() => {
    const sectionIds: StationId[] = [
      'central',
      'about',
      'experience',
      'projects',
      'skills',
      'achievements',
      'contact',
    ]

    const handleScroll = (): void => {
      const scrollPosition: number = window.scrollY + 250

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id: StationId = sectionIds[i]
        const el: HTMLElement | null = document.getElementById(id)
        if (el) {
          const top: number = el.offsetTop
          if (scrollPosition >= top) {
            setActiveStation(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen text-slate-900">
      {/* 3D Metro World: Interactive 3D Train & 7 Stations along curved rail line */}
      <MetroCanvas />

      {/* Subtle film grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Fixed Header */}
      <Header activeStation={activeStation} onSelectStation={handleSelectStation} />

      {/* Fixed Vertical Metro Route Map with Animated Train Indicator */}
      <RouteMap activeStation={activeStation} onSelectStation={handleSelectStation} />

      {/* Main Content Area - Pass-through pointer events to 3D canvas, cards handle their own clicks */}
      <main className="relative z-10 pointer-events-none px-4 sm:px-8 md:px-12 xl:pr-32">
        <Hero onExplore={handleSelectStation} />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
      </main>
    </div>
  )
}

export default App
