import { useEffect, useRef, useState } from 'react'
import type { FC } from 'react'
import { MetroWorld } from '../3d/MetroWorld'

export const MetroCanvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const worldRef = useRef<MetroWorld | null>(null)
  const [isReady, setIsReady] = useState<boolean>(false)

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current
    if (!canvas) return

    let world: MetroWorld | null = null
    try {
      world = new MetroWorld(canvas)
      worldRef.current = world
      // Initial render frame ready
      setTimeout(() => setIsReady(true), 250)
    } catch (err: unknown) {
      console.error('Failed to initialize 3D Metro World:', err)
      setIsReady(true)
      return
    }

    // Scroll Handler
    const onScroll = (): void => {
      if (!world) return
      const maxScroll: number = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll: number = window.scrollY
      const ratio: number = maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0
      world.setJourney(ratio)
    }

    // Resize Handler
    const onResize = (): void => {
      if (!world) return
      world.resize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    // Initial scroll sync
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      world?.dispose()
      worldRef.current = null
    }
  }, [])

  return (
    <>
      {/* 3D Metro World Canvas */}
      <div
        className={`fixed inset-0 z-0 h-full w-full pointer-events-none transition-opacity duration-1000 ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>

      {/* Boot Status Pill (Fades out when line is powered up) */}
      {!isReady && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full border border-slate-200/90 bg-white/95 px-4 py-2 text-[11px] font-['Geist_Mono'] uppercase tracking-widest text-slate-700 shadow-lg backdrop-blur-md">
          <div className="relative h-1.5 w-12 overflow-hidden rounded-full bg-slate-200">
            <div className="absolute inset-y-0 w-1/2 rounded-full bg-amber-500 animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
          <span>POWERING UP 3D LINE...</span>
        </div>
      )}
    </>
  )
}

export default MetroCanvas
