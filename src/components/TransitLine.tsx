import { useMemo } from 'react'
import * as THREE from 'three'

type TransitLineProps = {
  points: [number, number, number][]
  color?: string
}

export const TransitLine: React.FC<TransitLineProps> = ({ points, color = '#3A3A3A' }) => {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))),
    [points]
  )

  return (
    <group>
      {/* The Track */}
      <mesh>
        <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* The Rails */}
      <mesh>
        <tubeGeometry args={[curve, 64, 0.04, 8, false]} />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </group>
  )
}
