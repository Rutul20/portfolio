import type React from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export function useScrollSync(
  path: THREE.CatmullRomCurve3,
  scrollRef: React.RefObject<HTMLDivElement | null>,
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>
) {
  useFrame(() => {
    if (!scrollRef.current || !cameraRef.current) return

    const scrollY = scrollRef.current.scrollTop
    const height = scrollRef.current.clientHeight
    const scrollFraction = Math.min(1, scrollY / (height - 200))

    const targetPoint = path.getPointAt(scrollFraction)
    const targetLookAt = path.getPointAt(Math.min(1, scrollFraction + 0.01))

    // Smoothly interpolate the camera position
    cameraRef.current.position.lerp(targetPoint, 0.1)
    cameraRef.current.lookAt(targetLookAt)
  })
}
