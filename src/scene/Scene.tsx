import { useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { TransitLine } from '../components/TransitLine'

const linePoints: [number, number, number][] = [
  [0, 0, 0],
  [10, 5, 0],
  [20, 10, 0],
  [30, 15, 0],
  [40, 20, 0],
]

/** Reads the scroll container from the DOM and drives the R3F camera along the path */
function CameraController() {
  const { camera } = useThree()

  const path = useMemo(
    () => new THREE.CatmullRomCurve3(linePoints.map(p => new THREE.Vector3(...p))),
    []
  )

  useFrame(() => {
    // The scrollable overlay in App.tsx
    const scrollEl = document.querySelector('.overflow-y-auto') as HTMLElement | null
    if (!scrollEl) return

    const scrollY = scrollEl.scrollTop
    const scrollHeight = scrollEl.scrollHeight - scrollEl.clientHeight
    const scrollFraction = scrollHeight > 0 ? Math.min(1, scrollY / scrollHeight) : 0

    const targetPoint = path.getPointAt(scrollFraction)
    const targetLookAt = path.getPointAt(Math.min(1, scrollFraction + 0.01))

    // Smoothly interpolate the camera position
    camera.position.lerp(targetPoint, 0.1)
    camera.lookAt(targetLookAt)
  })

  return null
}

function SceneContent() {
  return (
    <>
      <TransitLine points={linePoints} />
      <Station label="About" position={[0, 0, 0]} />
      <Station label="Experience" position={[10, 5, 0]} />
      <Station label="Projects" position={[20, 10, 0]} />
      <Station label="Skills" position={[30, 15, 0]} />
      <Station label="Achievements" position={[40, 20, 0]} />
    </>
  )
}

function Station({ label: _label, position }: { label: string; position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.5, 6]} />
        <meshStandardMaterial color="#222" roughness={0.9} metalness={0.1} />
      </mesh>

      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2, 1, 0.1]} />
        <meshStandardMaterial color="#fff" />
      </mesh>

      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <CameraController />
      <SceneContent />
    </Canvas>
  )
}

export default Scene
